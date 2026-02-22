import { useState, useEffect } from 'react';

export default function Header({ onHistoryToggle, language, onLanguageChange, locationStatus, onRequestLocation }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const getLocationIcon = () => {
        if (locationStatus === 'found') return '📍';
        if (locationStatus === 'loading') return '🔄';
        if (locationStatus === 'denied') return '❌';
        return '📍';
    };

    const getLocationTitle = () => {
        if (locationStatus === 'found') return language === 'ml' ? 'സ്ഥാനം കണ്ടെത്തി' : 'Location found';
        if (locationStatus === 'loading') return language === 'ml' ? 'സ്ഥാനം തിരയുന്നു...' : 'Finding location...';
        if (locationStatus === 'denied') return language === 'ml' ? 'സ്ഥാനം നിഷേധിച്ചു - വീണ്ടും ശ്രമിക്കുക' : 'Location denied - tap to retry';
        return language === 'ml' ? 'സ്ഥാനം സഹായം' : 'Enable location';
    };

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="header-logo">
                🌿 Saha AI
            </div>
            <div className="header-actions">
                <button
                    className="header-icon-btn"
                    onClick={onRequestLocation}
                    aria-label={getLocationTitle()}
                    title={getLocationTitle()}
                    disabled={locationStatus === 'loading'}
                >
                    {getLocationIcon()}
                </button>
                <button
                    className="header-icon-btn"
                    onClick={onHistoryToggle}
                    aria-label="View search history"
                    title="Search History"
                >
                    🕐
                </button>
                <div className="lang-toggle" role="group" aria-label="Select language">
                    <button
                        className={language === 'en' ? 'active' : ''}
                        onClick={() => onLanguageChange('en')}
                        aria-pressed={language === 'en'}
                    >
                        EN
                    </button>
                    <button
                        className={language === 'ml' ? 'active' : ''}
                        onClick={() => onLanguageChange('ml')}
                        aria-pressed={language === 'ml'}
                    >
                        മല
                    </button>
                </div>
            </div>
        </header>
    );
}
