import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { TopPage } from './pages/TopPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { SummaryPage } from './pages/SummaryPage';
import { HistoryPage } from './pages/HistoryPage';
import { AddToHomeBanner } from './components/AddToHomeBanner';
import { AssessmentProvider } from './context/AssessmentContext';
import { ExecutiveSummaryPage } from './pages/ExecutiveSummaryPage';

export default function App() {
  return (
    <BrowserRouter>
      <AssessmentProvider>
        <AddToHomeBanner />
        <AppShell>
          <Routes>
            <Route path="/" element={<TopPage />} />
            <Route path="/assess" element={<AssessmentPage />} />
            <Route path="/summary" element={<SummaryPage />} />
            <Route path="/executive" element={<ExecutiveSummaryPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </AssessmentProvider>
    </BrowserRouter>
  );
}
