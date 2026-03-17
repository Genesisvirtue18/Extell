import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../upsCalc/Pages/Home';
import ResultPage from '../upsCalc/Pages/ResulltPage';
import UPSSelector from '../upsCalc/Pages/UPSSelector';
import '../upsCalc/index.css';

const UpsCalculatorPage = () => (
  <Routes>
    <Route index element={<Home />} />
    <Route path="result" element={<ResultPage />} />
    <Route path="selector" element={<UPSSelector />} />
    <Route path="*" element={<Navigate to="." replace />} />
  </Routes>
);

export default UpsCalculatorPage;
