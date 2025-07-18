// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
import { ColumnData,  RowData, DataSet } from './types/data-types';



contextBridge.exposeInMainWorld('dbAPI', {
  // ... (existing saveDataSet and loadDataSet functions)

  /**
   * Creates a new table in the database from the provided dataset.
   * @param {{ tableName: string, columnData: ColumnData[], data: RowData[] }} dataSet
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  createTableFromData: (dataSet: DataSet) => ipcRenderer.invoke('db:createTable', dataSet),
});