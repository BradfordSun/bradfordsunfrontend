import { Box, Button, Container, FileUpload, Input, Pagination, ProgressBar, SpaceBetween, Table, TextFilter } from "@cloudscape-design/components";
import {Header as CloudScapeHeader} from "@cloudscape-design/components";
import React from "react";

interface Department {
  Name: string;
  Passportexpire: string;
  Approval: string;
}

interface PropsType {
  department: Department[];
  loading: boolean;
  empty: boolean;
}

export function ForeignAffairsDepartmentTable({department, loading, empty}: PropsType) {
    return (
        <div>
            <Table
      columnDefinitions={[
        {
          id: "name",
          header: "姓名",
          cell: item => item.Name,
          isRowHeader: true
        },
        {
          id: "passportexpire",
          header: "护照有效期",
          cell: item => item.Passportexpire,
        },
        {
          id: "approval",
          header: "批件信息",
          cell: item => item.Approval
        }
      ]}
      items={department}
      loading={loading}
      loadingText="查询中"
      resizableColumns
      wrapLines
      empty={ empty ? (
        <Box
          margin={{ vertical: "xs" }}
          textAlign="center"
          color="inherit"
        >
          <SpaceBetween size="m">
            <b>查询结果为空</b>
          </SpaceBetween>
        </Box>
      ) : undefined
      }
      header={
        <CloudScapeHeader>
          部门团组
        </CloudScapeHeader>
      }
    />
        </div>
    )
}