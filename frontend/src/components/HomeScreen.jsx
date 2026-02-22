import { useState } from 'react';
import VoiceInput from './VoiceInput';

const QUICK_CHIPS = [
    { icon: '🪪', label: 'Aadhaar Update', label_ml: 'ആധാർ അപ്ഡേറ്റ്', query: 'How to update Aadhaar address?', query_ml: 'ആധാർ വിലാസം എങ്ങനെ മാറ്റാം?' },
    { icon: '📄', label: 'Income Cert', label_ml: 'വരുമാന സർട്ടിഫിക്കറ്റ്', query: 'How to get income certificate?', query_ml: 'വരുമാന സർട്ടിഫിക്കറ്റ് എങ്ങനെ ലഭിക്കും?' },
    { icon: '🏠', label: 'Land Record', label_ml: 'ഭൂമി രേഖ', query: 'How to get land record?', query_ml: 'ഭൂമി രേഖ എങ്ങനെ ലഭിക്കും?' },
    { icon: '👶', label: 'Birth Cert', label_ml: 'ജനന സർട്ടിഫിക്കറ്റ്', query: 'How to get birth certificate?', query_ml: 'ജനന സർട്ടിഫിക്കറ്റ് എങ്ങനെ ലഭിക്കും?' },
    { icon: '💼', label: 'Pension', label_ml: 'പെൻഷൻ', query: 'How to apply for pension?', query_ml: 'പെൻഷന് എങ്ങനെ അപേക്ഷിക്കാം?' },
    { icon: '🏭', label: 'Business', label_ml: 'ബിസിനസ്', query: 'I want to start a new business', query_ml: 'ഞാൻ ഒരു പുതിയ ബിസിനസ്സ് ആരംഭിക്കാൻ ആഗ്രഹിക്കുന്നു' },
];

export default function HomeScreen({ onSearch, language }) {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (q) => {
        const searchQuery = q || query;
        if (!searchQuery.trim()) return;
        setIsLoading(true);
        await onSearch(searchQuery.trim());
        setIsLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSubmit();
    };

    const handleVoiceTranscript = (transcript) => {
        setQuery(transcript);
        handleSubmit(transcript);
    };

    return (
        <div className="home-screen">
            <div className="hero-card clay-card anim-float-up">
                <div className="overline anim-float-up anim-delay-1">
                    {language === 'ml' ? 'പൗരസേവന സഹായി' : 'CITIZEN SERVICES'}
                </div>

                <h1 className="hero-title anim-float-up anim-delay-1" style={{ marginTop: 12 }}>
                    {language === 'ml' ? 'കേരള AI നാവിഗേറ്റർ' : 'Kerala AI Navigator'}
                </h1>

                <p className="subtitle anim-float-up anim-delay-2">
                    {language === 'ml'
                        ? 'സർട്ടിഫിക്കറ്റുകൾ, സ്‌കീമുകൾ, പെൻഷൻ, അനുമതികൾ എന്നിവയെ കുറിച്ച് ചോദിക്കൂ'
                        : 'Ask about certificates, schemes, pensions, licenses & more...'}
                </p>

                <div className="search-row anim-float-up anim-delay-2">
                    <input
                        className="clay-input"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={language === 'ml' ? 'ഉദാ: വരുമാന സർട്ടിഫിക്കറ്റ് എങ്ങനെ ലഭിക്കും?' : 'Try: Income certificate? Pension? Ration card?'}
                        disabled={isLoading}
                    />
                    <button
                        className="clay-btn clay-btn-primary ask-btn"
                        onClick={() => handleSubmit()}
                        disabled={isLoading || !query.trim()}
                        aria-label={language === 'ml' ? 'ചോദിക്കൂ' : 'Ask question'}
                    >
                        {isLoading ? (
                            <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></span>
                        ) : (
                            language === 'ml' ? 'ചോദിക്കൂ' : 'Ask'
                        )}
                    </button>
                </div>

                <div className="anim-float-up anim-delay-3">
                    <VoiceInput onTranscript={handleVoiceTranscript} language={language} />
                </div>

                <div className="chips-grid anim-float-up anim-delay-4">
                    {QUICK_CHIPS.map((chip) => (
                        <button
                            key={chip.query}
                            className="chip"
                            onClick={() => {
                                const q = language === 'ml' ? chip.query_ml : chip.query;
                                setQuery(q);
                                handleSubmit(q);
                            }}
                            disabled={isLoading}
                            aria-label={language === 'ml' ? chip.label_ml : chip.label}
                            title={language === 'ml' ? chip.label_ml : chip.label}
                        >
                            {chip.icon} {language === 'ml' ? chip.label_ml : chip.label}
                        </button>
                    ))}
                </div>

                <p className="muted anim-float-up anim-delay-5" style={{
                    marginTop: 24,
                    fontSize: 13,
                    lineHeight: 1.6,
                    whiteSpace: 'pre-line'
                }}
                >
                    {language === 'ml'
                        ? '✓ സർക്കാർ പൗരസേവന കേന്ദ്രങ്ങളിലെ സേവന വിവരങ്ങൾ വിശദീകരിക്കുന്നു.\n ✓ എല്ലാവർക്കും മനസ്സിലാകുന്ന ലളിതമായ മലയാളത്തിൽ.'
                        : '✓ Real government service info for Kerala\n ✓ Available in Malayalam & English for all citizens'}
                </p>
            </div>
        </div>
    );
}
