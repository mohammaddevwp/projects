import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Chat from "./components/Chat";
import "./styles/custom.css";

// کامپوننت PrivateRoute با استفاده از useNavigate
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <Navigate
        to="/register"
        replace
        state={{ from: window.location.pathname }}
      />
    ); // تغییر به /register
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/register" replace />} />{" "}
          {/* تغییر به /register به‌عنوان پیش‌فرض */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
