import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import BusinessProfilePage from './pages/BusinessProfilePage';
import QRPublicPage from './pages/QRPublicPage';
import ComplaintPage from './pages/ComplaintPage';

// Dashboard pages
import CustomerDashboard from './pages/CustomerDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Owner sub-pages
import OwnerScannerPage from './pages/OwnerScannerPage';
import OwnerChecklistPage from './pages/OwnerChecklistPage';
import OwnerTemperaturePage from './pages/OwnerTemperaturePage';
import RegisterBusinessPage from './pages/RegisterBusinessPage';

// Admin sub-pages
import AdminBusinessesPage from './pages/AdminBusinessesPage';
import AdminComplaintsPage from './pages/AdminComplaintsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import FreshnessCheckerPage from './pages/FreshnessCheckerPage';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/business/:id" element={<BusinessProfilePage />} />
          <Route path="/qr/:id" element={<QRPublicPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />

          {/* Customer */}
          <Route path="/dashboard" element={<ProtectedRoute roles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
          <Route path="/complaint" element={<ProtectedRoute roles={['customer']}><ComplaintPage /></ProtectedRoute>} />
          <Route path="/freshness" element={<ProtectedRoute><FreshnessCheckerPage /></ProtectedRoute>} />

          {/* Owner */}
          <Route path="/owner" element={<ProtectedRoute roles={['owner']}><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/owner/register-business" element={<ProtectedRoute roles={['owner']}><RegisterBusinessPage /></ProtectedRoute>} />
          <Route path="/owner/scanner" element={<ProtectedRoute roles={['owner']}><OwnerScannerPage /></ProtectedRoute>} />
          <Route path="/owner/checklist" element={<ProtectedRoute roles={['owner']}><OwnerChecklistPage /></ProtectedRoute>} />
          <Route path="/owner/temperature" element={<ProtectedRoute roles={['owner']}><OwnerTemperaturePage /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/businesses" element={<ProtectedRoute roles={['admin']}><AdminBusinessesPage /></ProtectedRoute>} />
          <Route path="/admin/complaints" element={<ProtectedRoute roles={['admin']}><AdminComplaintsPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
