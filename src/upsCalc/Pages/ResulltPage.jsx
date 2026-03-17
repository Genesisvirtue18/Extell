import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchRuntimeCurve, calculateRuntime } from '../Services/api';
import RuntimeChart from '../Components/RuntimeCharts';
import {
  ArrowLeft,
  Battery,
  Cpu,
  Activity,
  Table,
  BarChart,
  Info,
  AlertCircle,
  Zap,
  Calculator,
  RefreshCw,
  CheckCircle,
  XCircle
} from 'lucide-react';
import logo from '../../assets/logo.png';

export default function ResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { ups, battery } = state || {};

  const [curve, setCurve] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('chart');
  const [manualLoad, setManualLoad] = useState('');
  const [calculatedRuntime, setCalculatedRuntime] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [calculationError, setCalculationError] = useState('');

  useEffect(() => {
    if (!ups || !battery) return;
    setLoading(true);
    setCalculatedRuntime(null);
    setCalculationError('');

    fetchRuntimeCurve(ups.id, battery.id)
      .then((data) => {
        setCurve(data);
      })
      .catch((error) => {
        console.error('Error fetching curve:', error);
        setCalculationError('Failed to load runtime curve data');
      })
      .finally(() => setLoading(false));
  }, [ups, battery]);

  const handleCalculateRuntime = async () => {
    if (!manualLoad || isNaN(manualLoad) || manualLoad <= 0) {
      setCalculationError('Please enter a valid load in watts');
      return;
    }
    const load = parseInt(manualLoad, 10);
    if (load > ups.maxLoadWatts) {
      setCalculationError('Entered load is above the UPS rating.');
      setCalculatedRuntime(null);
      return;
    }
    setCalculating(true);
    setCalculationError('');
    try {
      const result = await calculateRuntime(ups.id, battery.id, load);
      setCalculatedRuntime(result);
    } catch (error) {
      setCalculationError(error.message || 'Failed to calculate runtime. Please try again.');
      setCalculatedRuntime(null);
    } finally {
      setCalculating(false);
    }
  };

  const resetCalculation = () => {
    setManualLoad('');
    setCalculatedRuntime(null);
    setCalculationError('');
  };

  const isCapacityExceededError =
    calculationError &&
    calculationError.includes('Entered load is above the UPS rating.');

  if (!state || !ups || !battery) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f2ff] to-[#e6e9ff] flex items-center justify-center p-4">
        <div className="text-center p-6 bg-white rounded-lg border border-[#e0e3ff] shadow-md max-w-md w-full">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#f0f2ff] flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-[#1b1f3b]" />
          </div>
          <h2 className="text-lg font-bold text-[#1b1f3b] mb-2">No Data Available</h2>
          <p className="text-[#4a507c] mb-4 text-sm">Please select UPS and battery first</p>
          <button
            onClick={() => navigate('/ups-calculator')}
            className="px-4 py-2.5 bg-[#1b1f3b] text-white rounded-lg font-medium hover:opacity-90 transition-all w-full"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f2ff] to-[#e6e9ff]">
      <div className="max-w-7xl mx-auto p-4 md:p-5">
        <div className="mb-6">
          <button
            onClick={() => navigate('/ups-calculator')}
            className="flex items-center gap-2 text-[#4a507c] hover:text-[#1b1f3b] mb-4 group transition-colors text-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Calculator
          </button>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img src={logo} alt="Logo" className="w-20 bg-[#1b1f3b] h-8 object-contain" />
                <h1 className="text-xl md:text-2xl font-bold text-[#1b1f3b]">Runtime Analysis</h1>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#e0e3ff]">
                  <Cpu className="w-3.5 h-3.5 text-[#1b1f3b]" />
                  <span className="text-[#1b1f3b] text-sm">{ups.modelCode}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#e0e3ff]">
                  <Battery className="w-3.5 h-3.5 text-[#1b1f3b]" />
                  <span className="text-[#1b1f3b] text-sm">{battery.batteryName || `Battery ${battery.id}`}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg p-4 border border-[#e0e3ff]">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-[#1b1f3b]" />
                <h2 className="font-bold text-[#1b1f3b]">UPS Fundamentals</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#f8f9ff] p-3 rounded border border-[#e0e3ff]">
                  <h3 className="font-semibold text-[#1b1f3b] mb-2 text-sm">What is a UPS?</h3>
                  <p className="text-xs text-[#4a507c] leading-relaxed">
                    An Uninterruptible Power Supply (UPS) provides emergency power when the main power fails. It protects
                    equipment from power surges and gives users time to save work and shut down properly.
                  </p>
                </div>
                <div className="bg-[#f8f9ff] p-3 rounded border border-[#e0e3ff]">
                  <h3 className="font-semibold text-[#1b1f3b] mb-2 text-sm">Runtime Calculation</h3>
                  <p className="text-xs text-[#4a507c] leading-relaxed">
                    Runtime depends on battery capacity (Ah), load power (W), and UPS efficiency. Higher loads drain
                    batteries faster, following an inverse relationship where runtime decreases exponentially with increased load.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 md:p-4 border border-[#e0e3ff]">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="w-4 h-4 text-[#1b1f3b]" />
                <h2 className="font-bold text-[#1b1f3b] text-sm md:text-base">Custom Load Calculator</h2>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2 items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-xs md:text-sm font-medium text-[#1b1f3b] mb-1">Load (Watts)</label>
                    <div className="relative">
                      <input
                        id="manual-load-input"
                        type="number"
                        min="1"
                        value={manualLoad}
                        onChange={(e) => setManualLoad(e.target.value)}
                        placeholder="e.g., 500"
                        className="w-full px-3 py-1.5 md:px-3 md:py-2 text-sm border border-[#e0e3ff] rounded-lg focus:ring-2 focus:ring-[#1b1f3b] focus:border-transparent"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#4a507c]">W</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleCalculateRuntime}
                      disabled={calculating || !manualLoad}
                      className="px-3 py-1.5 bg-[#1b1f3b] text-white rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 text-xs h-[34px]"
                    >
                      {calculating ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span className="hidden sm:inline">Calculating</span>
                        </>
                      ) : (
                        <>
                          <Calculator className="w-3 h-3" />
                          <span>Calculate</span>
                        </>
                      )}
                    </button>

                    {(calculatedRuntime || calculationError) && (
                      <button
                        onClick={resetCalculation}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-1.5 text-xs h-[34px]"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span className="hidden sm:inline">Reset</span>
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#4a507c]">Enter any load value in watts</p>

                {calculationError && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-1.5">
                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700">{calculationError}</p>
                  </div>
                )}

                {calculatedRuntime && (
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <h3 className="font-bold text-[#1b1f3b] text-sm">Result</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-2 bg-white rounded-lg border border-[#e0e3ff]">
                        <p className="text-[11px] text-[#4a507c]">Load</p>
                        <p className="font-bold text-[#1b1f3b] text-sm">{calculatedRuntime.loadWatts}W</p>
                      </div>
                      <div className="text-center p-2 bg-white rounded-lg border border-[#e0e3ff]">
                        <p className="text-[11px] text-[#4a507c]">Runtime</p>
                        <p className="font-bold text-green-600 text-sm">{calculatedRuntime.runtimeMinutes} min</p>
                        <p className="text-[10px] text-[#4a507c]">
                          {Math.floor(calculatedRuntime.runtimeMinutes / 60)}h {calculatedRuntime.runtimeMinutes % 60}m
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!isCapacityExceededError && (
              <div className="bg-white rounded-lg p-4 border border-[#e0e3ff]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex bg-white rounded p-0.5 border border-[#e0e3ff]">
                      <button
                        onClick={() => setViewMode('chart')}
                        className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-all text-sm ${
                          viewMode === 'chart'
                            ? 'bg-[#1b1f3b] text-white'
                            : 'text-[#4a507c] hover:text-[#1b1f3b] hover:bg-[#f0f2ff]'
                        }`}
                      >
                        <BarChart className="w-3.5 h-3.5" />
                        Chart
                      </button>
                      <button
                        onClick={() => setViewMode('table')}
                        className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-all text-sm ${
                          viewMode === 'table'
                            ? 'bg-[#1b1f3b] text-white'
                            : 'text-[#4a507c] hover:text-[#1b1f3b] hover:bg-[#f0f2ff]'
                        }`}
                      >
                        <Table className="w-3.5 h-3.5" />
                        Table
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs bg-[#f0f2ff] px-3 py-1.5 rounded border border-[#e0e3ff]">
                      <Activity className="w-3.5 h-3.5 text-[#1b1f3b]" />
                      <span className="text-[#1b1f3b] font-medium">Real-time Calculation</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-3">
                  <div>
                    <h2 className="font-bold text-[#1b1f3b] mb-1 text-sm">
                      {viewMode === 'chart' ? 'Runtime vs Load Curve' : 'Runtime Data Table'}
                    </h2>
                    <p className="text-[#4a507c] text-xs">
                      {viewMode === 'chart'
                        ? 'Estimated backup time under different load conditions'
                        : 'Detailed runtime data at specific load points'}
                    </p>
                  </div>
                </div>

                {loading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-10 h-10 border-3 border-[#1b1f3b] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-[#4a507c] text-sm">Loading runtime data...</p>
                    </div>
                  </div>
                ) : viewMode === 'chart' ? (
                  <>
                    <div id="runtime-chart" className="bg-white p-6 rounded-lg border border-[#e0e3ff] mb-4 overflow-visible h-[400px] sm:h-[400px] lg:h-[460px]">
                      <RuntimeChart data={curve} />
                    </div>

                    <div className="mt-4 pt-6 border-t border-[#e0e3ff]">
                      <div className="flex items-center gap-1.5 mb-3">
                        <Info className="w-3.5 h-3.5 text-[#1b1f3b]" />
                        <h4 className="font-semibold text-[#1b1f3b] text-sm">Interpreting the Graph</h4>
                      </div>
                      <div className="grid md:grid-cols-3 gap-3">
                        <div className="bg-[#f8f9ff] p-3 rounded border border-[#e0e3ff]">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-[#1b1f3b] rounded-full"></div>
                            <span className="font-medium text-[#1b1f3b] text-xs">Curve Shape</span>
                          </div>
                          <p className="text-xs text-[#4a507c]">
                            The curve shows exponential decay - runtime drops rapidly at first, then more gradually at higher loads.
                          </p>
                        </div>
                        <div className="bg-[#f8f9ff] p-3 rounded border border-[#e0e3ff]">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-[#1b1f3b] rounded-full"></div>
                            <span className="font-medium text-[#1b1f3b] text-xs">Optimal Zone</span>
                          </div>
                          <p className="text-xs text-[#4a507c]">
                            Best performance between 60-80% load. Avoid operating below 30% for maximum efficiency.
                          </p>
                        </div>
                        <div className="bg-[#f8f9ff] p-3 rounded border border-[#e0e3ff]">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-[#1b1f3b] rounded-full"></div>
                            <span className="font-medium text-[#1b1f3b] text-xs">Critical Points</span>
                          </div>
                          <p className="text-xs text-[#4a507c]">
                            Markers show where runtime drops significantly. Plan for these thresholds in your power strategy.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="overflow-x-auto rounded border border-[#e0e3ff]">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#f8f9ff]">
                          <th className="text-left p-3 text-xs font-semibold text-[#1b1f3b] border-b border-[#e0e3ff]">
                            Load (W)
                          </th>
                          <th className="text-left p-3 text-xs font-semibold text-[#1b1f3b] border-b border-[#e0e3ff]">
                            Runtime (Minutes)
                          </th>
                          <th className="text-left p-3 text-xs font-semibold text-[#1b1f3b] border-b border-[#e0e3ff]">
                            Load %
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {curve.map((point, index) => {
                          const loadPercentage = Math.round((point.loadWatts / ups.maxLoadWatts) * 100);
                          return (
                            <tr
                              key={index}
                              className="hover:bg-[#f8f9ff] transition-colors border-b border-[#e0e3ff] last:border-0"
                            >
                              <td className="p-3 text-[#1b1f3b] text-sm">{point.loadWatts}W</td>
                              <td className="p-3 text-[#1b1f3b] text-sm font-medium">{point.runtimeMinutes} min</td>
                              <td className="p-3 text-[#4a507c] text-sm">{loadPercentage}%</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <div className="p-3 bg-[#f8f9ff] text-xs text-[#4a507c] border-t border-[#e0e3ff]">
                      Showing {curve.length} data points from {curve[0]?.loadWatts}W to {curve[curve.length - 1]?.loadWatts}W
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-lg p-4 border border-[#e0e3ff]">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-[#1b1f3b]" />
                <h3 className="font-bold text-[#1b1f3b] text-sm">How to Read & Use This Data</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-[#1b1f3b] mb-2 text-xs">For Planning:</h4>
                  <ul className="space-y-2">
                    <li className="text-xs text-[#4a507c] flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-[#1b1f3b] rounded-full mt-1 flex-shrink-0"></div>
                      <span>Match your expected load with the corresponding runtime</span>
                    </li>
                    <li className="text-xs text-[#4a507c] flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-[#1b1f3b] rounded-full mt-1 flex-shrink-0"></div>
                      <span>Add buffer time (20-30%) for safety margin</span>
                    </li>
                    <li className="text-xs text-[#4a507c] flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-[#1b1f3b] rounded-full mt-1 flex-shrink-0"></div>
                      <span>Consider battery aging (loses 20% capacity in 3-5 years)</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-[#1b1f3b] mb-2 text-xs">Technical Notes:</h4>
                  <ul className="space-y-2">
                    <li className="text-xs text-[#4a507c] flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-[#1b1f3b] rounded-full mt-1 flex-shrink-0"></div>
                      <span>Runtime assumes 100% charged batteries at start</span>
                    </li>
                    <li className="text-xs text-[#4a507c] flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-[#1b1f3b] rounded-full mt-1 flex-shrink-0"></div>
                      <span>Data based on 25°C ambient temperature</span>
                    </li>
                    <li className="text-xs text-[#4a507c] flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-[#1b1f3b] rounded-full mt-1 flex-shrink-0"></div>
                      <span>Higher temperatures reduce battery life and capacity</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-[#e0e3ff]">
              <h3 className="font-bold text-[#1b1f3b] mb-4 flex items-center gap-2 text-sm">
                <Cpu className="w-4 h-4 text-[#1b1f3b]" />
                UPS Specifications
              </h3>
              <div className="space-y-3">
                <InfoItemCompact label="Model" value={ups.modelCode} />
                <InfoItemCompact label="UPS Efficiency" value={`${ups.efficiency}%`} />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-[#e0e3ff]">
              <h3 className="font-bold text-[#1b1f3b] mb-4 flex items-center gap-2 text-sm">
                <Battery className="w-4 h-4 text-[#1b1f3b]" />
                Battery Configuration
              </h3>
              <div className="space-y-3">
                <InfoItemCompact label="Battery Pack" value={battery.batteryName || `Battery ${battery.id}`} />
                <InfoItemCompact label="Number Of Strings" value={battery.batteryCount} />
                {battery.batteryAh && <InfoItemCompact label="Capacity per Unit" value={`${battery.batteryAh} Ah`} />}
                {battery.batteryVoltage && <InfoItemCompact label="Voltage" value={`${battery.batteryVoltage}V`} />}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-[#e0e3ff]">
              <h3 className="font-bold text-[#1b1f3b] mb-4 flex items-center gap-2 text-sm">
                <Info className="w-4 h-4 text-[#1b1f3b]" />
                Quick Tips
              </h3>
              <ul className="space-y-2">
                <li className="text-xs text-[#4a507c] flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1b1f3b] rounded-full mt-1 flex-shrink-0"></div>
                  <span>Enter any load value - no restrictions on input</span>
                </li>
                <li className="text-xs text-[#4a507c] flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1b1f3b] rounded-full mt-1 flex-shrink-0"></div>
                  <span>Keep UPS in cool, dry environments (15-25°C ideal)</span>
                </li>
                <li className="text-xs text-[#4a507c] flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#1b1f3b] rounded-full mt-1 flex-shrink-0"></div>
                  <span>Test backup system quarterly for reliability</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#e0e3ff]">
          <div className="text-xs text-center space-y-1">
            <p className="text-[#1b1f3b] font-medium">
              Please contact ExTell Support at <span className="font-semibold underline">support@extellsystems.com</span>{' '}
              for detailed documentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItemCompact({ label, value }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-[#e0e3ff] last:border-0">
      <span className="text-xs text-[#4a507c]">{label}</span>
      <span className="font-medium text-[#1b1f3b] text-sm">{value}</span>
    </div>
  );
}
