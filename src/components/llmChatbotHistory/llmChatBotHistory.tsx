import {
  Box,
  Button,
  ButtonDropdown,
  Cards,
  Container,
  Flashbar,
  Modal,
  SpaceBetween,
  TextContent,
} from "@cloudscape-design/components";
import React from "react";

import { useTranslation } from "react-i18next";

interface SessionHistory {
  // 这里的sessionID是useEffect拿到的dynamodb里面的值
  sessionID: string;
  sessionName: string;
  lastUpdateTimestamp: number;
}

interface PropsType {
  sessionhistory: SessionHistory[];
  loading: boolean;
  empty: boolean;
  chosenModel: boolean;
  pendingReply: boolean;
  // 这里的sessionID不同于上面的，这个是page父组件传递过来的
  sessionID: string;
  selectedSession: string;
  setPendingReply: (pendingReply: boolean) => void;
  setShowEmptyChat: (showEmptyChat: boolean) => void;
  setMessages: (messages: any[]) => void;
  setDeleteSession: (deleteSession: string) => void;
  setDeleteSessionConfirmation: (deleteSessionConfirmation: boolean) => void;
  setSessionID: (sessionID: string) => void;
  setChatHistoryLoading: (chatHistoryLoading: boolean) => void;
  setSystemPrompt: (systemPrompt: string) => void;
  setIsHistoryChat: (isHistoryChat: boolean) => void;
  setSelectedSession: (selectedSession: string) => void;
}

export function LLMChatbotHistory({
  sessionhistory,
  loading,
  empty,
  chosenModel,
  pendingReply,
  sessionID,
  selectedSession,
  setPendingReply,
  setShowEmptyChat,
  setMessages,
  setDeleteSession,
  setDeleteSessionConfirmation,
  setSessionID,
  setChatHistoryLoading,
  setSystemPrompt,
  setIsHistoryChat,
  setSelectedSession,
}: PropsType) {
  const { t } = useTranslation();
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  return (
    <div style={{ height: "64vh" }}>
      <Container fitHeight={true}>
        {/* fitheight得设置为固定，要不然高度变来变去 */}
        <TextContent>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4>{t("llmChatbot.history")}</h4>
            {chosenModel && (
              <Button
                // 这是新建会话的按钮
                iconName="insert-row"
                variant="icon"
                disabled={pendingReply} // 等待llm回复时不能点新建会话，以免出现问题
                onClick={() => {
                  setShowEmptyChat(true); // 点击新建会话之后聊天框设置为空
                  setMessages([]); // 点击新建会话之后清空记录中的消息
                  setSystemPrompt(""); // 点击新建会话之后清空系统提示
                  setIsHistoryChat(false); // 所有回到空的操作都应该伴随着非历史记录，以免出现问题。这是因为点击发送消息后有一步会判断是否为空或者历史记录，是的话会重新加载历史session
                  setSelectedSession(""); // 点击新建会话之后清空已选择的session，以免仍显示之前所选定的某个历史记录的蓝色
                }}
              ></Button>
            )}
          </div>
          <br />
        </TextContent>

        <Modal
          // 这是删除某个session的弹出框
          onDismiss={() => setShowDeleteModal(false)}
          visible={showDeleteModal}
          footer={
            <Box float="right">
              <SpaceBetween direction="horizontal" size="xs">
                <Button
                  variant="link"
                  onClick={() => setShowDeleteModal(false)}
                >
                  {t("llmChatbot.cancel")}
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setDeleteSessionConfirmation(true); // 设置为确认删除，以便page页面执行useEffect去调用delete方法。这里是一个布尔值用于触发，而不是具体的sessionid
                    setShowDeleteModal(false); // 关闭模态框
                  }}
                >
                  {t("llmChatbot.delete")}
                </Button>
              </SpaceBetween>
            </Box>
          }
          header={t("llmChatbot.confirmdelete")}
        ></Modal>
        {chosenModel && (
          // 只有选择模型后才显示session历史
          <Cards
            cardDefinition={{
              header: (item) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontWeight: "normal",
                      fontSize: "14px",
                    }}
                  >
                    {/* 文字和按钮的顺序很重要，要匹配style。如果点击进入的那个session的sessionid和某个card里的sessionid一样，就把这个card的header文字变为蓝色，否则为黑色 */}
                    <span
                      style={{
                        color:
                          selectedSession === item.sessionID
                            ? "#0972d3"
                            : "#000716",
                      }}
                    >
                      {item.sessionName}
                    </span>
                    <ButtonDropdown
                      items={[
                        {
                          text: t("llmChatbot.enter"),
                          id: "enter",
                          disabled: false,
                        },
                        {
                          text: t("llmChatbot.delete"),
                          id: "rm",
                          disabled: false,
                        },
                        {
                          text: t("llmChatbot.rename"),
                          id: "rn",
                          disabled: true,
                        },
                      ]}
                      onItemClick={({ detail }) => {
                        if (detail.id === "rm") {
                          setDeleteSession(item.sessionID); // 记录要删除的sessionid，但是具体触发删除是由DeleteSessionConfirmation做的
                          setShowDeleteModal(true); // 显示确认删除的弹出框
                        } else if (detail.id === "enter") {
                          if (sessionID !== item.sessionID) {
                            // 如果点选当前会话的进入，就不做任何动作
                            setPendingReply(true); // 进入新的会话完成之前不让点击发送，就和等待后台回复一样
                            setSessionID(item.sessionID); // 设置sessiondid的值。（不是用于文字变蓝色，因为那个是在page中的useEffect中设置selectedsession之后，与item.sessionID比较的）
                            setChatHistoryLoading(true); //设置为读取chat历史状态，加载spin的圈圈
                          }
                        }
                      }}
                      ariaLabel="Control instance"
                      variant="icon"
                      disabled={pendingReply} // 等待llm回复时不能进入历史会话，以免出现问题
                    />
                  </div>
                );
              },
              sections: [
                // 这两个section都不显示
                {
                  id: "sessionID",
                  header: "sessionID",
                  content: (item) => item.sessionID,
                },
                {
                  id: "lastUpdateTimestamp",
                  header: "lastUpdateTimestamp",
                  content: (item) => item.lastUpdateTimestamp,
                },
              ],
            }}
            visibleSections={[]}
            items={sessionhistory}
            loading={loading}
            empty={
              empty ? (
                <Box
                  margin={{ vertical: "xs" }}
                  textAlign="center"
                  color="inherit"
                >
                  <SpaceBetween size="m">
                    <b>{t("llmChatbot.emptyhistory")}</b>
                  </SpaceBetween>
                </Box>
              ) : undefined
            }
          />
        )}
      </Container>
    </div>
  );
}
