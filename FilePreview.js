import React from "react";
import { Button } from "react-bootstrap";
import "font-awesome/css/font-awesome.min.css";

export default function FilePreview({ file, type, onCopy }) {
  const previewUrl = URL.createObjectURL(file);
  const isPersian = /[\u0600-\u06FF]/.test(file.name);

  return (
    <div
      className={`file-preview mb-2 p-2 bg-secondary rounded shadow-sm d-flex flex-column gap-2`}
      style={{
        maxWidth: "fit-content",
        direction: isPersian ? "rtl" : "ltr",
        textAlign: isPersian ? "right" : "left",
        backgroundColor: "#4a5568",
      }}
    >
      {type === "image" ? (
        <img src={previewUrl} alt={file.name} style={{ maxWidth: "100%" }} />
      ) : (
        <audio controls src={previewUrl} className="audio-player" />
      )}
      <span>{` (${file.name})`}</span>
      <Button
        variant="link"
        className="p-0 text-white"
        onClick={() => onCopy(file.name)}
        style={{ textDecoration: "none", color: "#ffffff" }}
      >
        <i className="fa fa-copy"></i>
      </Button>
    </div>
  );
}
