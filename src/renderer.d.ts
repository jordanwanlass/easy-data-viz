import {ColumnData, RowData } from "./types/data-types"

export interface IDatabaseAPI {
  // ... (existing saveDataSet and loadDataSet)
  createTableFromData: (dataSet: { tableName: string, columnData: ColumnData[], data: RowData[] }) => Promise<{ success: boolean, error?: string }>;
}

declare global {
  interface Window {
    dbAPI: IDatabaseAPI;
  }
}