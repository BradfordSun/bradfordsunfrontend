import {
  AppLayout,
  ContentLayout,
  SpaceBetween,
  Header as CloudScapeHeader,
} from "@cloudscape-design/components";
import { Header, LeftNav, RightNav, HomeContainer } from "../../components";
import { useTranslation } from "react-i18next";

import keting from "../../assets/keting.jpg";
import woshi from "../../assets/woshi.jpg";
import canting from "../../assets/canting.jpg";

export function HomePage() {
  const { t } = useTranslation();
  return (
    <div>
      <Header />
      <AppLayout
        navigationOpen={true}
        navigation={<LeftNav />}
        toolsOpen={true}
        tools={
          <RightNav
            guide={
              <div>
                <p>{t("rightNavHome.text1")}</p>
                <p>{t("rightNavHome.text2")}</p>
              </div>
            }
          />
        }
        content={
          <ContentLayout
            header={
              <CloudScapeHeader variant="h1">
                {t("homePage.breadcrumb")}
              </CloudScapeHeader>
            }
          >
            <SpaceBetween size="l">
              <HomeContainer
                imgsrc={keting}
                imgalt={"livingroom"}
                appname={t("homePage.appname1")}
                appdescription={t("homePage.appdescription1")}
                appexample={t("homePage.appexample1")}
              />
              <HomeContainer
                imgsrc={woshi}
                imgalt={"bedroom"}
                appname={t("homePage.appname2")}
                appdescription={t("homePage.appdescription2")}
                appexample={t("homePage.appexample2")}
              />
              <HomeContainer
                imgsrc={canting}
                imgalt={"kitchen"}
                appname={t("homePage.appname3")}
                appdescription={t("homePage.appdescription3")}
                appexample={t("homePage.appexample3")}
              />
            </SpaceBetween>
          </ContentLayout>
        }
      />
    </div>
  );
}
