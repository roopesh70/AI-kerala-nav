export default function HistoryPanel({ isOpen, onClose, onSelect, language }) {
    const history = getHistory();

    function getHistory() {
        try {
            return JSON.parse(localStorage.getItem('gsn_history') || '[]');
        } catch { return []; }
    }

    function clearAll() {
        if (confirm(language === 'ml' ? 'എല്ലാ ചരിത്രവും മായ്ക്കണോ?' : 'Clear all search history?')) {
            localStorage.setItem('gsn_history', '[]');
            onClose(); // force re-render by closing
        }
    }

    function deleteItem(id) {
        const updated = history.filter(h => h.id !== id);
        localStorage.setItem('gsn_history', JSON.stringify(updated));
        onClose(); // force re-render
    }

    function relativeTime(timestamp) {
        const now = Date.now();
        const diff = now - new Date(timestamp).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return language === 'ml' ? 'ഇപ്പോൾ' : 'Just now';
        if (mins < 60) return `${mins} ${language === 'ml' ? 'മിനിറ്റ് മുമ്പ്' : 'min ago'}`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours} ${language === 'ml' ? 'മണിക്കൂർ മുമ്പ്' : 'hr ago'}`;
        const days = Math.floor(hours / 24);
        if (days === 1) return language === 'ml' ? 'ഇന്നലെ' : 'Yesterday';
        return `${days} ${language === 'ml' ? 'ദിവസം മുമ്പ്' : 'days ago'}`;
    }

    return (
        <>
            <div className={`history-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />

            <div className={`history-panel ${isOpen ? 'open' : ''}`}>
                {/* Drag handle (mobile) */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                    <div style={{ width: 40, height: 4, background: 'var(--muted)', borderRadius: 999, opacity: 0.3 }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h2>{language === 'ml' ? 'സമീപകാല തിരയലുകൾ' : 'Recent Searches'}</h2>
                    {history.length > 0 && (
                        <button className="clay-btn clay-btn-danger" style={{ fontSize: 11, padding: '6px 14px', minHeight: 32 }} onClick={clearAll}>
                            {language === 'ml' ? 'എല്ലാം മായ്ക്കുക' : 'Clear All'}
                        </button>
                    )}
                </div>

                <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
                    🔒 {language === 'ml' ? 'നിങ്ങളുടെ ഉപകരണത്തിൽ മാത്രം — ഒരിക്കലും അയയ്ക്കില്ല' : 'Stored on your device only — never sent anywhere'}
                </div>

                {history.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
                        <p style={{ fontWeight: 700, fontSize: 14 }}>
                            {language === 'ml' ? 'ചരിത്രം ഇല്ല' : 'No search history yet'}
                        </p>
                    </div>
                ) : (
                    history.map((item) => (
                        <div key={item.id} className="hist-item" onClick={() => { onSelect(item.query); onClose(); }}>
                            <div style={{ fontSize: 20 }}>
                                {item.type === 'life_event' ? '🕊️' : '📄'}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 800, fontSize: 14 }}>{item.query}</div>
                                <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                                    {item.serviceName} · {relativeTime(item.timestamp)}
                                </div>
                            </div>
                            <span className={`badge ${item.type === 'life_event' ? 'badge-event' : 'badge-service'}`}>
                                {item.type === 'life_event' ? (language === 'ml' ? 'ജീവിത സംഭവം' : 'Life Event') : (language === 'ml' ? 'സേവനം' : 'Service')}
                            </span>
                            <button onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: 4, opacity: 0.4 }}
                                aria-label="Delete this item">
                                ×
                            </button>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}
