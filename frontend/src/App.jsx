import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import ServiceResult from './components/ServiceResult';
import LifeEventMode from './components/LifeEventMode';
import HistoryPanel from './components/HistoryPanel';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [screen, setScreen] = useState('home'); // home | result | lifeEvent
  const [resultData, setResultData] = useState(null);
  const [language, setLanguage] = useState(() => localStorage.getItem('app_language') || 'en');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle'); // idle | loading | found | denied | unavailable

  useEffect(() => {
    document.documentElement.lang = language === 'ml' ? 'ml' : 'en';
    localStorage.setItem('app_language', language);
  }, [language]);

  // Request location on app start
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setLocationStatus('unavailable');
      return;
    }

    setLocationStatus('loading');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
        });
        setLocationStatus('found');
      },
      (error) => {
        console.log('Location error:', error.code, error.message);
        setLocationStatus('denied');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 },
    );
  }, []);

  // Save to localStorage history
  const saveToHistory = useCallback((query, data) => {
    try {
      const history = JSON.parse(localStorage.getItem('gsn_history') || '[]');
      const entry = {
        id: uuidv4(),
        query,
        type: data.lifeEvent ? 'life_event' : 'single_service',
        eventId: data.lifeEvent?.id || null,
        serviceId: data.serviceId || null,
        serviceName: data.lifeEvent
          ? `${data.lifeEvent.name} — ${data.lifeEvent.checklist?.length || 0} services`
          : (data.serviceName || 'General Query'),
        timestamp: new Date().toISOString(),
      };

      // Add to front, keep max 10
      const updated = [entry, ...history.filter(h => h.query !== query)].slice(0, 10);
      localStorage.setItem('gsn_history', JSON.stringify(updated));
    } catch { }
  }, []);

  const handleSearch = useCallback(async (query) => {
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          userId: 'anonymous',
          language,
          location: userLocation,
        }),
      });

      if (!res.ok) throw new Error('API request failed');

      const data = await res.json();

      setResultData(data);
      saveToHistory(query, data);

      if (data.lifeEvent) {
        setScreen('lifeEvent');
      } else {
        setScreen('result');
      }
    } catch (err) {
      console.error('Search failed:', err);
      // Show a fallback result
      setResultData({
        reply: language === 'ml'
          ? 'ക്ഷമിക്കണം, സേവനം ലഭ്യമല്ല. ദയവായി പിന്നീട് ശ്രമിക്കുക. ബാക്കെൻഡ് സെർവർ പ്രവർത്തിക്കുന്നുണ്ടോ എന്ന് ഉറപ്പാക്കുക.'
          : 'Sorry, the service is temporarily unavailable. Please try again later or check your internet connection. Make sure the backend server is running on port 5000.',
        serviceName: language === 'ml' ? 'സേവനം ലഭ്യമല്ല' : 'Service Unavailable',
        source: 'error',
      });
      setScreen('result');
    } finally {
      setIsLoading(false);
    }
  }, [language, saveToHistory, userLocation]);

  const goHome = useCallback(() => {
    setScreen('home');
    setResultData(null);
  }, []);

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setLocationStatus('unavailable');
      return;
    }

    setLocationStatus('loading');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
        });
        setLocationStatus('found');
      },
      (error) => {
        console.log('Location retry error:', error.code, error.message);
        setLocationStatus('denied');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 },
    );
  }, []);

  return (
    <>
      <Header
        onHistoryToggle={() => setHistoryOpen(!historyOpen)}
        language={language}
        onLanguageChange={setLanguage}
        locationStatus={locationStatus}
        onRequestLocation={requestLocation}
      />

      <main className="app-container">
        {screen === 'home' && (
          <HomeScreen onSearch={handleSearch} language={language} />
        )}

        {screen === 'result' && resultData && (
          <ServiceResult data={resultData} onBack={goHome} language={language} userLocation={userLocation} />
        )}

        {screen === 'lifeEvent' && resultData && (
          <LifeEventMode data={resultData} onBack={goHome} language={language} />
        )}

        {isLoading && screen === 'home' && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>{language === 'ml' ? 'ചോദ്യം പ്രോസസ് ചെയ്യുന്നു...' : 'Processing your query...'}</p>
          </div>
        )}
      </main>

      <HistoryPanel
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelect={(query) => handleSearch(query)}
        language={language}
      />
    </>
  );
}

export default App;
