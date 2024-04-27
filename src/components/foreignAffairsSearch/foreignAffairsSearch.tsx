import { Button, Grid, Input, Select } from "@cloudscape-design/components";
import React from "react";
import { useTranslation } from "react-i18next";

export function ForeignAffairsSearch({ onSearchClick, onCheckExpireClick }) {
  const { t } = useTranslation();
  const [nameValue, setNameValue] = React.useState("");
  // 注意类型要是any或者null，否则下面detail.selectedOption会报错
  const [selectedOption, setSelectedOption] = React.useState<any | null>(null);

  const handleClearSearch = () => {
    setNameValue("");
    setSelectedOption(null); // 将Select重置为初始未选择状态
  };
  return (
    <Grid
      gridDefinition={[
        { colspan: { default: 2, xxs: 2 } },
        { colspan: { default: 3, xxs: 3 } },
        { colspan: { default: 1, xxs: 1 } },
        { colspan: { default: 1, xxs: 1 } },
      ]}
    >
      <div>
        <Input
          onChange={({ detail }) => {
            setNameValue(detail.value);
            if (detail.value !== "") {
              setSelectedOption(null); // 如果在Input中输入，则重置Select
            }
          }}
          value={nameValue}
          autoFocus
          placeholder={t("foreignAffairs.inputname")}
        />
      </div>
      <div>
        <Select
          selectedOption={selectedOption}
          onChange={({ detail }) => {
            // 检查是否选择了“未选择”选项
            if (detail.selectedOption.value === "") {
              setSelectedOption(null); // 没有选择任何部门
            } else {
              setSelectedOption(detail.selectedOption);
              setNameValue("");
            }
          }}
          // 这个value最终会作为传递给后端的查询字符串
          options={[
            { label: "-", value: "" },
            { label: "领导班子", value: "领导班子" },
            { label: "高管", value: "高管" },
            { label: "北部非洲区域中心", value: "北部非洲区域中心" },
            { label: "南部非洲区域中心", value: "南部非洲区域中心" },
            { label: "美洲区域中心", value: "美洲区域中心" },
            { label: "欧洲及中东区域中心", value: "欧洲及中东区域中心" },
            { label: "亚太区域中心", value: "亚太区域中心" },
            { label: "市场经营中心", value: "市场经营中心" },
            { label: "项目管理中心", value: "项目管理中心" },
            { label: "综合管理部", value: "综合管理部" },
            { label: "安质部", value: "安质部" },
            { label: "财务部", value: "财务部" },
            { label: "风控部", value: "风控部" },
          ]}
          placeholder={t("foreignAffairs.choosedepartment")}
        />
      </div>
      <div>
        <Button
          variant="primary"
          onClick={() => onSearchClick(nameValue, selectedOption)}
        >
          {t("foreignAffairs.search")}
        </Button>
      </div>
      <div>
        <Button variant="normal" onClick={handleClearSearch}>
          {t("foreignAffairs.clear")}
        </Button>
      </div>
      <div>
        <Button variant="normal" onClick={() => onCheckExpireClick()}>
          {t("foreignAffairs.checkapproval")}
        </Button>
      </div>
    </Grid>
  );
}
