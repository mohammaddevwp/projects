import React, { useState, useEffect } from "react";
import { Button, Container, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom"; // برای هدایت به صفحه ثبت‌نام
import ChatInput from "./ChatInput";
import Message from "./Message";
import ThemeToggle from "./ThemeToggle";
import LogoutButton from "./LogoutButton";
import Drawer from "./Drawer";
import "font-awesome/css/font-awesome.min.css";
import "animate.css/animate.min.css"; // برای انیمیشن‌ها
import "bootstrap/dist/css/bootstrap.min.css"; // اطمینان از لینک شدن Bootstrap

export default function Chat() {
  const [chats, setChats] = useState([
    { id: 1, messages: [], name: "چت جدید" },
  ]); // لیست چت‌ها با نام پیش‌فرض
  const [currentChatIndex, setCurrentChatIndex] = useState(0); // ایندکس چت فعلی
  const [messages, setMessages] = useState(chats[0].messages); // پیام‌های چت فعلی
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const { currentUser, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date()); // ساعت داینامیک
  const navigate = useNavigate(); // برای هدایت به صفحه ثبت‌نام

  useEffect(() => {
    // تنظیم تم پیش‌فرض (تاریک)
    const savedTheme = localStorage.getItem("theme");
    if (!savedTheme || savedTheme === "dark") {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }

    // به‌روزرسانی ساعت هر ثانیه
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // پاکسازی تایمر وقتی کامپوننت از بین می‌ره
    return () => clearInterval(timer);
  }, []);

  const handleSendMessage = async (message) => {
    const updatedMessages = [
      ...messages,
      { text: message, sender: "user", editable: true },
    ];
    setMessages(updatedMessages);
    // اگر اولین پیام هست، نام چت رو به اولین پیام تنظیم کن
    if (messages.length === 0) {
      const newChats = chats.map((chat, index) =>
        index === currentChatIndex
          ? {
              ...chat,
              messages: updatedMessages,
              name: message.substring(0, 20) || "چت جدید",
            }
          : chat
      );
      setChats(newChats);
    } else {
      setChats(
        chats.map((chat, index) =>
          index === currentChatIndex
            ? { ...chat, messages: updatedMessages }
            : chat
        )
      );
    }
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.avalai.ir/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer aa-rSvVk4wX2h8KqkPKXpWyLND8B5S5ADge5rQTEragsTCkq0ND`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: message }],
            max_tokens: 1024,
          }),
        }
      );
      if (!response.ok) throw new Error("خطا در ارسال پیام!");
      const data = await response.json();
      const botReply = data.choices[0].message.content;
      // بررسی کد در پاسخ ربات
      const codeMatch = botReply.match(/```([a-z]*)\n([\s\S]*?)\n```/);
      let formattedReply;
      if (codeMatch) {
        const codeLanguage = codeMatch[1] || "javascript";
        const codeContent = codeMatch[2].trim();
        const fileName = `code.${codeLanguage}`;
        formattedReply = `<div class="file-name">${fileName}</div><pre class="code-block"><code>${codeContent}</code></pre><button class="code-copy-btn" onclick="navigator.clipboard.writeText('${codeContent}').then(() => alert('کد کپی شد!'))"><i class="fa fa-copy"></i></button>`;
      } else {
        formattedReply = botReply;
      }
      const newMessages = [
        ...updatedMessages,
        { text: formattedReply, sender: "bot" },
      ];
      setMessages(newMessages);
      setChats(
        chats.map((chat, index) =>
          index === currentChatIndex ? { ...chat, messages: newMessages } : chat
        )
      );
      setAlertMessage("پیام با موفقیت ارسال شد!");
      setAlertVariant("success");
    } catch (err) {
      setAlertMessage(`خطا: ${err.message}`);
      setAlertVariant("danger");
    } finally {
      setLoading(false);
      setShowAlert(true);
    }
  };

  const handleLogout = () => {
    if (window.confirm("آیا می‌خواهید از حساب خود خارج شوید؟")) {
      logout();
      setAlertMessage("با موفقیت خارج شدید!");
      setAlertVariant("success");
      setShowAlert(true);
    }
  };

  const handleNewChat = () => {
    const newChat = { id: Date.now(), messages: [], name: "چت جدید" };
    setChats([...chats, newChat]);
    setCurrentChatIndex(chats.length); // سوئیچ به چت جدید
    setMessages([]); // پیام‌های چت جدید خالی هستند
    setAlertMessage("چت جدید ایجاد شد!");
    setAlertVariant("success");
    setShowAlert(true);
  };

  const handleSwitchChat = (index) => {
    setCurrentChatIndex(index);
    setMessages(chats[index].messages);
    setShowAlert(true);
    setAlertMessage(`به چت ${index + 1} سوئیچ شد!`);
    setAlertVariant("success");
  };

  const handleDeleteChat = (index) => {
    if (window.confirm("آیا می‌خواهید این چت را حذف کنید؟")) {
      const newChats = chats.filter((_, i) => i !== index);
      if (newChats.length === 0) {
        navigate("/register"); // اگر همه چت‌ها پاک شدند، به صفحه ثبت‌نام برگرد
      } else {
        setChats(newChats);
        setCurrentChatIndex(Math.max(0, index - 1)); // سوئیچ به چت قبلی یا اولین چت
        setMessages(newChats[Math.max(0, index - 1)].messages);
        setAlertMessage("چت با موفقیت حذف شد!");
        setAlertVariant("success");
        setShowAlert(true);
      }
    }
  };

  return (
    <Container
      fluid
      className="vh-100 d-flex flex-column bg-dark text-white p-0 animate__animated animate__fadeIn"
    >
      <div
        className="chat-header p-3 bg-primary d-flex justify-content-between align-items-center animate__animated animate__slideInDown"
        style={{ backgroundColor: "#4a90e2", minWidth: "100%" }}
      >
        <div className="header-left">
          <h2 className="mb-0">{chats[currentChatIndex].name}</h2>{" "}
          {/* نمایش نام چت در هدر */}
          <span className="model-name text-white-50">مدل: gpt-4o-mini</span>
        </div>
        <div className="header-right d-flex align-items-center gap-2">
          <span
            className="datetime"
            style={{ color: "#ffffff", fontWeight: "bold" }}
          >
            {currentTime.toLocaleString("en-US", {
              hour12: true,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>
      <Drawer
        onNewChat={handleNewChat}
        chats={chats}
        onSwitchChat={handleSwitchChat}
        onDeleteChat={handleDeleteChat}
      />{" "}
      {/* اضافه کردن onDeleteChat */}
      <div
        className="chat-messages flex-grow-1 overflow-auto p-3 animate__animated animate__fadeIn"
        style={{ backgroundColor: "#2d3748" }}
      >
        {messages.map((msg, index) => (
          <Message
            key={index}
            message={msg.text}
            sender={msg.sender}
            editable={msg.editable}
            onEdit={(newText) => {
              const updatedMessages = [...messages];
              updatedMessages[index] = {
                ...msg,
                text: newText,
                editable: true,
              };
              setMessages(updatedMessages);
              setChats(
                chats.map((chat, i) =>
                  i === currentChatIndex
                    ? { ...chat, messages: updatedMessages }
                    : chat
                )
              );
            }}
          />
        ))}
        {loading && (
          <div className="loading text-center p-2 bg-secondary text-white rounded animate__animated animate__pulse">
            در حال بارگذاری...
          </div>
        )}
      </div>
      <ChatInput onSend={handleSendMessage} />
      {showAlert && (
        <Alert
          variant={alertVariant}
          onClose={() => setShowAlert(false)}
          dismissible
          className="position-fixed top-0 start-50 translate-middle-x m-3 p-3 animate__animated animate__fadeInDown"
          style={{ zIndex: 9999, minWidth: "250px", maxWidth: "400px" }}
        >
          {alertMessage}
        </Alert>
      )}
    </Container>
  );
}
