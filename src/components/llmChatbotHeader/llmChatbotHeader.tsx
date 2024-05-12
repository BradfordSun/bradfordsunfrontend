import {
  Box,
  Button,
  FormField,
  Header as CloudScapeHeader,
  Input,
  Modal,
  RadioGroup,
  Slider,
  SpaceBetween,
  TextContent,
} from "@cloudscape-design/components";
import styles from "./LLMChatbotHeader.module.css";
import { useTranslation } from "react-i18next";
import anthropic from "../../assets/anthropic.svg";
import meta from "../../assets/meta.svg";
export function LLMChatbotHeader({
  chosenModel,
  model,
  chooseModelVisible,
  changeModel,
  setChooseModelVisible,
  setModel,
  setChosenModel,
  settingVisible,
  temperatureValue,
  setSettingVisible,
  setChangeModel,
  setTemperatureValue,
  setSessionHistoryLoading,
  setShowEmptyChat,
  setIsHistoryChat,
  setSelectedSession,
  pendingReply,
}) {
  const { t } = useTranslation();
  return (
    <CloudScapeHeader
      variant="h2"
      actions={
        // 只有选择模型之后，才会出右边的推理参数的设置按钮
        chosenModel && (
          <Button
            iconName="settings"
            variant="icon"
            onClick={() => setSettingVisible(true)}
          ></Button>
        )
      }
    >
      {chosenModel ? (
        // 如果选了模型，就显示模型的图标，名字以及更改模型的按钮
        <SpaceBetween direction="horizontal" size="xs">
          <img
            src={model === "Claude 3 Sonnet" ? anthropic : meta}
            alt={model}
          />
          <TextContent>
            <h3>{model}</h3>
          </TextContent>
          <Button
            variant="inline-link"
            onClick={() => setChooseModelVisible(true)}
            disabled={pendingReply} // 等待llm回复时不能点新建会话，以免出现问题
          >
            {t("llmChatbot.changemodel")}
          </Button>
        </SpaceBetween>
      ) : (
        // 如果没选模型，就显示选择模型的按钮
        <Button variant="primary" onClick={() => setChooseModelVisible(true)}>
          {t("llmChatbot.choosemodel")}
        </Button>
      )}
      {/* 这个modal是点选择模型按钮后弹出的框 */}
      <Modal
        onDismiss={() => setChooseModelVisible(false)}
        visible={chooseModelVisible}
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                variant="link"
                onClick={() => setChooseModelVisible(false)}
              >
                {t("llmChatbot.cancel")}
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setModel(changeModel); // 保存选中的模型名
                  setChooseModelVisible(false); // 关闭模态框
                  setChosenModel(true); // 设置为已经选择完模型
                  setSessionHistoryLoading(true); // 选完模型就开转圈，调page的useEffect开始读这个user在这个模型下的历史session了
                  setShowEmptyChat(true); // 选完模型直接显示空页面
                  setIsHistoryChat(false); // 所有回到空的操作都应该伴随着非历史记录，以免出现问题。这是因为点击发送消息后有一步会判断是否为空或者历史记录，是的话会重新加载历史session
                  setSelectedSession(""); // 选模型后将之前选的session回复为默认值，以免仍判断sessionid=已选择的session导致某项显示蓝色
                  setTemperatureValue(0.5); // 换模型得重新将温度设为默认值，其他的操作不需要
                }}
              >
                {t("llmChatbot.apply")}
              </Button>
            </SpaceBetween>
          </Box>
        }
        header={t("llmChatbot.choosemodel")}
      >
        <RadioGroup
          value={changeModel}
          onChange={({ detail }) => setChangeModel(detail.value)}
          items={[
            {
              value: "Claude 3 Sonnet",
              label: "Claude 3 Sonnet",
            },
            {
              value: "Llama 3 70B Instruct",
              label: "Llama 3 70B Instruct",
              disabled: true, // 暂时还不支持
            },
          ]}
        />
      </Modal>
      <Modal
        onDismiss={() => setSettingVisible(false)}
        visible={settingVisible}
        header={t("llmChatbot.inference")}
      >
        <FormField label={t("llmChatbot.temperature")}>
          {/* 这里要遵守下官方doc的说明，对css样式做设置。另外小数的话要设置step=0.1 */}
          <div className={styles["flex-wrapper"]}>
            <div className={styles["slider-wrapper"]}>
              <Slider
                onChange={({ detail }) => setTemperatureValue(detail.value)}
                value={temperatureValue}
                max={1.0}
                min={0.0}
                step={0.1}
              />
            </div>
            <SpaceBetween size="m" alignItems="center" direction="horizontal">
              <div className={styles["control-wrapper"]}>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={temperatureValue}
                  onChange={({ detail }) => {
                    setTemperatureValue(Number(detail.value));
                  }}
                  controlId="validation-input"
                  readOnly //不是readonly的话会可以通过输入框乱改
                />
              </div>
            </SpaceBetween>
          </div>
        </FormField>
      </Modal>
    </CloudScapeHeader>
  );
}
