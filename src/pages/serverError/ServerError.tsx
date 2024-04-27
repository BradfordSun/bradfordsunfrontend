import React from "react";
import { Header } from "../../components";
import error from "../../assets/error.svg";
import style from "./ServerError.module.css";
import { useTranslation } from "react-i18next";

export function ServerError() {
  const { t } = useTranslation();
  return (
    <div>
      <Header />
      <div className={style["centered-top-container"]}>
        <img
          className={style["centered-top-image"]}
          src={error}
          alt="error"
          width="150"
          height="100"
        />
        <div className={style["centered-text"]}>
          <h2>{t("serverError.title")}</h2>
          <p>{t("serverError.text")}</p>
        </div>
      </div>
    </div>
  );
}
