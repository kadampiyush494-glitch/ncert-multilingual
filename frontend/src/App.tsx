import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navigation } from './components/Navigation';

import {Home} from './pages/Home';
import { Login } from './pages/Login';
import { Chat } from './pages/Chat';
import { Admin } from './pages/Admin';
import OCRPage from './pages/OCRPage';

function ProtectedRoute({ children, role }: { children: JSX.Element; role?: 'student' | 'admin' }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
}

function AppRoutes() {
  return (
    <>
      <Navigation />
      <Routes>
        {/* ✅ OLD HOME PAGE — UNCHANGED */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        {/* Student */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute role="student">
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* OCR (optional page) */}
        <Route path="/ocr" element={<OCRPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

