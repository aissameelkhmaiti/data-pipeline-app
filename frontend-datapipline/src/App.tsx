import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import DashboardLayout from "./layouts/DashboardLayout"
import { PrivateRoute } from "./pages/PrivateRoute"

// Pages
import DashboardPage from "./dashboard/page"
import ImportUploadPage from "./pages/import/upload"
import ExternalApiPage from "./pages/import/external-api"
import ImportLogsPage from "./pages/import/logs"
import MoviesPage from "./pages/catalog/movies"
import CinemasPage from "./pages/catalog/cinemas"
import ShowtimesPage from "./pages/catalog/showtimes"
import LoginPage from "./components/login-form"

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ROUTES PUBLIQUES */}
        <Route path="/login" element={<LoginPage />} />

        {/* ROUTES PRIVÉES */}
        <Route element={<DashboardLayout />}>
          {/* Redirection automatique de l'accueil vers le dashboard */}
          <Route path="/" element={<PrivateRoute><Navigate to="/dashboard" replace /></PrivateRoute>} />

          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/import/upload" element={<PrivateRoute><ImportUploadPage /></PrivateRoute>} />
          <Route path="/import/external-api" element={<PrivateRoute><ExternalApiPage /></PrivateRoute>} />
          <Route path="/import/logs" element={<PrivateRoute><ImportLogsPage /></PrivateRoute>} />
          <Route path="/movies" element={<PrivateRoute><MoviesPage /></PrivateRoute>} />
          <Route path="/cinemas" element={<PrivateRoute><CinemasPage /></PrivateRoute>} />
          <Route path="/showtimes" element={<PrivateRoute><ShowtimesPage /></PrivateRoute>} />
        </Route>

        {/* 404 - Redirection globale */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  )
}