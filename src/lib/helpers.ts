import { ColumnData, DataType, RowData } from "../types/types";



const getColumns = (row: RowData, columnNames: string[]) : ColumnData[] => {
    const columns: ColumnData[] = [];

      columnNames.map(column => {
        const type = (isDollarAmount(row[column]) ? DataType.NUMBER : DataType.TEXT)
        columns.push({name: column, dataType: type})
      })

    return columns;
}

const isDollarAmount = (str: string): boolean => {
  return /^\$?\d{1,3}(,\d{3})*(\.\d{2})?$|^\$?\d+(\.\d{2})?$/.test(str);
};

  export {
    getColumns
  }