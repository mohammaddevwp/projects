import React from "react";
import { Button } from "react-bootstrap";
import "font-awesome/css/font-awesome.min.css";

export default function ThemeToggle() {
  const toggleTheme = () => {
    const body = document.body;
    body.classList.toggle("light-theme");
    body.classList.toggle("dark-theme");
    localStorage.setItem(
      "theme",
      body.classList.contains("dark-theme") ? "dark" : "light"
    );
  };

  return (
    <Button
      variant="primary"
      className="theme-toggle"
      onClick={toggleTheme}
      style={{
        backgroundColor: "#4a90e2",
        borderColor: "#4a90e2",
        padding: "8px 12px",
      }}
    >
      <i className="fa fa-adjust" style={{ color: "#ffffff" }}></i>
    </Button>
  );
}
