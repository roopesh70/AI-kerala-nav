export default function InfoCardsStrip({ data, language }) {
    const cards = [
        {
            icon: '⏱️',
            label: language === 'ml' ? 'പ്രോസസിംഗ് സമയം' : 'Processing Time',
            value: data.processingTime || 'N/A',
            colorClass: 'info-card-sand'
        },
        {
            icon: '📅',
            label: language === 'ml' ? 'സാധുത' : 'Validity',
            value: data.validity || 'N/A',
            colorClass: 'info-card-mint'
        },
        {
            icon: '💰',
            label: language === 'ml' ? 'ഫീസ്' : 'Fee',
            value: typeof data.fee === 'object' ? Object.values(data.fee)[0] : (data.fee || 'Varies'),
            sub: typeof data.fee === 'object' ? 'See Fees tab for full breakdown' : null,
            colorClass: 'info-card-lemon'
        },
        {
            icon: '🏢',
            label: language === 'ml' ? 'അപേക്ഷിക്കേണ്ട ഓഫീസ്' : 'Apply At',
            value: data.department || data.applyAt || 'N/A',
            colorClass: 'info-card-sky'
        },
        {
            icon: '🏪',
            label: language === 'ml' ? 'മികച്ച സമയം' : 'Best Visit Time',
            value: data.bestVisitTime || '9-11 AM',
            colorClass: 'info-card-lilac'
        },
    ];

    return (
        <div className="info-cards">
            {cards.map((card, i) => (
                <div key={i} className={`info-card ${card.colorClass}`}>
                    <div className="icon">{card.icon}</div>
                    <div className="label">{card.label}</div>
                    <div className="value">{card.value}</div>
                    {card.sub && <div className="sub">{card.sub}</div>}
                </div>
            ))}
        </div>
    );
}
