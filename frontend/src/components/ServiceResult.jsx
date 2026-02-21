import { useState, useMemo } from 'react';
import InfoCardsStrip from './InfoCardsStrip';
import TabBar from './TabBar';
import RouteMap from './RouteMap';
import DocumentChecklist from './DocumentChecklist';
import FeeTable from './FeeTable';
import MapView from './MapView';
import VoiceOutput from './VoiceOutput';

/**
 * Simple markdown renderer — converts markdown text to React elements.
 * Handles: headings, bold, bullets, horizontal rules, links, and line breaks.
 */
function renderMarkdown(text) {
    if (!text) return null;

    const lines = text.split('\n');
    const elements = [];
    let listItems = [];
    let listKey = 0;

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(
                <ul key={`list-${listKey}`} className="md-list">
                    {listItems.map((item, i) => <li key={i}>{parseInline(item)}</li>)}
                </ul>
            );
            listItems = [];
            listKey++;
        }
    };

    const parseInline = (line) => {
        // Process inline formatting: bold, links, inline code
        const parts = [];
        let remaining = line;
        let partKey = 0;

        while (remaining.length > 0) {
            // Bold **text** or __text__
            const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
            if (boldMatch && boldMatch.index !== undefined) {
                if (boldMatch.index > 0) {
                    parts.push(<span key={partKey++}>{remaining.slice(0, boldMatch.index)}</span>);
                }
                parts.push(<strong key={partKey++}>{boldMatch[1]}</strong>);
                remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
                continue;
            }

            // Links [text](url)
            const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
            if (linkMatch && linkMatch.index !== undefined) {
                if (linkMatch.index > 0) {
                    parts.push(<span key={partKey++}>{remaining.slice(0, linkMatch.index)}</span>);
                }
                parts.push(
                    <a key={partKey++} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--coral)', textDecoration: 'underline' }}>
                        {linkMatch[1]}
                    </a>
                );
                remaining = remaining.slice(linkMatch.index + linkMatch[0].length);
                continue;
            }

            // No more inline formatting found
            parts.push(<span key={partKey++}>{remaining}</span>);
            break;
        }

        return parts.length === 1 ? parts[0] : <>{parts}</>;
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Empty line
        if (!trimmed) {
            flushList();
            continue;
        }

        // Horizontal rule
        if (/^-{3,}$/.test(trimmed) || /^_{3,}$/.test(trimmed) || /^\*{3,}$/.test(trimmed)) {
            flushList();
            elements.push(<hr key={`hr-${i}`} className="md-hr" />);
            continue;
        }

        // Headings
        if (trimmed.startsWith('## ')) {
            flushList();
            elements.push(<h3 key={`h-${i}`} className="md-heading">{parseInline(trimmed.slice(3))}</h3>);
            continue;
        }
        if (trimmed.startsWith('# ')) {
            flushList();
            elements.push(<h2 key={`h-${i}`} className="md-heading-lg">{parseInline(trimmed.slice(2))}</h2>);
            continue;
        }

        // Bullet list
        if (/^[-•*]\s/.test(trimmed) || /^✅\s/.test(trimmed) || /^[1-9]️⃣\s/.test(trimmed)) {
            const content = trimmed.replace(/^[-•*]\s/, '').replace(/^✅\s/, '✅ ');
            listItems.push(content);
            continue;
        }

        // Numbered list (1. 2. etc)
        if (/^\d+\.\s/.test(trimmed)) {
            listItems.push(trimmed);
            continue;
        }

        // Sub-bullet (indented with •)
        if (/^\s+•\s/.test(line)) {
            listItems.push(line.trim().replace(/^•\s/, '  • '));
            continue;
        }

        // Regular paragraph
        flushList();
        elements.push(<p key={`p-${i}`} className="md-para">{parseInline(trimmed)}</p>);
    }

    flushList();
    return elements;
}

