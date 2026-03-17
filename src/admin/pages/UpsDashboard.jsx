// AdminDashboard.jsx
import { useState, useEffect } from "react";
import {
  Plus, Edit, Trash2, Save, X, Battery, Cpu,
  RefreshCw, AlertCircle, Search, Zap, Percent, Hash,
  Gauge, Activity, Sigma, Shield
} from "lucide-react";

const BASE_URL = "https://api.calculator.genesisvirtue.se/api";
//const BASE_URL = "http://localhost:1008/api";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('ups');
  const [upsList, setUpsList] = useState([]);
  const [batteryList, setBatteryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [upsForm, setUpsForm] = useState({ 
    modelCode: '', 
    maxLoadWatts: '', 
    efficiency: '',
    powerFactor: '',
    factorOfSafety: '' 
  });
  
  const [batteryForm, setBatteryForm] = useState({ 
    upsModelId: '', 
    batteryCount: '', 
    batteryName: '',
    batteryVoltage: '',
    batteryAh: '',
    batteryefficiency: ''
  });

  // Editing states
  const [editingUps, setEditingUps] = useState(null);
  const [editingBattery, setEditingBattery] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'ups':
          const upsResponse = await fetch(`${BASE_URL}/ups`);
          const upsData = await upsResponse.json();
          setUpsList(upsData);
          break;
        case 'batteries':
          const batteryResponse = await fetch(`${BASE_URL}/batteries`);
          const batteryData = await batteryResponse.json();
          setBatteryList(batteryData);
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // UPS CRUD Operations
  const handleUpsSubmit = async (e) => {
    e.preventDefault();
    const method = editingUps ? 'PUT' : 'POST';
    const url = editingUps ? `${BASE_URL}/ups/${editingUps.id}` : `${BASE_URL}/ups`;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...upsForm,
          maxLoadWatts: parseInt(upsForm.maxLoadWatts),
          efficiency: parseFloat(upsForm.efficiency),
          powerFactor: upsForm.powerFactor === '' ? null : parseFloat(upsForm.powerFactor),
          factorOfSafety: upsForm.factorOfSafety === '' ? null : parseFloat(upsForm.factorOfSafety)
        })
      });
      if (response.ok) {
        fetchData();
        resetUpsForm();
      }
    } catch (error) {
      console.error('Error saving UPS:', error);
    }
  };

  const handleUpsEdit = (ups) => {
    setEditingUps(ups);
    setUpsForm({ 
      modelCode: ups.modelCode, 
      maxLoadWatts: ups.maxLoadWatts.toString(),
      efficiency: ups.efficiency.toString(),
      powerFactor: ups.powerFactor?.toString() || '',
      factorOfSafety: ups.factorOfSafety?.toString() || ''
    });
  };

  const handleUpsDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this UPS model?')) {
      try {
        await fetch(`${BASE_URL}/ups/${id}`, { method: 'DELETE' });
        fetchData();
      } catch (error) {
        console.error('Error deleting UPS:', error);
      }
    }
  };

  // Battery CRUD Operations
  const handleBatterySubmit = async (e) => {
    e.preventDefault();
    const method = editingBattery ? 'PUT' : 'POST';
    const url = editingBattery ? `${BASE_URL}/batteries/${editingBattery.id}` : `${BASE_URL}/batteries`;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...batteryForm,
          upsModelId: parseInt(batteryForm.upsModelId),
          batteryCount: parseInt(batteryForm.batteryCount),
          batteryVoltage: parseFloat(batteryForm.batteryVoltage),
          batteryAh: parseFloat(batteryForm.batteryAh),
          batteryefficiency: parseFloat(batteryForm.batteryefficiency)
        })
      });
      if (response.ok) {
        fetchData();
        resetBatteryForm();
      }
    } catch (error) {
      console.error('Error saving battery:', error);
    }
  };

  const handleBatteryEdit = (battery) => {
    setEditingBattery(battery);
    setBatteryForm({
      upsModelId: battery.upsModelId.toString(),
      batteryCount: battery.batteryCount.toString(),
      batteryName: battery.batteryName || '',
      batteryVoltage: battery.batteryVoltage.toString(),
      batteryAh: battery.batteryAh.toString(),
      batteryefficiency: battery.batteryefficiency.toString()
    });
  };

  const handleBatteryDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this battery option?')) {
      try {
        await fetch(`${BASE_URL}/batteries/${id}`, { method: 'DELETE' });
        fetchData();
      } catch (error) {
        console.error('Error deleting battery:', error);
      }
    }
  };

  // Reset forms
  const resetUpsForm = () => {
    setUpsForm({ modelCode: '', maxLoadWatts: '', efficiency: '', powerFactor: '', factorOfSafety: '' });
    setEditingUps(null);
  };

  const resetBatteryForm = () => {
    setBatteryForm({ 
      upsModelId: '', 
      batteryCount: '', 
      batteryName: '',
      batteryVoltage: '',
      batteryAh: '',
      batteryefficiency: ''
    });
    setEditingBattery(null);
  };

  // Filter data based on search
  const filteredData = () => {
    if (!searchTerm) {
      switch (activeTab) {
        case 'ups': return upsList;
        case 'batteries': return batteryList;
        default: return [];
      }
    }

    const term = searchTerm.toLowerCase();
    switch (activeTab) {
      case 'ups':
        return upsList.filter(ups =>
          ups.modelCode?.toLowerCase().includes(term) ||
          ups.maxLoadWatts?.toString().includes(term) ||
          ups.efficiency?.toString().includes(term) ||
          (ups.powerFactor?.toString() || '').includes(term) ||
          (ups.factorOfSafety?.toString() || '').includes(term)
        );
      case 'batteries':
        return batteryList.filter(battery =>
          battery.batteryName?.toLowerCase().includes(term) ||
          battery.batteryCount?.toString().includes(term) ||
          battery.upsModelId?.toString().includes(term) ||
          battery.batteryVoltage?.toString().includes(term) ||
          battery.batteryAh?.toString().includes(term) ||
          battery.batteryefficiency?.toString().includes(term)
        );
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            UPS Calculator Admin Dashboard
          </h1>
          <p className="text-gray-600 text-sm">
            Manage UPS models and battery configurations with formula-based runtime calculations
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('ups')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === 'ups'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            UPS Models
          </button>
          <button
            onClick={() => setActiveTab('batteries')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === 'batteries'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Battery className="w-4 h-4" />
            Battery Options
          </button>
        </div>

        {/* Search and Refresh */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                {editingUps || editingBattery ? (
                  <>
                    <Edit className="w-5 h-5 text-blue-600" />
                    Edit {activeTab.slice(0, -1)}
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-green-600" />
                    Add New {activeTab.slice(0, -1)}
                  </>
                )}
              </h2>

              {activeTab === 'ups' && (
                <form onSubmit={handleUpsSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={upsForm.modelCode}
                      onChange={(e) => setUpsForm({ ...upsForm, modelCode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., SRV-3000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Load (Watts) *
                    </label>
                    <div className="relative">
                      <Activity className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        required
                        min="0"
                        step="1"
                        value={upsForm.maxLoadWatts}
                        onChange={(e) => setUpsForm({ ...upsForm, maxLoadWatts: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        placeholder="e.g., 3000"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Maximum supported load in watts</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Efficiency (%) *
                    </label>
                    <div className="relative">
                      <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        required
                        min="0"
                        max="100"
                        step="0.1"
                        value={upsForm.efficiency}
                        onChange={(e) => setUpsForm({ ...upsForm, efficiency: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        placeholder="e.g., 92"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Typically 85-95% for modern UPS</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Power Factor
                    </label>
                    <div className="relative">
                      <Sigma className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        value={upsForm.powerFactor}
                        onChange={(e) => setUpsForm({ ...upsForm, powerFactor: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        placeholder="Enter power factor (optional)"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Leave empty for database default</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Factor of Safety (%)
                    </label>
                    <div className="relative">
                      <Shield className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={upsForm.factorOfSafety}
                        onChange={(e) => setUpsForm({ ...upsForm, factorOfSafety: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        placeholder="Enter factor of safety (optional)"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Leave empty for database default</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700">
                      <span className="font-semibold">Note:</span> Power factor is used in VA to Watts conversion. Factor of Safety applies derating to the calculated runtime.
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <Save className="w-4 h-4" />
                      {editingUps ? 'Update' : 'Create'}
                    </button>
                    {(editingUps || upsForm.modelCode || upsForm.maxLoadWatts || upsForm.efficiency || upsForm.powerFactor || upsForm.factorOfSafety) && (
                      <button
                        type="button"
                        onClick={resetUpsForm}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}

              {activeTab === 'batteries' && (
                <form onSubmit={handleBatterySubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      UPS Model *
                    </label>
                    <select
                      required
                      value={batteryForm.upsModelId}
                      onChange={(e) => setBatteryForm({ ...batteryForm, upsModelId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select UPS Model</option>
                      {upsList.map(ups => (
                        <option key={ups.id} value={ups.id}>
                          {ups.modelCode} (Max: {ups.maxLoadWatts}W, PF: {ups.powerFactor || 'null'}, FoS: {ups.factorOfSafety || 'null'})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Battery Count (EBMs) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="1"
                      value={batteryForm.batteryCount}
                      onChange={(e) => setBatteryForm({ ...batteryForm, batteryCount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Battery Name
                    </label>
                    <input
                      type="text"
                      value={batteryForm.batteryName}
                      onChange={(e) => setBatteryForm({ ...batteryForm, batteryName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., External Battery Module"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Battery Voltage (V) *
                    </label>
                    <div className="relative">
                      <Zap className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.1"
                        value={batteryForm.batteryVoltage}
                        onChange={(e) => setBatteryForm({ ...batteryForm, batteryVoltage: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        placeholder="e.g., 12.0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Battery Capacity (Ah) *
                    </label>
                    <div className="relative">
                      <Hash className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.1"
                        value={batteryForm.batteryAh}
                        onChange={(e) => setBatteryForm({ ...batteryForm, batteryAh: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        placeholder="e.g., 9.0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Battery Efficiency (%) *
                    </label>
                    <div className="relative">
                      <Gauge className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        required
                        min="0"
                        max="100"
                        step="0.1"
                        value={batteryForm.batteryefficiency}
                        onChange={(e) => setBatteryForm({ ...batteryForm, batteryefficiency: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        placeholder="e.g., 95.0"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Battery discharge efficiency (typically 85-98%)</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700">
                      <span className="font-semibold">Formula:</span> Runtime (min) = (Voltage × Ah × Count × UPS_Efficiency × Battery_Efficiency × 60 × FactorOfSafety/100) ÷ Load (W)
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <Save className="w-4 h-4" />
                      {editingBattery ? 'Update' : 'Create'}
                    </button>
                    {(editingBattery || batteryForm.upsModelId || batteryForm.batteryCount) && (
                      <button
                        type="button"
                        onClick={resetBatteryForm}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Data Table Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">
                    {activeTab === 'ups' && 'UPS Models'}
                    {activeTab === 'batteries' && 'Battery Options'}
                  </h3>
                  <span className="text-sm text-gray-600">
                    {filteredData().length} items
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading data...</p>
                </div>
              ) : filteredData().length === 0 ? (
                <div className="p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No data found</p>
                  {searchTerm && (
                    <p className="text-sm text-gray-500 mt-1">
                      Try adjusting your search term
                    </p>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        {activeTab === 'ups' && (
                          <>
                            <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                            <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Model Code</th>
                            <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Max Load (W)</th>
                            <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Efficiency</th>
                            <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Power Factor</th>
                            <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">FoS (%)</th>
                            <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                          </>
                        )}
                        {activeTab === 'batteries' && (
                          <>
                            <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                            <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">UPS Model</th>
                            <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Count</th>
                            <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                            <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Voltage (V)</th>
                            <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Capacity (Ah)</th>
                            <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Battery Eff.</th>
                            <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredData().map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          {activeTab === 'ups' && (
                            <>
                              <td className="p-3 text-sm text-gray-900 font-mono">{item.id}</td>
                              <td className="p-3 text-sm text-gray-900 font-medium">{item.modelCode}</td>
                              <td className="p-3 text-sm text-gray-900">
                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs">
                                  <Activity className="w-3 h-3 mr-1" />
                                  {item.maxLoadWatts?.toLocaleString()}W
                                </span>
                              </td>
                              <td className="p-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {item.efficiency}%
                                </span>
                              </td>
                              <td className="p-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  {item.powerFactor !== null && item.powerFactor !== undefined ? item.powerFactor : 'null'}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  <Shield className="w-3 h-3 mr-1" />
                                  {item.factorOfSafety !== null && item.factorOfSafety !== undefined ? item.factorOfSafety : 'null'}%
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleUpsEdit(item)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Edit"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleUpsDelete(item.id)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                          {activeTab === 'batteries' && (
                            <>
                              <td className="p-3 text-sm text-gray-900 font-mono">{item.id}</td>
                              <td className="p-3 text-sm text-gray-900">
                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs">
                                  ID: {item.upsModelId}
                                </span>
                              </td>
                              <td className="p-3 text-sm text-gray-900">
                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-800 text-xs">
                                  {item.batteryCount} ×
                                </span>
                              </td>
                              <td className="p-3 text-sm text-gray-900">{item.batteryName || '-'}</td>
                              <td className="p-3 text-sm text-gray-900">
                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-yellow-50 text-yellow-700 text-xs">
                                  <Zap className="w-3 h-3 mr-1" />
                                  {item.batteryVoltage}V
                                </span>
                              </td>
                              <td className="p-3 text-sm text-gray-900">
                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-xs">
                                  <Hash className="w-3 h-3 mr-1" />
                                  {item.batteryAh}Ah
                                </span>
                              </td>
                              <td className="p-3 text-sm text-gray-900">
                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-pink-50 text-pink-700 text-xs">
                                  <Gauge className="w-3 h-3 mr-1" />
                                  {item.batteryefficiency}%
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleBatteryEdit(item)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Edit"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleBatteryDelete(item.id)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Showing {filteredData().length} of{' '}
                    {activeTab === 'ups' && upsList.length}
                    {activeTab === 'batteries' && batteryList.length} records
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <Cpu className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">UPS Models</p>
                <p className="text-lg font-bold text-gray-900">{upsList.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50">
                <Battery className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Battery Options</p>
                <p className="text-lg font-bold text-gray-900">{batteryList.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}