import { useEffect, useState } from 'react';
import { fetchMaxLoads, fetchUpsByLoad, fetchNearestUPSConfig } from '../Services/api';
import { X, CheckCircle, Zap, Clock, Gauge, Cpu } from 'lucide-react';
import logo from '../../assets/logo.png';

const UPSSelector = () => {
  const [maxLoads, setMaxLoads] = useState([]);
  const [loadInput, setLoadInput] = useState('');
  const [runtimeInput, setRuntimeInput] = useState('');
  const [nearestConfig, setNearestConfig] = useState(null);
  const [upsDetail, setUpsDetail] = useState(null);
  const [showUPSModal, setShowUPSModal] = useState(false);
  const [upsListByLoad, setUpsListByLoad] = useState([]);
  const [loading, setLoading] = useState({ runtime: false, ups: false });

  useEffect(() => {
    fetchMaxLoads().then(setMaxLoads).catch(console.error);
  }, []);

  const handleFindNearest = async () => {
    if (!loadInput || !runtimeInput) {
      alert('Enter Load & Runtime');
      return;
    }
    setLoading((p) => ({ ...p, ups: true }));
    try {
      const data = await fetchNearestUPSConfig(loadInput, runtimeInput);
      setNearestConfig(data);
      setUpsDetail({ modelCode: data.modelCode, maxLoadWatts: data.maxLoadWatts, efficiency: data.efficiency });
      const list = await fetchUpsByLoad(loadInput);
      setUpsListByLoad(list);
      setShowUPSModal(true);
    } catch (err) {
      console.error(err);
      alert('Error finding UPS configuration. Please try again.');
    } finally {
      setLoading((p) => ({ ...p, ups: false }));
    }
  };

  const otherUPS = upsListByLoad?.filter((u) => u.modelCode !== upsDetail?.modelCode) || [];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-montserrat">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-[#1b1f3b] px-5 py-3.5 text-white">
          <div className="flex items-center gap-3">
            <img src={logo} alt="ExTell Logo" className="w-14 h-9 object-contain" />
            <div>
              <p className="text-base font-semibold">UPS Selector</p>
              <p className="text-xs text-white/70">Find the perfect UPS for your needs</p>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#1b1f3b]" />
              Enter Load (Watts)
            </label>
            <input
              type="number"
              value={loadInput}
              onChange={(e) => setLoadInput(e.target.value)}
              placeholder="e.g. 7634"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:border-[#1b1f3b] focus:ring-2 focus:ring-[#1b1f3b]/20 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#1b1f3b]" />
              Required Runtime (Minutes)
            </label>
            <input
              type="number"
              value={runtimeInput}
              onChange={(e) => setRuntimeInput(e.target.value)}
              placeholder="e.g. 30"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:border-[#1b1f3b] focus:ring-2 focus:ring-[#1b1f3b]/20 outline-none"
            />
          </div>

          <button
            onClick={handleFindNearest}
            disabled={loading.ups}
            className="w-full bg-[#1b1f3b] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#141733] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading.ups ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Finding...
              </>
            ) : (
              'Find UPS Configuration'
            )}
          </button>
        </div>

        {showUPSModal && upsDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="bg-[#1b1f3b] px-4 py-3 text-white flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <Cpu className="w-4 h-4" />
                  <div>
                    <h2 className="text-sm font-semibold">Recommended UPS</h2>
                    <p className="text-xs text-white/70">Load: {loadInput}W</p>
                  </div>
                </div>
                <button onClick={() => setShowUPSModal(false)} className="p-1 rounded-full hover:bg-white/10 transition">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <div className="bg-[#f0f2ff] p-3 rounded-lg border border-[#1b1f3b]/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Model</div>
                      <div className="font-bold text-lg text-[#1b1f3b]">{upsDetail.modelCode}</div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="border border-gray-200 rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Zap className="w-3 h-3 text-[#1b1f3b]" />
                      <div className="text-xs text-gray-500">Max Load</div>
                    </div>
                    <div className="text-sm font-semibold text-[#1b1f3b]">{upsDetail.maxLoadWatts} W</div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Gauge className="w-3 h-3 text-[#1b1f3b]" />
                      <div className="text-xs text-gray-500">Efficiency</div>
                    </div>
                    <div className="text-sm font-semibold text-[#1b1f3b]">{upsDetail.efficiency}%</div>
                  </div>
                </div>

                {nearestConfig && (
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="text-center space-y-2">
                      <div className="text-xs text-gray-500">Battery Configuration</div>
                      <div className="font-bold text-[#1b1f3b]">{nearestConfig.batteryName}</div>
                      <div className="text-sm text-gray-600">{nearestConfig.batteryCount} Strings</div>
                    </div>
                  </div>
                )}

                {upsDetail.additionalSpecs && (
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Features</div>
                    <div className="text-xs text-gray-700 leading-relaxed">{upsDetail.additionalSpecs}</div>
                  </div>
                )}
              </div>

              {otherUPS.length > 0 && (
                <div className="px-4 pb-4">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Other Suitable UPS ({otherUPS.length})</div>
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                    {otherUPS.map((ups) => (
                      <div key={ups.id} className="border border-gray-200 rounded-lg p-2.5 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-[#1b1f3b] truncate max-w-[150px]" title={ups.modelCode}>
                            {ups.modelCode}
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Cpu className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="px-4 py-3 border-t bg-gray-50">
                <button
                  onClick={() => setShowUPSModal(false)}
                  className="w-full bg-[#1b1f3b] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#141733] transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UPSSelector;
