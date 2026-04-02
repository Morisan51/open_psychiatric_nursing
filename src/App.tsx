import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { TopPage } from './pages/TopPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { SummaryPage } from './pages/SummaryPage';
import { HistoryPage } from './pages/HistoryPage';
import { AddToHomeBanner } from './components/AddToHomeBanner';
import { AssessmentProvider } from './context/AssessmentContext';
import { DetailedAssessmentProvider } from './context/DetailedAssessmentContext';
import { DementiaAssessmentProvider } from './context/DementiaAssessmentContext';
import { ExecutiveSummaryPage } from './pages/ExecutiveSummaryPage';
import { OTRPage } from './pages/OTRPage';
import { OTRDetailPage } from './pages/OTRDetailPage';
import { DetailedAssessmentPage } from './pages/DetailedAssessmentPage';
import { DetailedSummaryPage } from './pages/DetailedSummaryPage';
import { DetailedExecutivePage } from './pages/DetailedExecutivePage';
import { DementiaPage } from './pages/DementiaPage';
import { DementiaDetailPage } from './pages/DementiaDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <AssessmentProvider>
      <DetailedAssessmentProvider>
      <DementiaAssessmentProvider>
        <AddToHomeBanner />
        <AppShell>
          <Routes>
            <Route path="/" element={<TopPage />} />
            <Route path="/assess" element={<AssessmentPage />} />
            <Route path="/summary" element={<SummaryPage />} />
            <Route path="/executive" element={<ExecutiveSummaryPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/otr" element={<OTRPage />} />
            <Route path="/otr/detail" element={<OTRDetailPage />} />
            <Route path="/detailed" element={<DetailedAssessmentPage />} />
            <Route path="/detailed-summary" element={<DetailedSummaryPage />} />
            <Route path="/detailed-executive" element={<DetailedExecutivePage />} />
            <Route path="/dementia" element={<DementiaPage />} />
            <Route path="/dementia-detail" element={<DementiaDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </DementiaAssessmentProvider>
      </DetailedAssessmentProvider>
      </AssessmentProvider>
    </BrowserRouter>
  );
}
