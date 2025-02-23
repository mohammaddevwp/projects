import React, { useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  const handleLogout = () => {
    if (window.confirm("آیا می‌خواهید از حساب خود خارج شوید؟")) {
      logout();
      navigate("/login");
      setShowAlert(true); // نمایش اعلان
    }
  };

  return (
    <>
      <Button
        variant="success"
        className="logout-btn d-flex align-items-center gap-1"
        onClick={handleLogout}
        style={{
          backgroundColor: "#48bb78",
          borderColor: "#48bb78",
          padding: "8px 12px",
        }}
      >
        <i className="fa fa-sign-out-alt" style={{ color: "#ffffff" }}></i>
        <span className="d-none d-md-inline">خروج</span>
      </Button>
      {showAlert && (
        <Alert
          variant="success"
          onClose={() => setShowAlert(false)}
          dismissible
          className="position-fixed top-0 start-50 translate-middle-x m-3 p-3 animate__animated animate__fadeInDown"
          style={{ zIndex: 9999, minWidth: "250px", maxWidth: "400px" }}
        >
          با موفقیت خارج شدید!
        </Alert>
      )}
    </>
  );
}
