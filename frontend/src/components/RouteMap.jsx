import { useState, useEffect } from 'react';

const DOT_COLORS = ['route-dot-sky', 'route-dot-peach', 'route-dot-lemon', 'route-dot-lilac', 'route-dot-mint'];
const LINE_COLORS = ['route-line-sky-peach', 'route-line-peach-lemon', 'route-line-lemon-lilac', 'route-line-lilac-mint', 'route-line-mint-sky'];

export default function RouteMap({ steps, serviceId, language }) {
    const [completed, setCompleted] = useState({});

    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('gsn_step_state') || '{}');
            if (saved[serviceId]) setCompleted(saved[serviceId]);
        } catch { }
    }, [serviceId]);

    const toggleComplete = (idx) => {
        const updated = { ...completed, [idx]: !completed[idx] };
        setCompleted(updated);
        try {
            const all = JSON.parse(localStorage.getItem('gsn_step_state') || '{}');
            all[serviceId] = updated;
            localStorage.setItem('gsn_step_state', JSON.stringify(all));
        } catch { }
    };

    if (!steps || steps.length === 0) return null;

    return (
        <div className="route-steps">
            <h2 style={{ marginBottom: 20 }}>
                {language === 'ml' ? 'നടപടി ക്രമം' : 'Route Map: How to Apply'}
            </h2>

            {steps.map((step, idx) => {
                const isLast = idx === steps.length - 1;
                const dotColor = completed[idx] ? 'route-dot-mint' : (DOT_COLORS[idx % DOT_COLORS.length]);
                const lineColor = LINE_COLORS[idx % LINE_COLORS.length];

                return (
                    <div className="route-step anim-float-up" style={{ animationDelay: `${idx * 0.1}s` }} key={idx}>
                        <div className="route-connector">
                            <div
                                className={`route-dot ${dotColor}`}
                                onClick={() => toggleComplete(idx)}
                                title={completed[idx] ? 'Mark incomplete' : 'Mark complete'}
                                style={{ cursor: 'pointer' }}
                            >
                                {completed[idx] ? '✓' : idx + 1}
                            </div>
                            {!isLast && <div className={`route-line ${completed[idx] ? 'route-line-mint-sky' : lineColor}`} />}
                        </div>

                        <div className="route-content">
                            <div className="label" style={{ marginBottom: 4 }}>
                                {language === 'ml' ? `ഘട്ടം ${idx + 1} / ${steps.length}` : `STEP ${idx + 1} OF ${steps.length}`}
                            </div>
                            <h3 style={{ textDecoration: completed[idx] ? 'line-through' : 'none', opacity: completed[idx] ? 0.6 : 1 }}>
                                {step}
                            </h3>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
