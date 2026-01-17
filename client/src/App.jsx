import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Lazy loading pages for performance optimization
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Otp = lazy(() => import('./pages/Otp'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Analytics = lazy(() => import('./pages/Analytics'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-50">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-900 border-t-transparent"></div>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/products" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
