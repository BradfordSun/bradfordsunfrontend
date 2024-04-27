import { Box, SpaceBetween, Table } from "@cloudscape-design/components";
import { Header as CloudScapeHeader } from "@cloudscape-design/components";

// 定义部门table的格式
interface Department {
  Name: string;
  Passportexpire: string;
  Approval: string;
}

// 因为返回的是一个列表，需要的参数也是一个列表，需要把props定义成列表
interface PropsType {
  department: Department[];
  loading: boolean;
  empty: boolean;
}

export function ForeignAffairsDepartmentTable({
  department,
  loading,
  empty,
}: PropsType) {
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
            id: "passportexpire",
            header: "护照有效期",
            cell: (item) => item.Passportexpire,
          },
          {
            id: "approval",
            header: "批件信息",
            cell: (item) => item.Approval,
          },
        ]}
        items={department}
        loading={loading}
        loadingText="查询中"
        resizableColumns
        wrapLines
        empty={
          empty ? (
            <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
              <SpaceBetween size="m">
                <b>查询结果为空</b>
              </SpaceBetween>
            </Box>
          ) : undefined
        }
        header={<CloudScapeHeader>部门团组</CloudScapeHeader>}
      />
    </div>
  );
}
