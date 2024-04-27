import React from 'react';
import {
  AppLayout,
  ContentLayout,
  SpaceBetween,
  Header as CloudScapeHeader,
} from '@cloudscape-design/components';
import {Header,LeftNav,FlashNotification,RightNav, HomeContainer} from "../../components"
import { useTranslation } from "react-i18next";

export function HomePage() {
  const { t } = useTranslation();
  return (
    <div>
    <Header />
      <AppLayout
        navigationOpen={true}
        navigation={<LeftNav />}
        // notifications={<FlashNotification type={"info"} content={"测试消息"} id={"message_1"}/>  }
        toolsOpen={true}
        tools={<RightNav guide={<div><p>{t("rightNavHome.text1")}</p><p>{t("rightNavHome.text2")}</p></div>}/>}
        content={
          <ContentLayout
            header={
              <CloudScapeHeader variant="h1">
                {t("homePage.breadcrumb")}
              </CloudScapeHeader>
            }
          >
            <SpaceBetween size="l">
              <HomeContainer imgsrc={"/image-placeholder.png"} imgalt={"placeholder"} appname={t("homePage.appname1")} appdescription={t("homePage.appdescription1")} appexample={t("homePage.appexample1")}/>
              <HomeContainer imgsrc={"/image-placeholder.png"} imgalt={"placeholder"} appname={t("homePage.appname2")} appdescription={t("homePage.appdescription2")} appexample={t("homePage.appexample2")}/>
              <HomeContainer imgsrc={"/image-placeholder.png"} imgalt={"placeholder"} appname={t("homePage.appname3")} appdescription={t("homePage.appdescription3")} appexample={t("homePage.appexample3")}/>
            </SpaceBetween>
          </ContentLayout>
        }
      />
      </div>
  );
}
