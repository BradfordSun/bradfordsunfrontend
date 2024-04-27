import * as React from "react";
import {
  Box,
  ColumnLayout,
  Container,
  Header,
  StatusIndicator,
} from "@cloudscape-design/components";

export function ForeignAffairsGeneralInfo() {
  return (
    <div>
      <Container header={<Header variant="h2">一般信息</Header>}>
        <ColumnLayout columns={5} variant="text-grid">
          <div>
            <Box variant="awsui-key-label">工具版本</Box>
            <div>v1.0 2024-04-20T21:18:32</div>
          </div>
          <div>
            <Box variant="awsui-key-label">国际公司因公护照信息</Box>
            <div></div>
          </div>
          <div>
            <Box variant="awsui-key-label">国际公司外事工作台账</Box>
            <div></div>
          </div>
          <div>
            <Box variant="awsui-key-label">基础信息维护</Box>
            <div></div>
          </div>
          <div>
            <Box variant="awsui-key-label">常驻</Box>
            <div></div>
          </div>
          {/* <div>
        <Box variant="awsui-key-label">Pending maintenance</Box>
        <div>None</div>
      </div> */}
        </ColumnLayout>
      </Container>
    </div>
  );
}
