import { useEffect, useState } from 'react';

export default function MapView({ applyAt, serviceName, language, userLocation: parentLocation }) {
    const [userLocation, setUserLocation] = useState(parentLocation || null);
    const [locationStatus, setLocationStatus] = useState(parentLocation ? 'granted' : 'idle');

    const serviceOffice = applyAt || serviceName || 'Government Office';
    const searchTerm = serviceOffice.replace(/\//g, ' ').replace(/\s+/g, ' ').trim();

    useEffect(() => {
        if (parentLocation) {
            setUserLocation(parentLocation);
            setLocationStatus('granted');
            return;
        }
        if (!('geolocation' in navigator)) {
            setLocationStatus('unsupported');
            return;
        }
        setLocationStatus('requesting');
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLocation({
                    lat: Number(pos.coords.latitude.toFixed(6)),
                    lng: Number(pos.coords.longitude.toFixed(6)),
                });
                setLocationStatus('granted');
            },
            () => setLocationStatus('denied'),
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
        );
    }, [parentLocation]);

    const locationSuffix = userLocation?.lat && userLocation?.lng
        ? `&ll=${userLocation.lat},${userLocation.lng}&z=13`
        : '';
    const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(searchTerm + ' Kerala')}${locationSuffix}&output=embed`;
    const searchUrl = userLocation?.lat && userLocation?.lng
        ? `https://www.google.com/maps/search/${encodeURIComponent(searchTerm)}/@${userLocation.lat},${userLocation.lng},14z`
        : `https://www.google.com/maps/search/${encodeURIComponent(searchTerm + ' Kerala')}`;

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                <h2>{language === 'ml' ? '🗺️ സമീപത്തെ സേവന കേന്ദ്രങ്ങൾ' : '🗺️ Nearest Service Centres'}</h2>
            </div>

            <div className="map-embed" style={{ borderRadius: 16, overflow: 'hidden', border: '2px solid rgba(0,0,0,0.06)' }}>
                <iframe
                    src={embedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0, display: 'block' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map showing ${searchTerm}`}
                />
            </div>

            <div className="alert-card alert-success" style={{ marginTop: 12 }}>
                📍 {language === 'ml' ? `Showing "${searchTerm}"` : `Showing "${searchTerm}"`}
            </div>

            {locationStatus !== 'granted' && (
                <div className="alert-card alert-warning" style={{ marginTop: 10 }}>
                    {language === 'ml'
                        ? 'കൃത്യമായ സമീപ ഓഫിസുകൾ കാണാൻ location അനുമതി അനുവദിക്കുക.'
                        : 'Allow location permission to see offices closest to you.'}
                </div>
            )}

            <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap', fontSize: 12, fontWeight: 700 }}>
                <span>🔴 {language === 'ml' ? 'സേവന കേന്ദ്രങ്ങൾ' : 'Service Offices'}</span>
                {userLocation && <span>🔵 {language === 'ml' ? 'നിങ്ങൾ' : 'Your Location'}</span>}
            </div>

            <div className="map-fallback" style={{ marginTop: 16 }}>
                <a
                    href={searchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Search for ${searchTerm} on Google Maps`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                >
                    🔍 {language === 'ml'
                        ? `"${searchTerm}" Google Maps-ൽ തുറക്കുക →`
                        : `Open "${searchTerm}" in Google Maps →`}
                </a>
            </div>
        </div>
    );
}
