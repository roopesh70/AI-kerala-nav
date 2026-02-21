import { useState, useEffect } from 'react';

export default function DocumentChecklist({ documents, serviceId, language }) {
    const [checked, setChecked] = useState({});

    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('gsn_doc_checked') || '{}');
            if (saved[serviceId]) setChecked(saved[serviceId]);
        } catch { }
    }, [serviceId]);

    const toggleDoc = (idx) => {
        const updated = { ...checked, [idx]: !checked[idx] };
        setChecked(updated);
        try {
            const all = JSON.parse(localStorage.getItem('gsn_doc_checked') || '{}');
            all[serviceId] = updated;
            localStorage.setItem('gsn_doc_checked', JSON.stringify(all));
        } catch { }
    };

    if (!documents || documents.length === 0) return null;

    const checkedCount = Object.values(checked).filter(Boolean).length;

    return (
        <div>
            <h2 style={{ marginBottom: 16 }}>
                {language === 'ml' ? 'ആവശ്യമായ രേഖകൾ' : 'Required Documents'}
            </h2>

            {documents.map((doc, idx) => (
                <div
                    key={idx}
                    className={`doc-item ${checked[idx] ? 'checked' : ''}`}
                    onClick={() => toggleDoc(idx)}
                    role="checkbox"
                    aria-checked={!!checked[idx]}
                    aria-label={`${doc} — ${checked[idx] ? 'checked' : 'unchecked'}`}
                >
                    <div className="doc-checkbox">
                        {checked[idx] ? '✓' : ''}
                    </div>
                    <div className="doc-info">
                        <div className="doc-name">{doc}</div>
                    </div>
                    <span className="doc-badge-original">Original</span>
                </div>
            ))}

            <div className="alert-card alert-info" style={{ marginTop: 16 }}>
                ℹ️ {checkedCount} {language === 'ml' ? `/ ${documents.length} രേഖകൾ തയ്യാർ` : `of ${documents.length} documents ready`}
            </div>
        </div>
    );
}
