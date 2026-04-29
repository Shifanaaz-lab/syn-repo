interface EngineData {
  id: string;
  rul: number;
  risk: number;
}

interface EngineGridProps {
  engines: EngineData[];
}

export function EngineGrid({ engines }: EngineGridProps) {
  const getRiskColor = (risk: number) => {
    if (risk > 0.85) return 'text-red-500';
    if (risk > 0.5) return 'text-orange-500';
    return 'text-green-500';
  };

  const getRiskBg = (risk: number) => {
    if (risk > 0.85) return 'bg-red-500/20 border-red-500/30';
    if (risk > 0.5) return 'bg-orange-500/20 border-orange-500/30';
    return 'bg-green-500/20 border-green-500/30';
  };

  const getRiskLabel = (risk: number) => {
    if (risk > 0.85) return 'Critical';
    if (risk > 0.5) return 'Warning';
    return 'Normal';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Engine Fleet Grid</h2>
      
      {/* Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {engines.map((engine) => (
          <div
            key={engine.id}
            className={`
              p-3 rounded-lg border text-center transition-all duration-200 hover:scale-105 cursor-pointer
              ${getRiskBg(engine.risk)}
            `}
          >
            {/* Engine ID */}
            <div className="text-sm font-bold text-white mb-1">
              {engine.id}
            </div>
            
            {/* Risk Level */}
            <div className={`text-xs mb-2 ${getRiskColor(engine.risk)}`}>
              {getRiskLabel(engine.risk)}
            </div>
            
            {/* Risk Percentage */}
            <div className="mb-2">
              <div className="text-xs text-gray-400 mb-1">Risk Level</div>
              <div className={`text-lg font-bold ${getRiskColor(engine.risk)}`}>
                {(engine.risk * 100).toFixed(0)}%
              </div>
            </div>
            
            {/* Predicted RUL */}
            <div>
              <div className="text-xs text-gray-400 mb-1">Predicted RUL</div>
              <div className="text-lg font-bold text-blue-400">
                {engine.rul.toFixed(0)}
              </div>
            </div>
            
            {/* Visual Risk Indicator */}
            <div className="mt-2">
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className={`
                    h-full transition-all duration-300
                    ${engine.risk > 0.85 ? 'bg-red-500' : 
                      engine.risk > 0.5 ? 'bg-orange-500' : 'bg-green-500'}
                  `}
                  style={{ width: `${engine.risk * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400">Normal (0-50%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-400">Warning (50-85%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-400">Critical (85-100%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
