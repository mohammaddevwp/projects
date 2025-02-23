import React, { useState } from "react";
import { Button, Form, InputGroup, Toast } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false); // حالت نمایش رمز
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, username);
      navigate("/");
    } catch (err) {
      setError(err.message);
      setShowToast(true);
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center vh-100">
      <div
        className="login-form p-4 bg-dark text-white rounded shadow"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">ثبت‌نام</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Control
              type="email"
              placeholder="ایمیل"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>
          <Form.Group controlId="formPassword" className="mb-3">
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="رمز عبور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-dark text-white border-secondary"
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                className="border-secondary"
                style={{
                  backgroundColor: "#4a5568",
                  borderColor: "#4a5568",
                  color: "#ffffff",
                }}
              >
                <i
                  className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </Button>
            </InputGroup>
          </Form.Group>
          <Form.Group controlId="formUsername" className="mb-3">
            <Form.Control
              type="text"
              placeholder="نام کاربری"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            className="w-100 mb-3"
            style={{ backgroundColor: "#4a90e2", borderColor: "#4a90e2" }}
          >
            ثبت‌نام
          </Button>
        </Form>
        <div className="auth-options mb-3">
          <Button
            variant="danger"
            className="w-100 mb-2"
            onClick={() => alert("ثبت‌نام با گوگل در حال توسعه است!")}
            style={{ backgroundColor: "#db4437", borderColor: "#db4437" }}
          >
            <i className="fa fa-google"></i> ثبت‌نام با گوگل
          </Button>
          <Button
            variant="secondary"
            className="w-100"
            onClick={() => alert("ثبت‌نام با GitHub در حال توسعه است!")}
            style={{ backgroundColor: "#333", borderColor: "#333" }}
          >
            <i className="fa fa-github"></i> ثبت‌نام با GitHub
          </Button>
        </div>
        <p className="text-center">
          حساب دارید؟{" "}
          <Button
            variant="link"
            onClick={() => navigate("/login")}
            className="text-primary p-0"
            style={{ color: "#4a90e2", textDecoration: "underline" }}
          >
            ورود
          </Button>
        </p>
        <Button
          className="theme-toggle position-absolute top-0 end-0 mt-2 me-2"
          onClick={() => document.body.classList.toggle("light-theme")}
          style={{ backgroundColor: "#4a90e2", borderColor: "#4a90e2" }}
        >
          <i className="fa fa-adjust"></i>
        </Button>
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          className="position-fixed bottom-0 end-0 m-3 p-3 bg-dark text-white border border-light animate__animated animate__fadeInUp"
          style={{ zIndex: 9999, minWidth: "250px" }}
        >
          <Toast.Body>{error || "ثبت‌نام موفق!"}</Toast.Body>
        </Toast>
      </div>
    </div>
  );
}
