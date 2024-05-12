import React from "react";
import { Header } from "../../components";
import error from "../../assets/error.svg";
import style from "./TestPage.module.css";
import { useTranslation } from "react-i18next";
import CopyToClipboard from "@cloudscape-design/components/copy-to-clipboard";
import {
  Box,
  Button,
  ContentLayout,
  Link,
  SpaceBetween,
  Header as CloudScapeHeader,
} from "@cloudscape-design/components";

export function TestPage() {
  const { t } = useTranslation();
  return (
    <ContentLayout
      disableOverlap
      header={
        <SpaceBetween size="m">
          <CloudScapeHeader
            variant="h1"
            info={<Link>Info</Link>}
            description="This is a generic description used in the header."
            actions={<Button variant="primary">Button</Button>}
          >
            Header
          </CloudScapeHeader>
        </SpaceBetween>
      }
    >
      <Box variant="h2">Content heading</Box>

      <Box variant="p">This is a content paragraph.</Box>
    </ContentLayout>
  );
}
