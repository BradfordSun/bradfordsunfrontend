import React, { useState, useEffect } from "react";
import {
  Button,
  FileUpload,
  FormField,
  ProgressBar,
} from "@cloudscape-design/components";
import axios from "axios";

export function TestPage() {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [status, setStatus] = useState("none");
  const [resultText, setResultText] = useState("");

  const handleFileChange = ({ detail }) => {
    const selectedFile = detail.value[0];
    setFile(selectedFile);
    setFileError("");
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:8000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const eventSource = new EventSource("http://localhost:8000/events");
      eventSource.onmessage = function (event) {
        const data = JSON.parse(event.data);
        setUploadProgress(data.progress || 0);
        setAdditionalInfo(data.step || "");
        setStatus(data.status || "none");
        setResultText(data.resultText || "");

        if (data.status === "success" || data.status === "error") {
          eventSource.close();
        }
      };
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <FormField>
        <FileUpload
          onChange={handleFileChange}
          value={file ? [file] : []}
          fileErrors={fileError ? [fileError] : []}
          i18nStrings={{
            uploadButtonText: (e) => (e ? "选择文件" : "选择文件"),
            dropzoneText: (e) =>
              e ? "Drop files to upload" : "Drop file to upload",
            removeFileAriaLabel: (e) => `Remove file ${e + 1}`,
            limitShowFewer: "Show fewer files",
            limitShowMore: "Show more files",
            errorIconAriaLabel: "Error",
          }}
        />
      </FormField>
      <Button onClick={handleUpload} disabled={!file || !!fileError}>
        Upload
      </Button>
      <ProgressBar
        value={uploadProgress}
        status={
          status === "success"
            ? "success"
            : status === "error"
            ? "error"
            : undefined
        }
        label={
          status === "success"
            ? "Upload Complete"
            : status === "error"
            ? "Error"
            : "Uploading..."
        }
        additionalInfo={additionalInfo}
        resultText={resultText}
      />
    </div>
  );
}
