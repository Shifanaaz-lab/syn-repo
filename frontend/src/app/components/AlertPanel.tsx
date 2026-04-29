interface AlertPanelProps {
  alerts: string[];
}

export function AlertPanel({ alerts }: AlertPanelProps) {
  const getAlertColor = (alert: string) => {
    if (alert.includes('CRITICAL')) return 'text-red-400 border-red-500 bg-red-500/10';
    if (alert.includes('WARNING')) return 'text-yellow-400 border-yellow-500 bg-yellow-500/10';
    return 'text-blue-400 border-blue-500 bg-blue-500/10';
  };

  const getAlertIcon = (alert: string) => {
    if (alert.includes('CRITICAL')) return '🔴';
    if (alert.includes('WARNING')) return '🟡';
    return '🔵';
  };

  const formatAlertMessage = (alert: string) => {
    // Extract timestamp, level, engine, and message from alert string
    // Expected format: "[HH:MM:SS] LEVEL: Engine E-XXX message"
    const match = alert.match(/^\[([^\]]+)\]\s+([^:]+):\s+(.+)$/);
    
    if (match) {
      return {
        timestamp: match[1],
        level: match[2],
        message: match[3]
      };
    }
    
    // Fallback if parsing fails
    return {
      timestamp: new Date().toLocaleTimeString(),
      level: 'INFO',
      message: alert
    };
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
        <span>System Alerts</span>
        <span className="text-sm text-gray-400">({alerts.length})</span>
      </h2>
      
      {/* Alert List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {alerts.length > 0 ? (
          alerts.map((alert, index) => {
            const { timestamp, level, message } = formatAlertMessage(alert);
            const colorClass = getAlertColor(alert);
            const icon = getAlertIcon(alert);
            
            return (
              <div
                key={index}
                className={`
                  p-3 rounded-lg border text-sm
                  transition-all duration-200 hover:scale-102
                  ${colorClass}
                `}
              >
                {/* Alert Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    <span className="font-bold">{level}</span>
                  </div>
                  <span className="text-xs text-gray-400">{timestamp}</span>
                </div>
                
                {/* Alert Message */}
                <div className="text-white">
                  {message}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-sm">No active alerts</div>
            <div className="text-gray-500 text-xs mt-2">System operating normally</div>
          </div>
        )}
      </div>
      
      {/* Alert Summary */}
      {alerts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-red-400 font-bold">
                {alerts.filter(a => a.includes('CRITICAL')).length}
              </div>
              <div className="text-gray-400">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-400 font-bold">
                {alerts.filter(a => a.includes('WARNING')).length}
              </div>
              <div className="text-gray-400">Warning</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold">
                {alerts.filter(a => !a.includes('CRITICAL') && !a.includes('WARNING')).length}
              </div>
              <div className="text-gray-400">Info</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
