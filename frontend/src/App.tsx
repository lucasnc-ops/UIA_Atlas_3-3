import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import RequireAuth from './components/auth/RequireAuth';
import Layout from './components/layout/Layout';
import LandingPage from './pages/public/LandingPage';
import Dashboard from './pages/public/Dashboard';
import SubmitProject from './pages/public/SubmitProject';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ProjectReview from './pages/admin/ProjectReview';
import EditProject from './pages/admin/EditProject';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Layout><LandingPage /></Layout>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/submit" element={<Layout><SubmitProject /></Layout>} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <RequireAuth>
                <AdminDashboard />
              </RequireAuth>
            } 
          />
          <Route 
            path="/admin/projects/:projectId" 
            element={
              <RequireAuth>
                <ProjectReview />
              </RequireAuth>
            } 
          />
          <Route 
            path="/admin/projects/:projectId/edit" 
            element={
              <RequireAuth>
                <EditProject />
              </RequireAuth>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
