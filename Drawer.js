import React, { useState, useEffect } from "react";
import { Button, ListGroup } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import "font-awesome/css/font-awesome.min.css";
import "animate.css/animate.min.css";

export default function Drawer({
  onNewChat,
  chats,
  onSwitchChat,
  onDeleteChat,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();

  // اطلاعات کاربر (از currentUser یا localStorage)
  const userInfo = currentUser || {
    email: "test@example.com",
    username: "testuser",
    joined: new Date("2024-01-01").toLocaleString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  };

  // اگر currentUser وجود داره، اطلاعات واقعی رو استفاده کن
  const realUserInfo = currentUser
    ? {
        email: currentUser.email || "نامشخص",
        username: currentUser.username || "کاربر مهمان",
        joined: currentUser.joined
          ? new Date(currentUser.joined).toLocaleString("en-US", {
              hour12: true,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "نامشخص",
      }
    : userInfo;

  // انیمیشن برای باز شدن Drawer
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("drawer-open");
    } else {
      document.body.classList.remove("drawer-open");
    }
  }, [isOpen]);

  return (
    <>
      <Button
        variant="primary"
        className="drawer-toggle position-fixed top-50 start-0 translate-middle-y p-2"
        onClick={() => setIsOpen(true)}
        style={{
          backgroundColor: "#4a90e2",
          borderColor: "#4a90e2",
          zIndex: 1000,
        }}
      >
        <i className="fa fa-bars" style={{ color: "#ffffff" }}></i>
      </Button>

      <div
        className={`drawer position-fixed top-0 start-0 h-100 bg-dark text-white p-3 animate__animated ${
          isOpen ? "animate__slideInLeft" : "animate__slideOutLeft"
        }`}
        style={{
          width: "300px",
          zIndex: 999,
          boxShadow: "2px 0 10px rgba(0, 0, 0, 0.3)",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.5s ease",
        }}
      >
        <h4 className="mb-3">پروفایل کاربر</h4>
        <ListGroup variant="flush">
          <ListGroup.Item className="bg-dark text-white border-0">
            <strong>نام کاربری:</strong> {realUserInfo.username}
          </ListGroup.Item>
          <ListGroup.Item className="bg-dark text-white border-0">
            <strong>ایمیل:</strong> {realUserInfo.email}
          </ListGroup.Item>
          <ListGroup.Item className="bg-dark text-white border-0">
            <strong>تاریخ ثبت‌نام:</strong> {realUserInfo.joined}
          </ListGroup.Item>
        </ListGroup>

        <h5 className="mt-3 mb-2">چت‌ها</h5>
        <ListGroup variant="flush">
          {chats.map((chat, index) => (
            <ListGroup.Item
              key={index}
              className="bg-dark text-white border-0 d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer", padding: "10px" }}
            >
              <span onClick={() => onSwitchChat(index)}>
                چت {index + 1} - {chat.name || "چت جدید"}
              </span>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDeleteChat(index)}
                style={{
                  backgroundColor: "#e53e3e",
                  borderColor: "#e53e3e",
                  padding: "2px 8px",
                }}
              >
                <i className="fa fa-trash" style={{ color: "#ffffff" }}></i>
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>

        <Button
          variant="success"
          className="mt-3 w-100"
          onClick={() => {
            onNewChat();
            setIsOpen(false); // بستن Drawer بعد از کلیک
          }}
          style={{ backgroundColor: "#48bb78", borderColor: "#48bb78" }}
        >
          <i className="fa fa-plus" style={{ color: "#ffffff" }}></i> چت جدید
        </Button>
        <Button
          variant="secondary"
          className="mt-2 w-100"
          onClick={() => setIsOpen(false)}
          style={{ backgroundColor: "#333", borderColor: "#333" }}
        >
          <i className="fa fa-times" style={{ color: "#ffffff" }}></i> بستن
        </Button>
      </div>

      {/* Overlay برای بستن Drawer با کلیک خارج از آن */}
      {isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 998 }}
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