export default function ServiceResult({ data, onBack, language, userLocation }) {
    const [activeTab, setActiveTab] = useState('steps');
    const isStructuredService = data.serviceId && (data.steps || data.requiredDocuments);

    const tabs = [
        { id: 'steps', icon: '📋', label: language === 'ml' ? 'ഘട്ടങ്ങൾ' : 'Steps' },
        { id: 'documents', icon: '📎', label: language === 'ml' ? 'രേഖകൾ' : 'Documents' },
        { id: 'map', icon: '🗺️', label: language === 'ml' ? 'മാപ്പ്' : 'Map & Office' },
        { id: 'fees', icon: '💳', label: language === 'ml' ? 'ഫീസ്' : 'Fees' },
    ];

    const serviceName = language === 'ml' && data.serviceName_ml ? data.serviceName_ml : data.serviceName;

    // Render AI reply as styled markdown
    const renderedReply = useMemo(() => renderMarkdown(data.reply), [data.reply]);

    if (!isStructuredService) {
        return (
            <div className="result-screen app-container">
                <button className="back-btn" onClick={onBack}>
                    ← {language === 'ml' ? 'തിരികെ' : 'Back'}
                </button>

                <div className="clay-card anim-float-up" style={{ padding: '28px 32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                        <span style={{ fontSize: 32 }}>🤖</span>
                        <div>
                            <h2 style={{ marginBottom: 4 }}>{language === 'ml' ? 'AI സഹായകൻ' : 'AI Assistant'}</h2>
                            {data.source && (
                                <span className="badge badge-service" style={{ marginTop: 4, fontSize: 12 }}>
                                    ⚡ {data.source === 'gemini' ? 'Gemini AI' : data.source === 'huggingface' ? 'HuggingFace' : data.source === 'error' ? 'Service' : data.source}
                                </span>
                            )}
                        </div>
                    </div>

                    <VoiceOutput text={data.reply} language={language} />

                    <div className="md-content">
                        {renderedReply || (
                            <p>{language === 'ml' ? 'ക്ഷമിക്കണം, ഈ ചോദ്യത്തിന് ഉത്തരം കണ്ടെത്താൻ കഴിഞ്ഞില്ല.' : 'Sorry, I could not find an answer to your question.'}</p>
                        )}
                    </div>
                </div>

                <div className="clay-card anim-float-up anim-delay-2" style={{ padding: '24px 28px', marginTop: 20 }}>
                    <MapView
                        applyAt={data.applyAt || 'Government Office'}
                        serviceName={data.serviceName || 'Service Centre'}
                        language={language}
                        userLocation={userLocation}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="result-screen app-container">
            <button className="back-btn" onClick={onBack}>
                ← {language === 'ml' ? 'തിരികെ' : 'Back'}
            </button>

            <div className="clay-card anim-float-up" style={{ padding: '24px 28px', marginBottom: 24 }}>
                <div className="result-header">
                    <h1>🏛️ {serviceName || 'Government Service'}</h1>
                </div>

                <div className="result-badges">
                    {data.akshayaEligible && (
                        <span className="badge badge-akshaya">✓ {language === 'ml' ? 'അക്ഷയ യോഗ്യം' : 'Akshaya Eligible'}</span>
                    )}
                    {data.department && (
                        <span className="badge badge-office">📍 {data.department}</span>
                    )}
                    {data.source && (
                        <span className="badge badge-service">⚡ {data.source === 'firestore' ? (language === 'ml' ? 'സ്ഥിരീകരിച്ച വിവരങ്ങൾ' : 'Verified Data') : data.source}</span>
                    )}
                </div>

                <InfoCardsStrip data={data} language={language} />
            </div>

            <div className="anim-float-up anim-delay-2">
                <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            <div className="tab-content anim-float-up anim-delay-3" role="tabpanel" id={`${activeTab}-panel`}>
                <div className="clay-card" style={{ padding: '24px 28px' }}>
                    {activeTab === 'steps' && data.steps && data.steps.length > 0 && (
                        <RouteMap steps={data.steps} serviceId={data.serviceId} language={language} />
                    )}
                    {activeTab === 'steps' && (!data.steps || data.steps.length === 0) && (
                        <p className="muted">{language === 'ml' ? 'ഘട്ടങ്ങൾ ലഭ്യമല്ല' : 'No step-by-step guide available for this service.'}</p>
                    )}

                    {activeTab === 'documents' && data.requiredDocuments && data.requiredDocuments.length > 0 && (
                        <DocumentChecklist documents={data.requiredDocuments} serviceId={data.serviceId} language={language} />
                    )}
                    {activeTab === 'documents' && (!data.requiredDocuments || data.requiredDocuments.length === 0) && (
                        <p className="muted">{language === 'ml' ? 'രേഖകൾ ലഭ്യമല്ല' : 'No document requirements available.'}</p>
                    )}

                    {activeTab === 'map' && (
                        <MapView
                            applyAt={data.applyAt || data.department}
                            serviceName={data.serviceName}
                            language={language}
                            userLocation={userLocation}
                        />
                    )}

                    {activeTab === 'fees' && <FeeTable fee={data.fee} language={language} />}
                    {activeTab === 'fees' && !data.fee && (
                        <p className="muted">{language === 'ml' ? 'ഫീസ് വിവരങ്ങൾ ലഭ്യമല്ല' : 'No fee information available.'}</p>
                    )}
                </div>
            </div>

            {data.reply && (
                <div className="clay-card anim-float-up anim-delay-4" style={{ padding: '24px 28px', marginTop: 24 }}>
                    <h2 style={{ marginBottom: 12 }}>💡 {language === 'ml' ? 'AI വിശദാംശങ്ങൾ' : 'AI Detailed Guidance'}</h2>
                    <VoiceOutput text={data.reply} language={language} />
                    <div className="md-content">
                        {renderedReply}
                    </div>
                </div>
            )}
        </div>
    );
}
