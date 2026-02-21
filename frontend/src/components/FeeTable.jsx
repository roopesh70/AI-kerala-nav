export default function FeeTable({ fee, language }) {
    if (!fee) return null;

    // If fee is a simple string
    if (typeof fee === 'string') {
        return (
            <div>
                <h2 style={{ marginBottom: 16 }}>{language === 'ml' ? 'ഫീസ് വിവരങ്ങൾ' : 'Fee Details'}</h2>
                <div className="info-card info-card-lemon" style={{ display: 'inline-block', padding: 20 }}>
                    <div className="label">{language === 'ml' ? 'ഫീസ്' : 'FEE'}</div>
                    <div className="value">{fee}</div>
                </div>
            </div>
        );
    }

    // If fee is an object with breakdown
    const entries = Object.entries(fee);

    return (
        <div>
            <h2 style={{ marginBottom: 16 }}>{language === 'ml' ? 'ഫീസ് വിവരങ്ങൾ' : 'Fee Details'}</h2>
            <table className="fee-table">
                <thead>
                    <tr>
                        <th>{language === 'ml' ? 'വിഭാഗം' : 'Category'}</th>
                        <th>{language === 'ml' ? 'തുക' : 'Amount'}</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map(([key, value]) => (
                        <tr key={key}>
                            <td>{key}</td>
                            <td style={{ fontWeight: 900, fontSize: 16 }}>{value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
