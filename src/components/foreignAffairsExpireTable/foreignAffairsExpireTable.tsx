import {
  Box,
  SpaceBetween,
  Table,
  TextFilter,
} from "@cloudscape-design/components";
import { Header as CloudScapeHeader } from "@cloudscape-design/components";
import React from "react";

// 也可以用类似 interface PropsType{passport: {"Name":string;Gender: string;}[]} 的方式定义props。但是其实不好，因为这样loading这些就没处放了
// 定义批件即将到期的table格式
interface Expire {
  Name: string;
  Department: string;
  Country: string;
  PermissionStatus: string;
}

// 因为返回的是一个列表，需要的参数也是一个列表，需要把props定义成列表
interface PropsType {
  expire: Expire[];
  loading: boolean;
  empty: boolean;
}

export function ForeignAffairsExpireTable({
  expire,
  loading,
  empty,
}: PropsType) {
  const [filteringText, setFilteringText] = React.useState("");
  const expireInfo = filteringText
    ? expire.filter(
        (item) =>
          String(item.Name)
            .toLowerCase()
            .includes(filteringText.toLowerCase()) ||
          String(item.Department)
            .toLowerCase()
            .includes(filteringText.toLowerCase()) ||
          String(item.Country)
            .toLowerCase()
            .includes(filteringText.toLowerCase()) ||
          String(item.PermissionStatus)
            .toLowerCase()
            .includes(filteringText.toLowerCase())
      )
    : expire; // 如果没有过滤文本，则显示所有项目
  return (
    <div>
      <Table
        columnDefinitions={[
          {
            id: "name",
            header: "姓名",
            cell: (item) => item.Name,
            isRowHeader: true,
          },
          {
            id: "department",
            header: "部门",
            cell: (item) => item.Department,
          },
          {
            id: "country",
            header: "国家",
            cell: (item) => item.Country,
          },
          {
            id: "expiredate",
            header: "批件到期日期",
            cell: (item) => item.PermissionStatus,
          },
        ]}
        items={expireInfo}
        loading={loading}
        loadingText="查询中"
        filter={
          <TextFilter
            filteringPlaceholder="搜索过滤"
            filteringText={filteringText}
            onChange={({ detail }) => setFilteringText(detail.filteringText)}
          />
        }
        empty={
          empty ? (
            <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
              <SpaceBetween size="m">
                <b>查询结果为空</b>
              </SpaceBetween>
            </Box>
          ) : undefined
        }
        header={<CloudScapeHeader>批件到期提醒</CloudScapeHeader>}
      />
    </div>
  );
}
