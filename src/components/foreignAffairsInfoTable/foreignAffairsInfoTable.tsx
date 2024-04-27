import {
  Box,
  SpaceBetween,
  Table,
  TextFilter,
} from "@cloudscape-design/components";
import { Header as CloudScapeHeader } from "@cloudscape-design/components";
import React from "react";

// 定义Info table的格式
interface Info {
  Country: string;
  ApprovalStart: string;
  ApprovalEnd: string;
  ApproveNumber: string;
}

// 因为返回的是一个列表，需要的参数也是一个列表，需要把props定义成列表
interface PropsType {
  info: Info[];
  loading: boolean;
  empty: boolean;
}

export function ForeignAffairsInfoTable({ info, loading, empty }: PropsType) {
  const [filteringText, setFilteringText] = React.useState("");
  const filteredInfo = filteringText
    ? info.filter(
        (item) =>
          String(item.Country)
            .toLowerCase()
            .includes(filteringText.toLowerCase()) ||
          String(item.ApprovalStart)
            .toLowerCase()
            .includes(filteringText.toLowerCase()) ||
          String(item.ApprovalEnd)
            .toLowerCase()
            .includes(filteringText.toLowerCase()) ||
          String(item.ApproveNumber)
            .toLowerCase()
            .includes(filteringText.toLowerCase())
      )
    : info; // 如果没有过滤文本，则显示所有项目
  return (
    <div>
      <Table
        columnDefinitions={[
          {
            id: "country",
            header: "目的国",
            cell: (item) => item.Country,
            isRowHeader: true,
          },
          {
            id: "approvalstart",
            header: "批件生效时间",
            cell: (item) => item.ApprovalStart,
          },
          {
            id: "approvalend",
            header: "批件到期时间",
            cell: (item) => item.ApprovalEnd,
          },
          {
            id: "approvalnumber",
            header: "批复文号",
            cell: (item) => item.ApproveNumber,
          },
        ]}
        items={filteredInfo}
        loading={loading}
        loadingText="查询中"
        empty={
          empty ? (
            <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
              <SpaceBetween size="m">
                <b>查询结果为空</b>
              </SpaceBetween>
            </Box>
          ) : undefined
        }
        filter={
          <TextFilter
            filteringPlaceholder="搜索过滤"
            filteringText={filteringText}
            onChange={({ detail }) => setFilteringText(detail.filteringText)}
          />
        }
        header={<CloudScapeHeader>批件信息</CloudScapeHeader>}
      />
    </div>
  );
}
