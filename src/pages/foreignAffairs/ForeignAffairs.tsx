import SpaceBetween from "@cloudscape-design/components/space-between";
import { useNavigate } from "react-router-dom";

import {
  Header,
  LeftNav,
  RightNav,
  ForeignAffairsUpload,
  ForeignAffairsSearch,
  ForeignAffairsDepartmentTable,
  ForeignAffairsPassportTable,
  ForeignAffairsInfoTable,
  ForeignAffairsGeneralInfo,
  ForeignAffairsExpireTable,
} from "../../components";
import {
  AppLayout,
  BreadcrumbGroup,
  ContentLayout,
  Header as CloudScapeHeader,
} from "@cloudscape-design/components";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import axios from "axios";

export function ForeignAffairs() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // 定义护照台账表格显示相关信息
  const [passportloading, setPassportLoading] = useState<boolean>(false);
  const [passporttable, setPassportTable] = useState<any>([]);
  const [emptyPassportTable, setEmptyPassportTable] = useState<boolean>(false);
  const [showPassportTable, setShowPassportTable] = useState<boolean>(false);
  // 定义批件信息表格显示相关信息
  const [infoloading, setInfoLoading] = useState<boolean>(false);
  const [infotable, setInfoTable] = useState<any>([]);
  const [emptyInfoTable, setEmptyInfoTable] = useState<boolean>(false);
  const [showInfoTable, setShowInfoTable] = useState<boolean>(false);
  // 定义部门团组表格显示相关信息
  const [departmentloading, setDepartmentLoading] = useState<boolean>(false);
  const [departmenttable, setDepartmentTable] = useState<any>([]);
  const [emptyDepartmentTable, setEmptyDepartmentTable] =
    useState<boolean>(false);
  const [showDepartmentTable, setShowDepartmentTable] =
    useState<boolean>(false);
  // 定义批件到期提醒表格显示相关信息
  const [expireloading, setExpireLoading] = useState<boolean>(false);
  const [expiretable, setExpireTable] = useState<any>([]);
  const [emptyExpireTable, setEmptyExpireTable] = useState<boolean>(false);
  const [showExpireTable, setShowExpireTable] = useState<boolean>(false);
  // 定义搜索参数相关信息
  const [searchParams, setSearchParams] = useState<{
    nameValue?: string;
    selectedDepartmentOption?: any;
  }>({});
  // 定义一般信息表格相关信息
  const [passportupdate, setPassportUpdate] = useState<any>("");
  const [workupdate, setWorkUpdate] = useState<any>("");
  const [basicupdate, setBasicUpdate] = useState<any>("");
  const [baseupdate, setBaseUpdate] = useState<any>("");
  // 定义错误页面相关信息
  const [servererror, setServerError] = useState<boolean>(false);
  // 定义文件更新相关下信息
  const [fileupdate, setFileUpdate] = useState({
    passportupdate: "",
    workupdate: "",
    basicupdate: "",
    baseupdate: "",
  });
  // 定义点击搜索后的函数
  function handleSearchClick(nameValue, selectedDepartmentOption) {
    if (nameValue) {
      // 如果是搜索姓名，就传递姓名参数，将护照台账和批件信息设为loading以触发useEffect，同时显示这两个表格，且不显示部门团组和批件提醒表格
      setSearchParams({ nameValue });
      setPassportLoading(true);
      setInfoLoading(true);
      setShowPassportTable(true);
      setShowInfoTable(true);
      setShowDepartmentTable(false);
      setShowExpireTable(false);
    } else if (selectedDepartmentOption && selectedDepartmentOption.value) {
      // 如果是搜索部门，就传递部门参数，将部门团组设为loading以触发useEffect，同时显示这个表格，且不显示护照台账，批件信息和批件提醒表格表格。
      setSearchParams({ selectedDepartmentOption });
      setDepartmentLoading(true);
      setShowDepartmentTable(true);
      setShowPassportTable(false);
      setShowInfoTable(false);
      setShowExpireTable(false);
    }
  }
  // 定义点击批件检查按钮后的函数
  function handleCheckExpireClick() {
    // 显示批件检查，不显示其他表
    setExpireLoading(true);
    setShowExpireTable(true);
    setShowDepartmentTable(false);
    setShowPassportTable(false);
    setShowInfoTable(false);
  }

  // 进入页面时从API获取初始化时间信息
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data } = await axios.get("/api/fileupdate");
        setFileUpdate({
          passportupdate: data.passportupdate,
          workupdate: data.workupdate,
          basicupdate: data.basicupdate,
          baseupdate: data.baseupdate,
        });
      } catch (error) {
        setServerError(true);
      } finally {
        setExpireLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // 接收来自上传组件的更新
  const handleUploadSuccess = (updatedData) => {
    setFileUpdate(updatedData);
  };

  // 当expireloading发生变化时，请求批件过期检查数据
  useEffect(() => {
    if (expireloading) {
      const fetchData = async () => {
        try {
          const { data } = await axios.get(`/api/expire`);
          setExpireTable(data.expire);
          setExpireLoading(false);
          setEmptyExpireTable(data.expire.length <= 0);
        } catch (error) {
          setServerError(true);
        } finally {
          setExpireLoading(false);
        }
      };
      fetchData();
    }
  }, [expireloading]);

  // 当passportloading发生变化时，请求护照数据
  useEffect(() => {
    if (passportloading) {
      const fetchData = async () => {
        try {
          const { data } = await axios.get(`/api/personal`, {
            params: { name: searchParams.nameValue },
          });
          setPassportTable(data.passport);
          setPassportLoading(false);
          setEmptyPassportTable(data.passport.length <= 0);
        } catch (error) {
          setServerError(true);
        } finally {
          setPassportLoading(false);
        }
      };
      fetchData();
    }
  }, [passportloading]);

  // 当infoloading发生变化时，请求批件信息数据
  useEffect(() => {
    if (infoloading) {
      const fetchData = async () => {
        try {
          const { data } = await axios.get(`/api/personal`, {
            params: { name: searchParams.nameValue },
          });
          setInfoTable(data.info);
          setInfoLoading(false);
          setEmptyInfoTable(data.info.length <= 0);
        } catch (error) {
          setServerError(true);
        } finally {
          setInfoLoading(false);
        }
      };
      fetchData();
    }
  }, [infoloading]);

  // 当departmentloading发生变化时，请求部门团组数据
  useEffect(() => {
    if (departmentloading) {
      const fetchData = async () => {
        try {
          const { data } = await axios.get(`/api/department`, {
            params: {
              department: searchParams.selectedDepartmentOption?.value,
            },
          });
          setDepartmentTable(data);
          setDepartmentLoading(false);
          setEmptyDepartmentTable(data.length <= 0);
        } catch (error) {
          setServerError(true);
        } finally {
          setDepartmentLoading(false);
        }
      };
      fetchData();
    }
  }, [departmentloading]);

  // 有任何问题，servererror都会变成true，就跳到定义的500页面
  if (servererror) {
    navigate("/error");
  }

  return (
    <div>
      <Header />
      <AppLayout
        breadcrumbs={
          <BreadcrumbGroup
            items={[
              { text: t("homePage.breadcrumb"), href: "/" },
              { text: t("homePage.appname1"), href: "#" },
            ]}
          />
        }
        navigationOpen={false}
        navigation={<LeftNav />}
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
            header={
              <CloudScapeHeader variant="h1">
                {t("foreignAffairs.title")}
              </CloudScapeHeader>
            }
          >
            <SpaceBetween size="l">
              <ForeignAffairsGeneralInfo {...fileupdate} />
              <ForeignAffairsUpload onUploadSuccess={handleUploadSuccess} />
              <ForeignAffairsSearch
                onSearchClick={handleSearchClick}
                onCheckExpireClick={handleCheckExpireClick}
              />
              {showExpireTable && (
                <ForeignAffairsExpireTable
                  expire={expiretable}
                  loading={expireloading}
                  empty={emptyExpireTable}
                />
              )}
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
