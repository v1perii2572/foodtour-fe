import { useState } from "react";
import SubscriptionPage from "./pages/SubscriptionPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Home from "./pages/Home";
import SavedRoutes from "./pages/SavedRoutes";
import RouteViewer from "./pages/RouteViewer";
import ChatPage from "./pages/ChatPage";
import Layout from "./components/Layout";
import ProfilePage from "./pages/ProfilePage";
import PostPage from "./pages/PostPage";
import PostDetail from "./pages/PostDetail";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );

  const handleLogin = (token, user) => {
    const shortName = user.name;
    setToken(token);
    setUsername(shortName);
    localStorage.setItem("token", token);
    localStorage.setItem("username", shortName);
  };

  const handleLogout = () => {
    setToken("");
    setUsername("");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  const ProtectedRoute = ({ element: Element }) =>
    token ? (
      <Layout username={username} onLogout={handleLogout}>
        <Element token={token} username={username} onLogout={handleLogout} />
      </Layout>
    ) : (
      <Navigate to="/login" />
    );

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            token ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />
          }
        />
        <Route
          path="/register"
          element={
            token ? (
              <Navigate to="/" />
            ) : (
              <RegisterPage
                onRegister={() => (window.location.href = "/login")}
              />
            )
          }
        />
        <Route
          path="/"
          element={
            <Layout username={username} onLogout={handleLogout}>
              <Home token={token} username={username} onLogout={handleLogout} />
            </Layout>
          }
        />
        <Route
          path="/saved"
          element={<ProtectedRoute element={SavedRoutes} />}
        />
        <Route
          path="/map-view"
          element={<ProtectedRoute element={RouteViewer} />}
        />
        <Route path="/chat" element={<ProtectedRoute element={ChatPage} />} />
        <Route
          path="/trang-ca-nhan"
          element={<ProtectedRoute element={ProfilePage} />}
        />
        <Route
          path="/goi-dang-ky"
          element={<ProtectedRoute element={SubscriptionPage} />}
        />
        <Route path="/posts" element={<ProtectedRoute element={PostPage} />} />
        <Route
          path="/posts/:id"
          element={<ProtectedRoute element={PostDetail} />}
        />
      </Routes>
    </Router>
  );
}
