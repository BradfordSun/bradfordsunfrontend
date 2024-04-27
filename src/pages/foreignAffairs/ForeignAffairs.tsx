import * as React from "react";
import Table from "@cloudscape-design/components/table";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import TextFilter from "@cloudscape-design/components/text-filter";
import {
  Header,
  LeftNav,
  FlashNotification,
  RightNav,
  HomeContainer,
  ForeignAffairsUpload,
  ForeignAffairsSearch,
  ForeignAffairsDepartmentTable,
  ForeignAffairsPassportTable,
  ForeignAffairsInfoTable,
  ForeignAffairsGeneralInfo,
} from "../../components";
import {
  AppLayout,
  BreadcrumbGroup,
  ContentLayout,
  Header as CloudScapeHeader,
  Link,
} from "@cloudscape-design/components";
import Pagination from "@cloudscape-design/components/pagination";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import axios from "axios";

export function ForeignAffairs() {
  const { t } = useTranslation();
  const [passportloading, setPassportLoading] = useState<boolean>(false);
  const [passporterror, setPassportError] = useState<string | null>(null);
  const [passporttable, setPassportTable] = useState<any>([]);
  const [infoloading, setInfoLoading] = useState<boolean>(false);
  const [infoerror, setInfoError] = useState<string | null>(null);
  const [infotable, setInfoTable] = useState<any>([]);
  const [departmentloading, setDepartmentLoading] = useState<boolean>(false);
  const [departmenterror, setDepartmentError] = useState<string | null>(null);
  const [departmenttable, setDepartmentTable] = useState<any>([]);
  const [searchParams, setSearchParams] = useState<{
    nameValue?: string;
    selectedDepartmentOption?: any;
  }>({});
  const [showPassportTable, setShowPassportTable] = useState<boolean>(false);
  const [emptyPassportTable, setEmptyPassportTable] = useState<boolean>(false);
  const [emptyInfoTable, setEmptyInfoTable] = useState<boolean>(false);
  const [emptyDepartmentTable, setEmptyDepartmentTable] =
    useState<boolean>(false);
  const [showDepartmentTable, setShowDepartmentTable] =
    useState<boolean>(false);
  const [showInfoTable, setShowInfoTable] = useState<boolean>(false);

  function handleSearchClick(nameValue, selectedDepartmentOption) {
    if (nameValue) {
      setSearchParams({ nameValue });
      setPassportLoading(true);
      setInfoLoading(true);
      setShowPassportTable(true);
      setShowInfoTable(true);
      setShowDepartmentTable(false); // 防止同时显示
    } else if (selectedDepartmentOption && selectedDepartmentOption.value) {
      setSearchParams({ selectedDepartmentOption });
      setDepartmentLoading(true);
      setShowDepartmentTable(true);
      setShowPassportTable(false); // 防止同时显示
      setShowInfoTable(false); // 根据你的业务逻辑决定是否需要
    }
  }

  useEffect(() => {
    if (passportloading) {
      const fetchData = async () => {
        try {
          const { data } = await axios.get(`http://localhost:8000/personal`, {
            params: { name: searchParams.nameValue },
          });
          setPassportTable(data.passport);
          setPassportLoading(false);
          setEmptyPassportTable(data.passport.length <= 0);
        } catch (error) {
          setPassportError(error instanceof Error ? error.message : "error");
          setPassportLoading(false);
        } finally {
          setPassportLoading(false);
        }
      };
      fetchData();
    }
  }, [passportloading]);

  useEffect(() => {
    if (infoloading) {
      const fetchData = async () => {
        try {
          const { data } = await axios.get(`http://localhost:8000/personal`, {
            params: { name: searchParams.nameValue },
          });
          setInfoTable(data.info);
          setInfoLoading(false);
          setEmptyInfoTable(data.info.length <= 0);
        } catch (error) {
          setInfoError(error instanceof Error ? error.message : "error");
          setInfoLoading(false);
        } finally {
          setInfoLoading(false);
        }
      };
      fetchData();
    }
  }, [infoloading]);

  useEffect(() => {
    if (departmentloading) {
      const fetchData = async () => {
        try {
          const { data } = await axios.get(`http://localhost:8000/department`, {
            params: {
              department: searchParams.selectedDepartmentOption?.value,
            },
          });
          setDepartmentTable(data);
          setDepartmentLoading(false);
          setEmptyDepartmentTable(data.length <= 0);
        } catch (error) {
          setDepartmentError(error instanceof Error ? error.message : "error");
          setDepartmentLoading(false);
        } finally {
          setDepartmentLoading(false);
        }
      };
      fetchData();
    }
  }, [departmentloading]);

  if (passporterror || departmenterror) {
    return (
      <div>
        网站出错：{passporterror}
        {departmenterror}
      </div>
    );
  }

  return (
    <div>
      <Header />
      <AppLayout
        breadcrumbs={
          <BreadcrumbGroup
            items={[
              { text: "家", href: "/" },
              { text: "客厅", href: "#" },
            ]}
          />
        }
        navigationOpen={false}
        navigation={<LeftNav />}
        // notifications={<FlashNotification type={"info"} content={"测试消息"} id={"message_1"}/>  }
        toolsOpen={false}
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
            header={<CloudScapeHeader variant="h1">外事工具</CloudScapeHeader>}
          >
            <SpaceBetween size="l">
              <ForeignAffairsGeneralInfo />
              <ForeignAffairsUpload />
              <ForeignAffairsSearch onSearchClick={handleSearchClick} />
              {showPassportTable && (
                <ForeignAffairsPassportTable
                  passport={passporttable}
                  loading={passportloading}
                  empty={emptyPassportTable}
                />
              )}
              {showDepartmentTable && (
                <ForeignAffairsDepartmentTable
                  department={departmenttable}
                  loading={departmentloading}
                  empty={emptyDepartmentTable}
                />
              )}
              {showInfoTable && (
                <ForeignAffairsInfoTable
                  info={infotable}
                  loading={infoloading}
                  empty={emptyInfoTable}
                />
              )}
            </SpaceBetween>
          </ContentLayout>
        }
      />
    </div>
  );
}
