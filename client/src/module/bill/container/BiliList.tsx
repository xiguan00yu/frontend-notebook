import React, { useMemo, useCallback } from "react";
import { Table, Spinner } from "reactstrap";
import { useBill } from "../hooks";
import { useCategories } from "../../category";
import { Types, getLocaleByType } from "../../type";
import { useStore } from "../../../store";

export function BiliList() {
  const { data: bill, loading } = useBill();
  const { data: categories } = useCategories();
  const {
    bill: { filter },
  } = useStore();

  // by filter get bill
  const tableData = useMemo(() => {
    let filterBill = [...bill];
    const { types, categories, times } = filter;
    // filter types
    if (Array.isArray(types)) {
      const strTypes = types.map((t: number) => t?.toString());
      filterBill = filterBill?.filter((b) =>
        strTypes?.includes(b?.type?.toString())
      );
    }
    // filter times
    if (Array.isArray(times)) {
      const strTimes = times.map((t: number) => t?.toString());
      filterBill = filterBill?.filter((b) =>
        strTimes?.includes(
          new Date(parseInt(b?.time?.toString(), 10)).getMonth()?.toString()
        )
      );
    }
    // filter categories
    if (Array.isArray(categories)) {
      filterBill = filterBill?.filter((b) => categories?.includes(b?.category));
    }
    return filterBill;
  }, [bill, filter]);

  const tableKeys = useMemo(() => Object.keys(bill?.[0] || {}), [bill]);

  const renderValue = useCallback(
    (key: string, value: string) => {
      switch (key) {
        case "type":
          return getLocaleByType(value);
        case "category":
          return categories?.find((c) => c?.id === value)?.name || "....";
        case "time":
          return new Date(parseInt(value, 10)).toLocaleDateString();
        default:
          return value;
      }
    },
    [categories]
  );

  return (
    <React.Fragment>
      {loading && <Spinner color="primary" />}
      <Table hover>
        <thead>
          <tr>
            <th>#</th>
            {tableKeys.map((k) => (
              <th key={k}>{k}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData?.map((b, index) => (
            <tr key={index}>
              <th scope="row">{index}</th>
              {tableKeys?.map((key) => {
                const value = (b as any)?.[key];
                return <td key={key}>{renderValue(key, value)}</td>;
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">---</th>
            <td>----</td>
            <td>
              {`${getLocaleByType(Types.IN)}: ${tableData
                ?.filter((td) => td?.type?.toString() === Types.IN.toString())
                ?.reduce(
                  (pv, cv) => pv + parseInt(cv?.amount?.toString(), 10),
                  0
                )}`}
            </td>
            <td>
              {`${getLocaleByType(Types.OUT)}: ${
                tableData
                  ?.filter(
                    (td) => td?.type?.toString() === Types.OUT.toString()
                  )
                  ?.reduce(
                    (pv, cv) => pv + parseInt(cv?.amount?.toString(), 10),
                    0
                  ) * -1
              }`}
            </td>
            <td>
              {`Total: ${tableData?.reduce(
                (pv, cv) =>
                  pv +
                  // if types.out need * -1
                  (cv?.type?.toString() === Types.OUT.toString() ? -1 : 1) *
                    parseInt(cv?.amount?.toString(), 10),
                0
              )}`}
            </td>
          </tr>
        </tfoot>
      </Table>
    </React.Fragment>
  );
}
