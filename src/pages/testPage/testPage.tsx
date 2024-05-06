import SpaceBetween from "@cloudscape-design/components/space-between";
import { useNavigate } from "react-router-dom";
import styles from "./TestPage.module.css";
import {
  Header,
  LeftNav,
  RightNav,
  ForeignAffairsUpload,
  ForeignAffairsSearch,
  ForeignAffairsDepartmentTable,
  ForeignAffairsPassportTable,
  ForeignAffairsInfoTable,
  ForeignAffairsGeneralInfo,
  ForeignAffairsExpireTable,
  LLMChatbotGeneralInfo,
  LLMChatbotHistory,
  LLMChatbotHeader,
} from "../../components";
import {
  AppLayout,
  Box,
  BreadcrumbGroup,
  Button,
  ButtonDropdown,
  Cards,
  Container,
  ContentLayout,
  Flashbar,
  FormField,
  Grid,
  Header as CloudScapeHeader,
  Icon,
  Input,
  Link,
  Modal,
  RadioGroup,
  Slider,
  Spinner,
  Textarea,
  TextContent,
} from "@cloudscape-design/components";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import emptychat from "../../assets/chat-empty-light.svg";
import anthropic from "../../assets/anthropic.svg";
import meta from "../../assets/meta.svg";
import ReactMarkdown from "react-markdown";
type Message = {
  sender: string;
  texts: string[];
};

