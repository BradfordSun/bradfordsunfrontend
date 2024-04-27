import { HelpPanel, TextContent } from "@cloudscape-design/components";
import { useTranslation } from "react-i18next";

export function RightNav({ guide }) {
  const { t } = useTranslation();
  return (
    <HelpPanel header={<h2>{t("rightNavHome.title")}</h2>}>
      <TextContent>{guide}</TextContent>
    </HelpPanel>
  );
}
