import {
  Box,
  ColumnLayout,
  Container,
  Header,
} from "@cloudscape-design/components";

import { useTranslation } from "react-i18next";

export function LLMChatbotGeneralInfo() {
  const { t } = useTranslation();
  return (
    <div>
      <Container
        header={<Header variant="h2">{t("llmChatbot.generalinfo")}</Header>}
      >
        <ColumnLayout columns={5} variant="text-grid">
          <div>
            <Box variant="awsui-key-label">{t("llmChatbot.toolversion")}</Box>
            <div>v1.0.0 2024-04-27</div>
          </div>
          <div>
            <Box variant="awsui-key-label">Claude 3</Box>
            <div>anthropic.claude-3-sonnet-20240229-v1:0</div>
          </div>
          {/* <div>
            <Box variant="awsui-key-label">Llama 3</Box>
            <div>meta.llama3-70b-instruct-v1:0</div>
          </div> */}
        </ColumnLayout>
      </Container>
    </div>
  );
}
