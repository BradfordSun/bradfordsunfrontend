import {
  Box,
  Button,
  ButtonDropdown,
  Cards,
  ColumnLayout,
  Container,
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
}) {
  const { t } = useTranslation();
  return (
    <CloudScapeHeader
      variant="h2"
      actions={
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
          >
            更改
          </Button>
        </SpaceBetween>
      ) : (
        <Button variant="primary" onClick={() => setChooseModelVisible(true)}>
          选择模型
        </Button>
      )}

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
                取消
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setModel(changeModel); // 保存选中的模型名
                  setChooseModelVisible(false); // 关闭模态框
                  setChosenModel(true);
                  setSessionHistoryLoading(true);
                  setShowEmptyChat(true);
                  setIsHistoryChat(false);
                }}
              >
                确定
              </Button>
            </SpaceBetween>
          </Box>
        }
        header="选择模型"
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
            },
          ]}
        />
      </Modal>
      <Modal
        onDismiss={() => setSettingVisible(false)}
        visible={settingVisible}
        header="推理参数"
      >
        <FormField label="温度">
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
              <div className={styles["input-wrapper"]}>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={temperatureValue.toString()}
                  onChange={({ detail }) => {
                    setTemperatureValue(Number(detail.value));
                  }}
                  readOnly
                  controlId="validation-input"
                />
              </div>
            </SpaceBetween>
          </div>
        </FormField>
      </Modal>
    </CloudScapeHeader>
  );
}
