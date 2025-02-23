import React, { useState, useRef } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import "font-awesome/css/font-awesome.min.css";

export default function ChatInput({ onSend }) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() || file) {
      onSend(message.trim());
      setMessage("");
      setFile(null);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    onSend(`فایل ${e.target.files[0].name} ارسال شد.`); // فرضی: تحلیل فایل در اینجا
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (event) =>
        audioChunksRef.current.push(event.data);
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current);
        onSend(`صوت ضبط شد.`); // فرضی: تحلیل صوت در اینجا
      };
      mediaRecorderRef.current.start();
    } catch (err) {
      alert(`خطا در ضبط صدا: ${err.message}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      mediaRecorderRef.current = null;
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="p-3 bg-dark"
      style={{ backgroundColor: "#2d3748", borderTop: "1px solid #4a5568" }}
    >
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="پیام خود را بنویسید..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="bg-dark text-white border-secondary"
          style={{ borderRadius: "8px 0 0 8px" }}
        />
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*,audio/*"
          onChange={handleFileChange}
          className="d-none"
          id="fileInput"
        />
        <Button
          variant="outline-secondary"
          onClick={() => fileInputRef.current.click()}
          className="me-2"
          style={{
            borderRadius: "0",
            borderColor: "#4a5568",
            color: "#ffffff",
          }}
        >
          <i className="fa fa-upload"></i>
        </Button>
        <Button
          variant="outline-secondary"
          onClick={mediaRecorderRef.current ? stopRecording : startRecording}
          className="me-2"
          style={{
            borderRadius: "0",
            borderColor: "#4a5568",
            color: "#ffffff",
          }}
        >
          <i
            className={`fa ${
              mediaRecorderRef.current ? "fa-stop" : "fa-microphone"
            }`}
          ></i>
        </Button>
        <Button
          type="submit"
          variant="primary"
          style={{
            backgroundColor: "#4a90e2",
            borderColor: "#4a90e2",
            borderRadius: "0 8px 8px 0",
          }}
        >
          <i className="fa fa-paper-plane"></i>
        </Button>
      </InputGroup>
    </Form>
  );
}
