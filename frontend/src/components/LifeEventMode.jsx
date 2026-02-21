import { useEffect, useState } from 'react';
import VoiceOutput from './VoiceOutput';

export default function LifeEventMode({ data, onBack, language }) {
    const [completedServices, setCompletedServices] = useState({});
    const [expandedIdx, setExpandedIdx] = useState(null);
    const event = data.lifeEvent;

    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('gsn_checklist_state') || '{}');
            if (saved[event.id]) setCompletedServices(saved[event.id]);
        } catch { }
    }, [event.id]);

    const toggleDone = (idx) => {
        const updated = { ...completedServices, [idx]: !completedServices[idx] };
        setCompletedServices(updated);
        try {
            const all = JSON.parse(localStorage.getItem('gsn_checklist_state') || '{}');
            all[event.id] = updated;
            localStorage.setItem('gsn_checklist_state', JSON.stringify(all));
        } catch { }
    };

    const doneCount = Object.values(completedServices).filter(Boolean).length;
    const totalCount = event.checklist.length;
    const progress = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;

    const getCardClass = (idx) => {
        if (completedServices[idx]) return 'le-card-done';
        if (idx === 0 || (idx > 0 && completedServices[idx - 1])) return 'le-card-priority';
        return 'le-card-pending';
    };

    const getStatusBadge = (idx) => {
        if (completedServices[idx]) return <span className="badge badge-done">✅ {language === 'ml' ? 'പൂർത്തിയായി' : 'Done'}</span>;
        if (idx === 0 || (idx > 0 && completedServices[idx - 1])) return <span className="badge badge-priority">🔥 {language === 'ml' ? 'മുൻഗണന' : 'Priority'}</span>;
        return <span className="badge badge-pending">{language === 'ml' ? 'ശേഷിക്കുന്നു' : 'Pending'}</span>;
    };

    const eventName = language === 'ml' && event.name_ml ? event.name_ml : event.name;
    const eventDesc = language === 'ml' && event.description_ml ? event.description_ml : event.description;

    return (
        <div className="result-screen app-container">
            <button className="back-btn" onClick={onBack}>
                ← {language === 'ml' ? 'തിരികെ' : 'Back'}
            </button>

            <div className="life-event-banner anim-float-up">
                <h2>🕊️ {eventName} — {totalCount} {language === 'ml' ? 'നടപടികൾ' : 'Procedures to Complete'}</h2>
                <p>{eventDesc}</p>
                <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>
                <div style={{ marginTop: 8, fontSize: 12, fontWeight: 800, color: 'var(--muted)' }}>
                    {doneCount} / {totalCount} {language === 'ml' ? 'പൂർത്തിയാക്കി' : 'completed'}
                </div>
            </div>

            {event.checklist.map((item, idx) => (
                <div
                    key={idx}
                    className={`le-card ${getCardClass(idx)} anim-float-up`}
                    style={{ animationDelay: `${idx * 0.08}s` }}
                >
                    <div
                        className="le-card-header"
                        onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className={`route-dot ${completedServices[idx] ? 'route-dot-mint' : 'route-dot-sky'}`}
                            style={{ width: 36, height: 36, borderRadius: 10, fontSize: 14 }}>
                            {completedServices[idx] ? '✓' : idx + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 800, fontSize: 15 }}>
                                {language === 'ml' && item.task_ml ? item.task_ml : item.task}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                                {item.office} · {item.processingTime || 'N/A'} · {item.fee || 'Free'}
                            </div>
                        </div>
                        {getStatusBadge(idx)}
                        <span style={{ fontSize: 18, marginLeft: 8 }}>{expandedIdx === idx ? '▲' : '▼'}</span>
                    </div>

                    {expandedIdx === idx && (
                        <div className="le-card-body">
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                                <span className="badge badge-fee">⏱️ {item.processingTime || 'N/A'}</span>
                                <span className="badge badge-akshaya">💰 {item.fee || 'Free'}</span>
                                <span className="badge badge-office">🏢 {item.office}</span>
                            </div>

                            {item.documents && item.documents.length > 0 && (
                                <div style={{ marginBottom: 16 }}>
                                    <div className="label" style={{ marginBottom: 8 }}>
                                        {language === 'ml' ? 'ആവശ്യമായ രേഖകൾ' : 'REQUIRED DOCUMENTS'}
                                    </div>
                                    {item.documents.map((doc, di) => (
                                        <div key={di} style={{ fontSize: 13, padding: '4px 0', display: 'flex', gap: 6 }}>
                                            <span>📄</span> {doc}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {item.note && (
                                <div className="alert-card alert-info">
                                    💡 {item.note}
                                </div>
                            )}

                            {item.mapQuery && (
                                <a href={`https://www.google.com/maps/search/${item.mapQuery.replace(/\s+/g, '+')}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="clay-btn clay-btn-ghost" style={{ marginTop: 12, fontSize: 12, padding: '8px 16px' }}>
                                    🧭 {language === 'ml' ? 'ദിശ കാണുക' : 'Get Directions'}
                                </a>
                            )}

                            <button
                                className={`clay-btn ${completedServices[idx] ? 'clay-btn-ghost' : 'clay-btn-success'}`}
                                style={{ marginTop: 12, width: '100%' }}
                                onClick={(e) => { e.stopPropagation(); toggleDone(idx); }}
                            >
                                {completedServices[idx]
                                    ? (language === 'ml' ? 'പൂർത്തിയായതായി അടയാളപ്പെടുത്തി ✓' : 'Marked as Done ✓')
                                    : (language === 'ml' ? 'പൂർത്തിയായതായി അടയാളപ്പെടുത്തുക' : 'Mark as Done ✓')}
                            </button>
                        </div>
                    )}
                </div>
            ))}

            {data.reply && (
                <div className="clay-card anim-float-up" style={{ padding: '24px 28px', marginTop: 24 }}>
                    <h2 style={{ marginBottom: 12 }}>💡 {language === 'ml' ? 'AI വിശദാംശം' : 'AI Guidance'}</h2>
                    <VoiceOutput text={data.reply} language={language} />
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: 14 }}>
                        {data.reply}
                    </div>
                </div>
            )}
        </div>
    );
}
