import { Box, Button, Container, FileUpload, Input, Pagination, ProgressBar, SpaceBetween, Table, TextFilter } from "@cloudscape-design/components";
import {Header as CloudScapeHeader} from "@cloudscape-design/components";
import React from "react";

// 也可以用类似 interface PropsType{passport: {"Name":string;Gender: string;}[]} 的方式定义props
interface Passport {
  Name: string;
  Gender: string;
  Birthday: string;
  Birthplace: string;
  PassportNumber: string;
  PassportIssue: string;
  PassportExpire: string;
}

interface PropsType {
  passport: Passport[];
  loading: boolean;
  empty: boolean;
}


export function ForeignAffairsPassportTable({passport, loading, empty}: PropsType) {
    return (
        <div>
            <Table
      columnDefinitions={[
        {
          id: "name",
          header: "持照人",
          cell: item => item.Name,
          isRowHeader: true
        },
        {
          id: "gender",
          header: "性别",
          cell: item => item.Gender,
        },
        {
          id: "birthday",
          header: "出生日期",
          cell: item => item.Birthday,
        },
        {
          id: "birthplace",
          header: "出生地",
          cell: item => item.Birthplace
        },
        {
          id: "passportnumber",
          header: "护照号码",
          cell: item => item.PassportNumber
        },
        {
          id: "passportissue",
          header: "发照日期",
          cell: item => item.PassportIssue
        },
        {
          id: "passportexpire",
          header: "有效期至",
          cell: item => item.PassportExpire
        },
      ]}
      items={passport}
      loading={loading}
      loadingText="查询中"
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
          护照台账
        </CloudScapeHeader>
      }
    />
        </div>
    )
}