// 生成随机数的函数，下面产生session id用
function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function TestPage() {
  const [sessionID, setSessionID] = React.useState("");
  const [sessionName, setSessionName] = React.useState("");
  const [user, setUser] = React.useState("cesu");
  const [chosenModel, setChosenModel] = React.useState(false);
  const [changeModel, setChangeModel] = React.useState("Claude 3 Sonnet");
  const [model, setModel] = React.useState("");
  const [showEmptyChat, setShowEmptyChat] = React.useState(true);
  const [temperatureValue, setTemperatureValue] = React.useState(0.5);
  const [pendingReply, setPendingReply] = React.useState(false);
  const [apiKey, setApiKey] = React.useState("");
  const [systemPrompt, setSystemPrompt] = React.useState("");
  const [chooseModelVisible, setChooseModelVisible] = React.useState(false);
  const [settingVisible, setSettingVisible] = React.useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionHistoryLoading, setSessionHistoryLoading] =
    useState<boolean>(false);
  const [sessionHistory, setSessionHistory] = useState<any>([]);
  const [emptySessionHistory, setEmptySessionHistory] =
    useState<boolean>(false);
  const [deleteSession, setDeleteSession] = useState("");
  const [deleteSessionConfirmation, setDeleteSessionConfirmation] =
    React.useState(false);
  const [deleteFlash, setDeleteFlash] = useState<any>([]);
  const [chatHistoryLoading, setChatHistoryLoading] = useState<boolean>(false);
  const [isHistoryChat, setIsHistoryChat] = useState<boolean>(false);

  useEffect(() => {
    if (sessionHistoryLoading) {
      const fetchData = async () => {
        try {
          const { data } = await axios.get(`http://127.0.0.1:8000/sessions`, {
            params: {
              user: user,
              model: model,
            },
          });
          setSessionHistory(data);
          setSessionHistoryLoading(false);
          setEmptySessionHistory(data.length <= 0);
        } catch (error) {
          // setServerError(true);
        } finally {
          setSessionHistoryLoading(false);
        }
      };
      fetchData();
    }
  }, [sessionHistoryLoading]);

  useEffect(() => {
    if (deleteSessionConfirmation) {
      const fetchData = async () => {
        try {
          const { data } = await axios.delete(
            `http://127.0.0.1:8000/sessions`,
            {
              params: {
                session_id: deleteSession,
              },
            }
          );
          if (data.status === "success") {
            setSessionHistoryLoading(true);
            if (deleteSession === sessionID) {
              // 删除的会话是当前会话，就回到空会话页面
              // 所有回到空的操作都应该伴随着非历史记录，以免出现问题
              setShowEmptyChat(true);
              setIsHistoryChat(false);
            }
            setDeleteFlash([
              {
                type: "success",
                content: "删除成功",
                dismissible: true,
                dismissLabel: "Dismiss message",
                onDismiss: () => setDeleteFlash([]),
                id: "delete_success",
              },
            ]);
          } else {
            setDeleteFlash([
              {
                type: "error",
                content: "删除失败",
                dismissible: true,
                dismissLabel: "Dismiss message",
                onDismiss: () => setDeleteFlash([]),
                id: "delete_fail",
              },
            ]);
          }
        } catch (error) {
          // setServerError(true);
        } finally {
          setDeleteSession("");
          setDeleteSessionConfirmation(false);
        }
      };
      fetchData();
    }
  }, [deleteSessionConfirmation]);

  useEffect(() => {
    if (chatHistoryLoading) {
      setShowEmptyChat(false);
      const fetchData = async () => {
        try {
          const { data } = await axios.get(
            `http://127.0.0.1:8000/chathistory`,
            {
              params: {
                session_id: sessionID,
              },
            }
          );
          setMessages(data);
          setIsHistoryChat(true);
        } catch (error) {
          // setServerError(true);
        } finally {
          setChatHistoryLoading(false);
          setPendingReply(false);
        }
      };
      fetchData();
    }
  }, [chatHistoryLoading]);

  const handleInputChange = (event) => setInputText(event.detail.value);
  const sendMessage = async () => {
    if (inputText.trim().length === 0) {
      setInputText("");
      return;
    }
    let session_id;
    let isNewSession;
    // session_name必须定义为空值，否则到ddb会显示义undefined开头
    let session_name = "";
    const startTimestamp = Date.now(); // Unix timestamp in milliseconds
    const randomString = generateRandomString(5);
    if (showEmptyChat) {
      // 说明是新的chat，可能是点击的新建，也可能是第一次进来就直接问问题，总之不是读的历史记录
      session_id = `${startTimestamp}-${randomString}`;
      setSessionID(session_id);
      isNewSession = true;
      // 汉字算2个token，其他的语言或者标点符号算2个token，加一起不超过19个token，否则就截断显示...
      const maxLength = 19; // 最大token数
      let totalTokens = 0;
      console.log(inputText.trim());
      for (let i = 0; i < inputText.trim().length; i++) {
        const char = inputText.trim()[i];
        if (/[\u4e00-\u9fff]/.test(char)) {
          // 检测是否为中文字符
          totalTokens += 2; // 中文字符计为2个token
        } else {
          totalTokens += 1; // 非中文字符计为1个token
        }
        if (totalTokens > maxLength) {
          session_name += "...";
          break;
        }
        session_name += char;
      }
      setSessionName(session_name);
    } else {
      // 不是新对话就读取sessionID和名字
      session_id = sessionID;
      isNewSession = false;
      session_name = sessionName;
    }

    setShowEmptyChat(false);
    setPendingReply(true);
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const userMessage = { sender: "You", texts: [trimmed] };
    setMessages((messages) => [...messages, userMessage]);
    setInputText("");

    const responseMessage = { sender: "AI", texts: [] };
    setMessages((messages) => [...messages, responseMessage]);

    // 使用 fetch 替换 axios 发送流式响应请求
    fetch("http://localhost:8000/stream-response/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input_text: trimmed,
        max_tokens: 1000,
        api_key: apiKey,
        temperature_value: temperatureValue,
        is_new_session: isNewSession,
        session_id: session_id,
        session_name: session_name,
        start_timestamp: startTimestamp,
        user: user,
        model: model,
        system_prompt: systemPrompt,
      }),
    })
      .then((response) => {
        if (!response.body) throw new Error("Stream not available");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        reader.read().then(function processText({ done, value }) {
          if (done) {
            setPendingReply(false);
            if (isNewSession || isHistoryChat) {
              // 设置为true以便读取历史记录，将新建的显示在最上面。只有新chat第一条以及读取历史记录后才这么做
              // isNewSession是个变量，判断完不用调。isHistoryChat是个useState，执行完要恢复默认
              setSessionHistoryLoading(true);
              setIsHistoryChat(false);
            }
            return;
          }

          let text = decoder.decode(value, { stream: true });
          // 更新最后一条消息，添加新的文本片段
          setMessages((messages) =>
            messages.map((m, i) =>
              i === messages.length - 1
                ? { ...m, texts: [...m.texts, text] }
                : m
            )
          );
          return reader.read().then(processText);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessages((messages) => [
          ...messages,
          { sender: "AI", texts: ["Oops, something went wrong."] },
        ]);
      });
  };

  return (
    <div>
      <Header />
      <AppLayout
        breadcrumbs={
          <BreadcrumbGroup
            items={[
              { text: "家", href: "/" },
              { text: "客厅", href: "#" },
            ]}
          />
        }
        navigationHide={true}
        toolsOpen={false}
        tools={
          <RightNav
            guide={
              <div>
                <p>测试1</p>
                <p>测试2</p>
              </div>
            }
          />
        }
        content={
          <ContentLayout
            header={
              <CloudScapeHeader variant="h1">
                大语言模型聊天机器人
              </CloudScapeHeader>
            }
          >
            <SpaceBetween size="l">
              <LLMChatbotGeneralInfo />
              <div
                style={{
                  height: "90vh",
                }}
              >
                <Flashbar items={deleteFlash} />
                <Container
                  fitHeight={true}
                  header={
                    <LLMChatbotHeader
                      chosenModel={chosenModel}
                      model={model}
                      chooseModelVisible={chooseModelVisible}
                      changeModel={changeModel}
                      setChooseModelVisible={setChooseModelVisible}
                      setModel={setModel}
                      setChosenModel={setChosenModel}
                      settingVisible={settingVisible}
                      temperatureValue={temperatureValue}
                      setSettingVisible={setSettingVisible}
                      setChangeModel={setChangeModel}
                      setTemperatureValue={setTemperatureValue}
                      setSessionHistoryLoading={setSessionHistoryLoading}
                      setShowEmptyChat={setShowEmptyChat}
                      setIsHistoryChat={setIsHistoryChat}
                    />
                  }
                  footer={
                    <Grid
                      gridDefinition={[
                        { colspan: 0.5 },
                        { colspan: 10 },
                        { colspan: 1 },
                      ]}
                    >
                      <div>
                        <Button
                          iconName="upload"
                          variant="icon"
                          disabled={!chosenModel}
                        ></Button>
                      </div>
                      <div>
                        <Textarea
                          value={inputText}
                          onChange={handleInputChange}
                          placeholder="Type your message..."
                          autoFocus
                          rows={1}
                          disabled={!chosenModel}
                        />
                      </div>
                      <div>
                        <Button
                          variant="normal"
                          onClick={sendMessage}
                          disabled={!chosenModel || pendingReply}
                        >
                          运行
                        </Button>
                      </div>
                    </Grid>
                  }
                >
                  <Grid
                    disableGutters
                    gridDefinition={[
                      { colspan: 3 },
                      { colspan: 7 },
                      { colspan: 2 },
                    ]}
                  >
                    <LLMChatbotHistory
                      chosenModel={chosenModel}
                      pendingReply={pendingReply}
                      loading={sessionHistoryLoading}
                      empty={emptySessionHistory}
                      sessionhistory={sessionHistory}
                      sessionID={sessionID}
                      setPendingReply={setPendingReply}
                      setShowEmptyChat={setShowEmptyChat}
                      setMessages={setMessages}
                      setDeleteSession={setDeleteSession}
                      setDeleteSessionConfirmation={
                        setDeleteSessionConfirmation
                      }
                      setSessionID={setSessionID}
                      setChatHistoryLoading={setChatHistoryLoading}
                      setSystemPrompt={setSystemPrompt}
                      setIsHistoryChat={setIsHistoryChat}
                    />
                    <div style={{ height: "64vh" }}>
                      <Container fitHeight={true}>
                        {/* 刚进来的时候显示空chat页 */}
                        {showEmptyChat ? (
                          <div>
                            <img
                              className={styles["empty-chat-image"]}
                              src={emptychat}
                              alt="emptychat"
                              width="300"
                              height="300"
                            />
                            <div className={styles["empty-chat-text"]}>
                              <TextContent>
                                <h3>How can I help you today?</h3>
                              </TextContent>
                            </div>
                          </div>
                        ) : chatHistoryLoading ? (
                          <div className={styles["empty-chat-image"]}>
                            <Spinner size="large" />
                          </div>
                        ) : (
                          messages.map((message, index) => (
                            <div key={index} style={{ margin: "1rem 0" }}>
                              <Icon
                                name={
                                  message.sender === "You"
                                    ? "user-profile"
                                    : "multiscreen"
                                }
                                size="normal"
                              />
                              &nbsp;
                              <strong>{message.sender}</strong>
                              <Box
                                variant={
                                  message.sender === "You"
                                    ? "p"
                                    : "awsui-gen-ai-label"
                                }
                                margin={{ bottom: "xxs" }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {/* 显示消息中所有的文本片段 */}
                                  <span>
                                    <ReactMarkdown>
                                      {message.texts.join("")}
                                    </ReactMarkdown>
                                  </span>
                                </div>
                              </Box>
                            </div>
                          ))
                        )}
                      </Container>
                    </div>
                    <div style={{ height: "64vh" }}>
                      <Container fitHeight={true}>
                        <TextContent>
                          <h4>密钥</h4>
                          <Input
                            onChange={({ detail }) => setApiKey(detail.value)}
                            value={apiKey}
                            type="password"
                          />
                          <br />
                          <h4>系统提示</h4>
                          <Textarea
                            value={systemPrompt}
                            onChange={({ detail }) =>
                              setSystemPrompt(detail.value)
                            }
                            placeholder="输入系统提示..."
                            rows={10}
                          />
                        </TextContent>
                      </Container>
                    </div>
                  </Grid>
                </Container>
              </div>
            </SpaceBetween>
          </ContentLayout>
        }
      />
    </div>
  );
}
