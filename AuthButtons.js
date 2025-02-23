import React from "react";
import { Button } from "react-bootstrap";
import "font-awesome/css/font-awesome.min.css";

export default function AuthButtons() {
  const handleGoogleAuth = () => {
    alert("ورود/ثبت‌نام با گوگل در حال توسعه است!");
    // اینجا باید API گوگل (OAuth) پیاده‌سازی بشه
  };

  const handleGitHubAuth = () => {
    alert("ورود/ثبت‌نام با GitHub در حال توسعه است!");
    // اینجا باید API GitHub (OAuth) پیاده‌سازی بشه
  };

  return (
    <div className="auth-options mb-3 d-flex gap-2 flex-column">
      <Button
        variant="danger"
        className="w-100"
        onClick={handleGoogleAuth}
        style={{ backgroundColor: "#db4437", borderColor: "#db4437" }}
      >
        <i className="fa fa-google"></i> ورود/ثبت‌نام با گوگل
      </Button>
      <Button
        variant="secondary"
        className="w-100"
        onClick={handleGitHubAuth}
        style={{ backgroundColor: "#333", borderColor: "#333" }}
      >
        <i className="fa fa-github"></i> ورود/ثبت‌نام با GitHub
      </Button>
    </div>
  );
}
