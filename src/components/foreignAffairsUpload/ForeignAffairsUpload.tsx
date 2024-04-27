import {
  Button,
  Container,
  FileUpload,
  FormField,
  ProgressBar,
} from "@cloudscape-design/components";
import { Header as CloudScapeHeader } from "@cloudscape-design/components";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function ForeignAffairsUpload({ onUploadSuccess }) {
  const { t } = useTranslation();
  // 定义有问题跳转到500
  const navigate = useNavigate();
  const [file, setFile] = React.useState(null);
  const [fileError, setFileError] = React.useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [status, setStatus] = useState("none"); // 'none', 'success', 'error'
  const [resultText, setResultText] = useState("");
  const [showProgressBar, setShowProgressBar] = useState(false);

  // 点击选择文件按钮
  const handleFileChange = ({ detail }) => {
    // 读取选择的文件
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
      "常驻.xlsx",
    ];
    // 检查是否属于上面4个excel
    const isValidName = allowedFileNames.includes(selectedFile.name);

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

  // 点击上传按钮
  const handleUpload = async () => {
    if (!file) return;
    setShowProgressBar(true); // 显示进度条
    const formData = new FormData();
    formData.append("file", file); // 确保后端接收时的字段名与此处一致
    const eventSource = new EventSource("/api/events");
    eventSource.onmessage = function (event) {
      const data = JSON.parse(event.data);
      // 实时显示上传进度，其他信息。完毕或有问题后展示状态和结果文字
      setUploadProgress(data.progress || 0);
      setAdditionalInfo(data.step || "");
      setStatus(data.status || "none");
      setResultText(data.resultText || "");
      // 上传完毕或有问题关闭连接
      if (data.status === "success" || data.status === "error") {
        eventSource.close();
      }
    };
    try {
      await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // 假设上传成功后，再次获取最新时间信息
      const { data } = await axios.get("/api/fileupdate");
      onUploadSuccess({
        passportupdate: data.passportupdate,
        workupdate: data.workupdate,
        basicupdate: data.basicupdate,
        baseupdate: data.baseupdate,
      });
    } catch (error) {
      // 有问题不要跳转到500页面，否则会看不到进度条的报错
      console.log(error);
    } finally {
      // 无论如何要关闭连接
      eventSource.close();
    }
  };

  return (
    <div>
      <Container
        header={
          <CloudScapeHeader variant="h2">
            {t("foreignAffairs.updateexcel")}
          </CloudScapeHeader>
        }
      >
        <FormField>
          <FileUpload
            onChange={handleFileChange}
            value={file ? [file] : []} // FileUpload期望一个数组，即使只上传一个文件
            fileErrors={fileError ? [fileError] : []} // 将错误信息包装成数组
            i18nStrings={{
              uploadButtonText: (e) =>
                e
                  ? t("foreignAffairs.choosefile")
                  : t("foreignAffairs.choosefile"),
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
          {t("foreignAffairs.uploadfile")}
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
            additionalInfo={additionalInfo}
            resultText={resultText}
          />
        )}
      </Container>
    </div>
  );
}
