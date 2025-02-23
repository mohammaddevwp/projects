import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import "font-awesome/css/font-awesome.min.css";

export default function Message({ message, sender, editable, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message);
  const isCode =
    typeof message === "string" && message.includes('<pre class="code-block">');
  const isPersian = /[\u0600-\u06FF]/.test(message);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    onEdit(editText);
    setIsEditing(false);
  };

  const handleCopy = () => {
    if (isCode) {
      const codeContent = message.match(
        /<pre class="code-block"><code>([\s\S]*?)<\/code>/
      )[1];
      navigator.clipboard
        .writeText(codeContent)
        .then(() => alert("کد کپی شد!"));
    } else {
      navigator.clipboard.writeText(message).then(() => alert("پیام کپی شد!"));
    }
  };

  return (
    <div
      className={`message-container ${
        sender === "user" ? "text-end" : "text-start"
      } mb-2 animate__animated animate__fadeIn`}
    >
      <div
        className={`message ${
          sender === "user" ? "bg-success" : "bg-primary"
        } d-inline-block p-2 rounded shadow-sm`}
        style={{
          maxWidth: "fit-content",
          direction: isPersian ? "rtl" : "ltr",
          textAlign: isPersian ? "right" : "left",
          backgroundColor: sender === "user" ? "#48bb78" : "#3182ce",
        }}
      >
        {isEditing && editable ? (
          <Form onSubmit={handleSave}>
            <Form.Control
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="bg-dark text-white border-secondary mb-2"
              autoFocus
            />
            <Button
              variant="primary"
              type="submit"
              size="sm"
              style={{ backgroundColor: "#4a90e2", borderColor: "#4a90e2" }}
            >
              ذخیره
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(false)}
              style={{
                backgroundColor: "#4a5568",
                borderColor: "#4a5568",
                marginLeft: "5px",
              }}
            >
              لغو
            </Button>
          </Form>
        ) : (
          <>
            {isCode ? (
              <div dangerouslySetInnerHTML={{ __html: message }} />
            ) : (
              message
            )}
            <div className="message-actions d-flex gap-2 mt-1">
              <Button
                variant="link"
                className="p-0 text-white"
                onClick={handleCopy}
                style={{ textDecoration: "none", color: "#ffffff" }}
              >
                <i className="fa fa-copy"></i>
              </Button>
              {sender === "user" && editable && (
                <Button
                  variant="link"
                  className="p-0 text-white"
                  onClick={handleEdit}
                  style={{ textDecoration: "none", color: "#ffffff" }}
                >
                  <i className="fa fa-edit"></i>
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
