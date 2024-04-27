import {
  Box,
  Button,
  Container,
  FileUpload,
  FormField,
  Input,
  Pagination,
  ProgressBar,
  SpaceBetween,
  Table,
  TextFilter,
} from "@cloudscape-design/components";
import { Header as CloudScapeHeader } from "@cloudscape-design/components";
import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";

export function ForeignAffairsUpload() {
  const [file, setFile] = React.useState(null);
  const [fileError, setFileError] = React.useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [status, setStatus] = useState("none"); // 'none', 'success', 'error'
  const [resultText, setResultText] = useState("");
  const [showProgressBar, setShowProgressBar] = useState(false);

  const handleFileChange = ({ detail }) => {
    const selectedFile = detail.value[0];
    if (!selectedFile) {
      setFile(null);
      setFileError("");
      return;
    }
    const allowedFileNames = [
      "国际公司因公护照信息-sun.xlsx",
      "国际公司外事工作台账-sun.xlsx",
      "基础信息维护-sun.xlsx",
    ];
    const isValidName =
      allowedFileNames.includes(selectedFile.name) ||
      /^常驻-\d{4}\.xlsx$/.test(selectedFile.name);

    if (isValidName) {
      setFile(selectedFile);
      setFileError(""); // 文件符合要求，清除错误信息
    } else {
      setFile(selectedFile); // 文件不符合要求，清除选择的文件
      setFileError(`${selectedFile.name}: 文件格式不正确或文件名不符合要求`);
    }
    // 点击上传后清除报错，成功信息和进度条，并将进度条重置为0
    setStatus("");
    setResultText("");
    setShowProgressBar(false);
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (!file) return;
    setShowProgressBar(true); // 显示进度条
    const formData = new FormData();
    formData.append("file", file); // 确保后端接收时的字段名与此处一致
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
    try {
      await axios.post("http://localhost:8000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <Container
        header={<CloudScapeHeader variant="h2">更新内容</CloudScapeHeader>}
      >
        <FormField>
          <FileUpload
            onChange={handleFileChange}
            value={file ? [file] : []} // FileUpload期望一个数组，即使只上传一个文件
            fileErrors={fileError ? [fileError] : []} // 将错误信息包装成数组
            i18nStrings={{
              uploadButtonText: (e) => (e ? "选择文件" : "选择文件"),
              dropzoneText: (e) =>
                e ? "Drop files to upload" : "Drop file to upload",
              removeFileAriaLabel: (e) => `Remove file ${e + 1}`,
              limitShowFewer: "Show fewer files",
              limitShowMore: "Show more files",
              errorIconAriaLabel: "Error",
            }}
            showFileLastModified
            showFileSize
            showFileThumbnail
          />
        </FormField>
        <br />
        <Button onClick={handleUpload} disabled={!!fileError || !file}>
          上传文件
        </Button>
        {showProgressBar && (
          <ProgressBar
            value={uploadProgress}
            status={
              status === "success"
                ? "success"
                : status === "error"
                ? "error"
                : undefined
            }
            // label={status === "success" ? "Upload Complete" : status === "error" ? "Error" : "Uploading..."}
            additionalInfo={additionalInfo}
            resultText={resultText}
          />
        )}
      </Container>
    </div>
  );
}
