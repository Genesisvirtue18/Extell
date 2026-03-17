// API bindings copied from UPS calculator package
const BASE_URL = 'https://api.calculator.genesisvirtue.se/api';

export const fetchUPS = async () => {
  const res = await fetch(`${BASE_URL}/ups`);
  return res.json();
};

export const fetchBatteries = async (upsId) => {
  const res = await fetch(`${BASE_URL}/ups/${upsId}/batteries`);
  return res.json();
};

export const fetchRuntimeCurve = async (upsId, batteryOptionId) => {
  const res = await fetch(`${BASE_URL}/batteries/${batteryOptionId}/curve?upsId=${upsId}`);
  if (!res.ok) throw new Error('Curve API failed');
  return res.json();
};

export const calculateRuntime = async (upsId, batteryId, loadWatts) => {
  const res = await fetch(`${BASE_URL}/batteries/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ upsId, batteryId, loadWatts })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Calculation failed');
  }
  return res.json();
};

export const fetchMaxLoads = async () => {
  const res = await fetch(`${BASE_URL}/selector/max-loads`);
  return res.json();
};

export const fetchRuntimesByLoad = async (maxLoad) => {
  const res = await fetch(`${BASE_URL}/selector/runtimes?maxLoad=${maxLoad}`);
  return res.json();
};

export const fetchUpsDetail = async (upsId) => {
  const res = await fetch(`${BASE_URL}/selector/ups-detail?upsId=${upsId}`);
  return res.json();
};

export const fetchUpsByLoad = async (maxLoad) => {
  const res = await fetch(`${BASE_URL}/selector/ups-by-load?maxLoad=${maxLoad}`);
  return res.json();
};

export const fetchNearestUPSConfig = async (loadWatts, runtimeMinutes) => {
  const res = await fetch(
    `${BASE_URL}/selector/nearest-config?loadWatts=${loadWatts}&runtimeMinutes=${runtimeMinutes}`
  );
  if (!res.ok) throw new Error('Nearest config API failed');
  return res.json();
};
