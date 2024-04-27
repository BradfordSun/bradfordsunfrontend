import {
  Box,
  ColumnLayout,
  Container,
  Header,
} from "@cloudscape-design/components";

import { useTranslation } from "react-i18next";

export function ForeignAffairsGeneralInfo({
  passportupdate,
  workupdate,
  basicupdate,
  baseupdate,
}) {
  const { t } = useTranslation();
  return (
    <div>
      <Container
        header={<Header variant="h2">{t("foreignAffairs.generalinfo")}</Header>}
      >
        <ColumnLayout columns={5} variant="text-grid">
          <div>
            <Box variant="awsui-key-label">
              {t("foreignAffairs.toolversion")}
            </Box>
            <div>v1.0.0 2024-04-27</div>
          </div>
          <div>
            <Box variant="awsui-key-label">
              {t("foreignAffairs.passportinfo")}
            </Box>
            <div>{passportupdate.replace("T", " ")}</div>
          </div>
          <div>
            <Box variant="awsui-key-label">{t("foreignAffairs.workinfo")}</Box>
            <div>{workupdate.replace("T", " ")}</div>
          </div>
          <div>
            <Box variant="awsui-key-label">{t("foreignAffairs.basicinfo")}</Box>
            <div>{basicupdate.replace("T", " ")}</div>
          </div>
          <div>
            <Box variant="awsui-key-label">{t("foreignAffairs.baseinfo")}</Box>
            <div>{baseupdate.replace("T", " ")}</div>
          </div>
        </ColumnLayout>
      </Container>
    </div>
  );
}
