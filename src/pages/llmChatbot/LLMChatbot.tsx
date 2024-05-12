import SpaceBetween from "@cloudscape-design/components/space-between";
import { useNavigate } from "react-router-dom";
import styles from "./LLMChatbot.module.css";
import {
  Header,
  RightNav,
  LLMChatbotGeneralInfo,
  LLMChatbotHistory,
  LLMChatbotHeader,
} from "../../components";
import {
  AppLayout,
  Box,
  BreadcrumbGroup,
  Button,
  Container,
  ContentLayout,
  Flashbar,
  Grid,
  Header as CloudScapeHeader,
  Icon,
  Input,
  Spinner,
  Textarea,
  TextContent,
} from "@cloudscape-design/components";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import emptychat from "../../assets/chat-empty-light.svg";
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

export function LLMChatbot() {
  const { t } = useTranslation();
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
  const [sessionHistoryFlash, setSessionHistoryFlash] = useState<any>([]);
  const [chatHistoryFlash, setChatHistoryFlash] = useState<any>([]);
  const [messageFlash, setMessageFlash] = useState<any>([]);
  const [chatHistoryLoading, setChatHistoryLoading] = useState<boolean>(false);
  const [isHistoryChat, setIsHistoryChat] = useState<boolean>(false);
  const [selectedSession, setSelectedSession] = useState("");

  useEffect(() => {
    // 这是查询session历史的
    if (sessionHistoryLoading) {
      const fetchData = async () => {
        try {
          const { data } = await axios.get(`/api/sessions`, {
            params: {
              user: user,
              model: model,
            },
          });
          setSessionHistory(data);
          setSessionHistoryLoading(false);
          setEmptySessionHistory(data.length <= 0);
        } catch (error) {
          // 有问题的话显示flash
          setSessionHistoryFlash([
            {
              type: "error",
              content: t("llmChatbot.sessionfail"),
              dismissible: true,
              dismissLabel: "Dismiss message",
              onDismiss: () => setSessionHistoryFlash([]),
              id: "session_history_fail",
            },
          ]);
        } finally {
          setSessionHistoryLoading(false);
        }
      };
      fetchData();
    }
  }, [sessionHistoryLoading]);

  useEffect(() => {
    // 这是删除某个session的
    if (deleteSessionConfirmation) {
      const fetchData = async () => {
        try {
          const { data } = await axios.delete(`/api/sessions`, {
            params: {
              session_id: deleteSession,
            },
          });
          if (data.status === "success") {
            // 后端传回的状态为成功的话就重新读取历史session列表进行排序
            setSessionHistoryLoading(true);
            if (deleteSession === sessionID) {
              // 删除的会话是当前会话，就回到空会话页面
              // 所有回到空的操作都应该伴随着非历史记录，以免出现问题。这是因为点击发送消息后有一步会判断是否为空或者历史记录，是的话会重新加载历史session
              setShowEmptyChat(true);
              setIsHistoryChat(false);
            }
            // 删除成功弹成功flash
            setDeleteFlash([
              {
                type: "success",
                content: t("llmChatbot.deletesuccess"),
                dismissible: true,
                dismissLabel: "Dismiss message",
                onDismiss: () => setDeleteFlash([]),
                id: "delete_success",
              },
            ]);
          } else {
            // 后端没有成功删除，弹失败flash
            setDeleteFlash([
              {
                type: "error",
                content: t("llmChatbot.deletefail"),
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
          setDeleteSession(""); //最后要把删除的session置空
          setDeleteSessionConfirmation(false); // 删除确认置空
        }
      };
      fetchData();
    }
  }, [deleteSessionConfirmation]);

  useEffect(() => {
    // 这是读取对话历史的
    if (chatHistoryLoading) {
      // 读对话历史了就不是空对话了
      setShowEmptyChat(false);
      const fetchData = async () => {
        try {
          const { data } = await axios.get(`/api/chathistory`, {
            params: {
              session_id: sessionID,
            },
          });
          setMessages(data);
          setIsHistoryChat(true); // 证明这个是对话历史，后面点击发送消息后会读历史消息做多轮会话
          setSelectedSession(sessionID); // 将该session设置为已选择，配合history组件中selectedSession === item.sessionID的比较，将文字显示为蓝色
          setSystemPrompt(""); //读取对话历史后清空系统提示
        } catch (error) {
          // 有问题的话显示flash
          setChatHistoryFlash([
            {
              type: "error",
              content: t("llmChatbot.chathistoryfail"),
              dismissible: true,
              dismissLabel: "Dismiss message",
              onDismiss: () => setChatHistoryFlash([]),
              id: "chat_history_fail",
            },
          ]);
        } finally {
          setChatHistoryLoading(false); // 读取完成后将loading状态恢复为false
          setPendingReply(false); // 读取完成后就可以正常回复了（true是在history组件中点击进入那里设置的）
        }
      };
      fetchData();
    }
  }, [chatHistoryLoading]);

  const handleInputChange = (event) => setInputText(event.detail.value); // 同步修改输入框显示的函数
  const sendMessage = async () => {
    if (inputText.trim().length === 0) {
      // 用户啥也没输入或者只输了空格，点了等于没点
      setInputText("");
      return;
    }
    let session_id;
    let isNewSession;
    // session_name必须定义为空值，否则到ddb会显示以undefined开头
    let session_name = "";
    const startTimestamp = Date.now(); // 毫秒级unix时间戳
    const randomString = generateRandomString(5); // 随机生成5位字符串
    if (showEmptyChat) {
      // 说明是新的chat，可能是点击的新建，也可能是第一次进来就直接问问题，总之不是读的历史记录
      session_id = `${startTimestamp}-${randomString}`; // sessionid格式为“开始时间-随机字符串”
      setSessionID(session_id);
      isNewSession = true; // 这个是变量，不是useState
      // 汉字算2个token，其他的语言或者标点符号算2个token，加一起不超过19个token，否则就截断显示...
      const maxLength = 19; // 最大token数
      let totalTokens = 0;
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
      session_id = sessionID; // 读的useState
      isNewSession = false;
      session_name = sessionName; // 读的useState
    }

    setShowEmptyChat(false); // 发送过后就不能显示空chat页面了
    setPendingReply(true); // 发送过后先不让再点发送，直到收到后台回复
    const trimmed = inputText.trim();
    // 如果这个变量都为false就啥也不干，省的后面出错
    if (!trimmed) return;
    // 定义用户消息，值为去掉空格的输入
    const userMessage = { sender: "You", texts: [trimmed] };
    // 将用户消息添加到消息中,并清空输入，以免影响下一次输入
    setMessages((messages) => [...messages, userMessage]);
    setInputText("");
    // 定义响应消息，默认是空
    const responseMessage = { sender: "AI", texts: [] };
    // 将响应消息添加到添加到消息中
    setMessages((messages) => [...messages, responseMessage]);

    // 使用 fetch 替换 axios 发送流式响应请求
    fetch("/api/stream-response/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // 带上所有这些参数
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
        if (!response.ok) {
          throw new Error("response was not ok: " + response.statusText);
        }
        if (!response.body) throw new Error("Stream not available");
        // 拿到响应之后流式读取
        const reader = response.body.getReader();
        // 创建将字节数据转换为字符串的解码器
        const decoder = new TextDecoder();
        // 每次调用 read() 都会返回一个 Promise，该 Promise 解析为一个具有 done 和 value 属性的对象。该Promise 被解析后，会通过 .then() 方法传递给处理函数 processText。在 processText 函数中，根据 done 的值决定如何处理接收到的数据 value
        reader.read().then(function processText({ done, value }) {
          if (done) {
            // 说明流数据已经全部读取完毕，此时可以再次点击发送了
            setPendingReply(false);
            if (isNewSession || isHistoryChat) {
              // session loading状态设置为true以便重新读取历史session记录，将新建的（或者读取历史记录的）显示在最上面。只有新chat第一条以及读取历史记录后才这么做。
              // isNewSession是个变量，判断完不用修改。isHistoryChat是个useState，执行完要恢复默认
              setSessionHistoryLoading(true);
              setIsHistoryChat(false);
              setSelectedSession(session_id); // 新chat第一条以及读取历史记录后，要设置为Selected，以便session显示为蓝色
            }
            return;
          }
          // 以下是流数据没有读取完毕时。首先要解码这段二进制数据
          let text = decoder.decode(value, { stream: true });
          // 随着messages值变化，不停的通过setMessages更新useState。将新的文本 text 添加到 messages 数组的最后一个元素的 texts 数组中
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
        // 有问题的话显示flash,并且允许再次点击发送
        setPendingReply(false);
        setMessageFlash([
          {
            type: "error",
            content: t("llmChatbot.messagefail"),
            dismissible: true,
            dismissLabel: "Dismiss message",
            onDismiss: () => setMessageFlash([]),
            id: "message_fail",
          },
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
              { text: t("homePage.breadcrumb"), href: "/" },
              { text: t("homePage.appname1"), href: "#" },
            ]}
          />
        }
        navigationHide={true}
        content={
          <ContentLayout
            header={
              <CloudScapeHeader variant="h1">
                {t("llmChatbot.title")}
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
                <Flashbar items={deleteFlash} stackItems />
                <Flashbar items={sessionHistoryFlash} stackItems />
                <Flashbar items={chatHistoryFlash} stackItems />
                <Flashbar items={messageFlash} stackItems />
                <Container
                  // disableContentPaddings
                  // variant="stacked"
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
                      setSelectedSession={setSelectedSession}
                      pendingReply={pendingReply}
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
                          // 上传图片按钮，暂不开放
                          iconName="upload"
                          variant="icon"
                          disabled={!chosenModel}
                        ></Button>
                      </div>
                      <div>
                        <Textarea
                          value={inputText}
                          onChange={handleInputChange}
                          placeholder={t("llmChatbot.inputplaceholder")}
                          autoFocus
                          rows={1} // 先固定行数
                          disabled={!chosenModel} // 没有选择模型的时候为灰色
                        />
                      </div>
                      <div>
                        <Button
                          variant="normal"
                          onClick={sendMessage}
                          disabled={!chosenModel || pendingReply} // 没有选择模型或者等待AI回复是不能点（加载对话历史时候也不能点）
                        >
                          {t("llmChatbot.send")}
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
                      selectedSession={selectedSession}
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
                      setSelectedSession={setSelectedSession}
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
                                <h3>{t("llmChatbot.emptychat")}</h3>
                              </TextContent>
                            </div>
                          </div>
                        ) : chatHistoryLoading ? (
                          // 如果在加载对话历史时显示spin转圈圈
                          <div className={styles["empty-chat-image"]}>
                            <Spinner size="large" />
                          </div>
                        ) : (
                          // 不是空对话且不是loading状态，就显示文本
                          messages.map((message, index) => (
                            <div key={index} style={{ margin: "1rem 0" }}>
                              <Icon
                                // 看message中的发送者显示对应图标
                                name={
                                  message.sender === "You"
                                    ? "user-profile"
                                    : "multiscreen"
                                }
                                size="normal"
                              />
                              {/* icon和图标之间加个空格 */}
                              &nbsp;
                              {/* 发送者名字加粗 */}
                              <strong>{message.sender}</strong>
                              <Box
                                // 根据发送者不同显示不同字体
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
                                  {/* 显示消息中所有的文本片段（拼接在一起），并且以markdown语法解析 */}
                                  <span>
                                    <ReactMarkdown>
                                      {message.texts.join("")}
                                    </ReactMarkdown>
                                  </span>
                                </div>
                                {/* <CopyToClipboard
                                  copyButtonAriaLabel="Copy ARN"
                                  copyErrorText="ARN failed to copy"
                                  copySuccessText="ARN copied"
                                  textToCopy="SLCCSMWOHOFUY0"
                                  variant="icon"
                                ></CopyToClipboard> */}
                              </Box>
                            </div>
                          ))
                        )}
                      </Container>
                    </div>
                    <div style={{ height: "64vh" }}>
                      <Container fitHeight={true}>
                        <TextContent>
                          <h4>{t("llmChatbot.apikey")}</h4>
                          <Input
                            // 输入apikey的地方
                            onChange={({ detail }) => setApiKey(detail.value)}
                            value={apiKey}
                            type="password"
                          />
                          <br />
                          <h4>{t("llmChatbot.systemprompt")}</h4>
                          <Textarea
                            // 输入系统提示的地方
                            value={systemPrompt}
                            onChange={({ detail }) =>
                              setSystemPrompt(detail.value)
                            }
                            placeholder={t(
                              "llmChatbot.systempromptplaceholder"
                            )}
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
