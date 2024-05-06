import {
  Box,
  Button,
  ButtonDropdown,
  Cards,
  ColumnLayout,
  Container,
  Header,
  Modal,
  SpaceBetween,
  TextContent,
} from "@cloudscape-design/components";
import { Session } from "inspector";
import React from "react";
import { useState } from "react";

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
  setPendingReply: (pendingReply: boolean) => void;
  setShowEmptyChat: (showEmptyChat: boolean) => void; // Update this line
  setMessages: (messages: any[]) => void; // Update this line to match the expected type of messages
  setDeleteSession: (deleteSession: string) => void;
  setDeleteSessionConfirmation: (deleteSessionConfirmation: boolean) => void;
  setSessionID: (sessionID: string) => void;
  setChatHistoryLoading: (chatHistoryLoading: boolean) => void;
  setSystemPrompt: (systemPrompt: string) => void;
  setIsHistoryChat: (isHistoryChat: boolean) => void;
}

export function LLMChatbotHistory({
  sessionhistory,
  loading,
  empty,
  chosenModel,
  pendingReply,
  sessionID,
  setPendingReply,
  setShowEmptyChat,
  setMessages,
  setDeleteSession,
  setDeleteSessionConfirmation,
  setSessionID,
  setChatHistoryLoading,
  setSystemPrompt,
  setIsHistoryChat,
}: PropsType) {
  const { t } = useTranslation();
  const [selectedItems, setSelectedItems] = useState<SessionHistory[]>([]);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  return (
    <div style={{ height: "64vh" }}>
      <Container fitHeight={true}>
        <TextContent>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4>历史记录</h4>
            {chosenModel && (
              <Button
                iconName="insert-row"
                variant="icon"
                disabled={pendingReply}
                onClick={() => {
                  setShowEmptyChat(true);
                  setMessages([]);
                  setSystemPrompt("");
                  setIsHistoryChat(false);
                }}
              ></Button>
            )}
          </div>
          <br />
        </TextContent>
        <Modal
          onDismiss={() => setShowDeleteModal(false)}
          visible={showDeleteModal}
          footer={
            <Box float="right">
              <SpaceBetween direction="horizontal" size="xs">
                <Button
                  variant="link"
                  onClick={() => setShowDeleteModal(false)}
                >
                  取消
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setDeleteSessionConfirmation(true);
                    setShowDeleteModal(false); // 关闭模态框
                  }}
                >
                  删除
                </Button>
              </SpaceBetween>
            </Box>
          }
          header="确认删除该记录？"
        ></Modal>
        {chosenModel && (
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
                    {/* 文字和按钮的顺序很重要，要匹配style */}
                    {item.sessionName}
                    <ButtonDropdown
                      items={[
                        {
                          text: "进入",
                          id: "enter",
                          disabled: false,
                        },
                        {
                          text: "删除",
                          id: "rm",
                          disabled: false,
                        },
                        {
                          text: "重命名",
                          id: "rn",
                          disabled: true,
                        },
                      ]}
                      onItemClick={({ detail }) => {
                        if (detail.id === "rm") {
                          setDeleteSession(item.sessionID);
                          setShowDeleteModal(true);
                        } else if (detail.id === "enter") {
                          if (sessionID !== item.sessionID) {
                            // 如果点选当前会话的进入，就不做任何动作
                            setPendingReply(true);
                            setSessionID(item.sessionID);
                            setChatHistoryLoading(true);
                          }
                        }
                      }}
                      ariaLabel="Control instance"
                      variant="icon"
                    />
                  </div>
                );
              },
              sections: [
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
            // selectionType="single"
            visibleSections={[]}
            // entireCardClickable={true}
            // onSelectionChange={({ detail }) =>
            //   setSelectedItems(detail?.selectedItems ?? [])
            // }
            // selectedItems={selectedItems}
            items={sessionhistory}
            loading={loading}
            loadingText="查询中..."
            empty={
              empty ? (
                <Box
                  margin={{ vertical: "xs" }}
                  textAlign="center"
                  color="inherit"
                >
                  <SpaceBetween size="m">
                    <b>无</b>
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
