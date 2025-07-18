import { useState, useEffect } from "react";
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
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("userId");
    if (storedToken && storedUsername && storedUserId) {
      setToken(storedToken);
      setUsername(storedUsername);
      setUserId(storedUserId);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = ({ token, username, userId }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("userId", userId);
    setToken(token);
    setUsername(username);
    setUserId(userId);
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken("");
    setUsername("");
    setUserId("");
  };

  const ProtectedRoute = ({ element: Element }) =>
    token ? (
      <Layout username={username} onLogout={handleLogout}>
        <Element token={token} username={username} userId={userId} />
      </Layout>
    ) : (
      <Navigate to="/login" />
    );

  return isLoading ? null : (
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
          element={
            token ? (
              <Layout username={username} onLogout={handleLogout}>
                <PostDetail token={token} username={username} userId={userId} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin"
          element={<ProtectedRoute element={AdminDashboard} />}
        />
      </Routes>
    </Router>
  );
}
