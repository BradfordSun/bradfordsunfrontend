import { useState } from "react";
import TopNavigation from "@cloudscape-design/components/top-navigation";
import Input from "@cloudscape-design/components/input";
import logo from "../../assets/meiqiu.jpg";
import { useSelector } from "../../redux/hooks";
import { Dispatch } from "redux";
import { useDispatch } from "react-redux";
import {
  LanguageActionTypes,
  changeLanguageActionCreator,
} from "../../redux/language/languageActions";
import { useTranslation } from "react-i18next";

export function Header() {
  const [searchValue, setSearchValue] = useState("");
  const language = useSelector((state) => state.language);
  const languageList = useSelector((state) => state.languageList);
  const dispatch: Dispatch<LanguageActionTypes> = useDispatch();
  const { t } = useTranslation();
  // console.log看了下这个e打印出来格式是把zh或者en放到了e.detail.id里
  const menuClickHandler = (e) => {
    dispatch(changeLanguageActionCreator(e.detail.id));
  };
  return (
    <div id="h" style={{ position: "sticky", top: 0, zIndex: 1002 }}>
      <TopNavigation
        identity={{
          href: "/",
          title: t("header.title"),
          logo: {
            src: logo,
            alt: "煤球儿",
          },
        }}
        search={
          <Input
            ariaLabel="Input field"
            clearAriaLabel="Clear"
            value={searchValue}
            type="search"
            placeholder={t("header.search")}
            onChange={({ detail }) => setSearchValue(detail.value)}
          />
        }
        utilities={[
          {
            type: "menu-dropdown",
            text: language === "zh" ? "中文" : "English",
            onItemClick: menuClickHandler,
            items: [
              ...languageList.map((l) => {
                return { id: l.code, text: l.name };
              }),
            ],
          },
          {
            type: "button",
            iconName: "notification",
            title: "通知",
            ariaLabel: "Notifications (unread)",
            badge: true,
            disableUtilityCollapse: false,
          },
          {
            type: "menu-dropdown",
            text: "ZTT",
            description: "373914052@qq.com",
            iconName: "user-profile",
            items: [
              { id: "profile", text: t("header.profile") },
              { id: "signout", text: t("header.signout") },
            ],
          },
        ]}
      />
    </div>
  );
}
