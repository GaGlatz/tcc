import { useState, useEffect } from "react";
import { Table } from "rsuite";

const { Column, HeaderCell, Cell } = Table;

const sortColumns = (data, sortColumn, sortType) => {
  return [...data].sort((a, b) => {
    let x = a[sortColumn];
    let y = b[sortColumn];

    if (typeof x === "string") {
      x = x.charCodeAt();
    }
    if (typeof y === "string") {
      y = y.charCodeAt();
    }
    return sortType === "asc" ? x - y : y - x;
  });
};

const TableComponent = ({
  rows = [],
  onRowClick,
  config = [],
  actions,
  loading,
}) => {
  const [data, setData] = useState([]);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();

  useEffect(() => {
    setData(rows);
  }, [rows]);

  const handleSortColumn = (sortColumn, sortType) => {
    const sortedData = sortColumns(data, sortColumn, sortType);
    setData(sortedData);
    setSortColumn(sortColumn);
    setSortType(sortType);
  };

  return (
    <Table
      onSortColumn={handleSortColumn}
      sortColumn={sortColumn}
      sortType={sortType}
      height={400}
      data={data}
      loading={loading}
      onRowClick={onRowClick}
    >
      {config.map((c, index) => (
        <Column key={index} flexGrow={1} fixed={c.fixed} width={c.width}>
          <HeaderCell>{c.label}</HeaderCell>
          <Cell dataKey={c.key}>
            {c.content ? (item) => c.content(item[c.key]) : null}
          </Cell>
        </Column>
      ))}
      {actions && (
        <Column width={150} fixed="right">
          <HeaderCell>Ações</HeaderCell>
          <Cell>{actions}</Cell>
        </Column>
      )}
    </Table>
  );
};

export default TableComponent;
