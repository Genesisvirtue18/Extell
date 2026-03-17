import { useEffect, useState } from 'react';
import { fetchUPS, fetchBatteries } from '../Services/api';
import { useNavigate } from 'react-router-dom';
import { Search, CheckCircle } from 'lucide-react';
import logo from '../../assets/logo.png';

export default function RuntimeModal() {
  const navigate = useNavigate();

  const [upsList, setUpsList] = useState([]);
  const [batteries, setBatteries] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedUps, setSelectedUps] = useState(null);
  const [selectedBattery, setSelectedBattery] = useState(null);
  const [loadingUps, setLoadingUps] = useState(true);
  const [loadingBattery, setLoadingBattery] = useState(false);

  useEffect(() => {
    fetchUPS()
      .then(setUpsList)
      .finally(() => setLoadingUps(false));
  }, []);

  const selectUps = async (ups) => {
    setSelectedUps(ups);
    setSelectedBattery(null);
    setLoadingBattery(true);
    const data = await fetchBatteries(ups.id);
    setBatteries(data);
    setLoadingBattery(false);
  };

  const goToResult = () => {
    navigate('result', {
      state: {
        ups: selectedUps,
        battery: selectedBattery
      }
    });
  };

  const filteredUPS = upsList.filter((u) => u.modelCode.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden font-montserrat border border-slate-200">
        <div className="bg-[#1b1f3b] px-6 py-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logo} alt="ExTell Logo" className="w-15 h-10 object-contain p-1 rounded" />
            <div>
              <p className="text-lg text-white font-semibold">UPS Runtime Calculator</p>
              <p className="text-xs text-white/70 mt-0.5">Configure system to calculate runtime</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-gray-500">UPS MODEL</label>
              {selectedUps && (
                <div className="text-xs text-[#1b1f3b] font-medium bg-[#f0f2ff] px-2 py-0.5 rounded">
                  {selectedUps.modelCode}
                </div>
              )}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search UPS model..."
                className="w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:border-[#1b1f3b] outline-none"
              />
            </div>

            <div className="mt-3 max-h-44 overflow-y-auto border rounded-lg">
              {loadingUps && <div className="p-2 text-sm text-gray-500">Loading...</div>}

              {!loadingUps &&
                filteredUPS.map((ups) => (
                  <button
                    key={ups.id}
                    onClick={() => selectUps(ups)}
                    className={`w-full text-left px-3 py-2 text-xs flex justify-between items-center hover:bg-gray-50 transition-colors ${
                      selectedUps?.id === ups.id ? 'bg-[#f0f2ff] font-medium border-l-2 border-[#1b1f3b]' : ''
                    } ${selectedUps?.id !== ups.id ? 'border-b border-gray-100 last:border-b-0' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          selectedUps?.id === ups.id ? 'bg-[#1b1f3b]' : 'bg-gray-300'
                        }`}
                      />
                      <div className={`truncate ${selectedUps?.id === ups.id ? 'text-[#1b1f3b]' : 'text-gray-800'}`}>
                        {ups.modelCode}
                      </div>
                    </div>
                    {selectedUps?.id === ups.id ? (
                      <CheckCircle className="w-3.5 h-3.5 text-[#1b1f3b]" />
                    ) : (
                      <div className="text-[10px] text-gray-400">Select</div>
                    )}
                  </button>
                ))}

              {!loadingUps && filteredUPS.length === 0 && <div className="p-2 text-xs text-gray-500">No UPS found</div>}
            </div>
          </div>

          {selectedUps && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-gray-500">BATTERY CONFIGURATION</label>
              </div>

              {loadingBattery ? (
                <div className="text-xs text-gray-500">Loading...</div>
              ) : batteries.length === 0 ? (
                <div className="text-center p-4 border border-dashed border-gray-200 rounded-lg">
                  <div className="text-xs text-gray-500">No battery options</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">for {selectedUps.modelCode}</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {batteries.map((battery) => (
                    <button
                      key={battery.id}
                      onClick={() => setSelectedBattery(battery)}
                      className={`border rounded-lg p-2 text-left transition-all ${
                        selectedBattery?.id === battery.id ? 'border-[#1b1f3b] bg-[#f0f2ff]' : 'hover:border-[#1b1f3b]/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div
                            className={`font-medium text-xs ${
                              selectedBattery?.id === battery.id ? 'text-[#1b1f3b]' : 'text-gray-800'
                            }`}
                          >
                            {battery.batteryName || `${battery.batteryCount} EBM`}
                          </div>
                        </div>
                        {selectedBattery?.id === battery.id && (
                          <CheckCircle className="w-3.5 h-3.5 text-[#1b1f3b] flex-shrink-0 ml-1" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-2">
            <button
              disabled={!selectedBattery}
              onClick={goToResult}
              className="w-full sm:w-auto px-5 py-2 rounded-lg text-xs font-medium text-white bg-[#1b1f3b] disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#141733] transition whitespace-nowrap"
            >
              Calculate Runtime →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
