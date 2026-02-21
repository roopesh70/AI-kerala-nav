export default function TabBar({ tabs, activeTab, onTabChange }) {
    return (
        <div className="tab-bar" role="tablist" aria-label="Service information sections">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`${tab.id}-panel`}
                    className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.icon} {tab.label}
                </button>
            ))}
        </div>
    );
}
