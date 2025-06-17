import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { RowData, DataSetState, ColumnData } from '../types/types';

interface DataSetStoreActions {
  loadCsvData: (fileName: string, parsedData: RowData[], columns: ColumnData[]) => void;
  addColumn: (
    columnName: string,
    column: ColumnData,
    operation: (row: RowData, rowIndex: number) => any,
    sourceColumns: string[], // e.g., for formulas like 'colA' + 'colB'
  ) => void;
  deleteColumn: (columnName: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  resetStore: () => void;
}

const initialState: DataSetState = {
  data: [],
  columns: [],
  fileName: null,
  isLoading: false,
  error: null,
};

export const useDataSetStore = create<DataSetState & DataSetStoreActions>()(
    immer((set, get) => ({
      ...initialState,
  
      loadCsvData: (fileName, parsedData, columns: ColumnData[]) => {
        // Assuming parsedData is an array of objects where keys are column names
        set(state => {
          state.fileName = fileName;
          state.data = parsedData;
          state.columns = columns;
          state.isLoading = false;
          state.error = null;
        });
      },
  
      addColumn: (columnName : string, column: ColumnData, operation, sourceColumns) => {
        set(state => {
          const columnNames = state.columns.map(column => column.name);
          if (columnNames.includes(columnName)) {
            console.warn(`Column '${columnName}' already exists. Overwriting.`);
            // You might want to throw an error or handle this differently
          }
  
          const newData = state.data.map((row : RowData, index: number) => {
            const newColumnValue = operation(row, index);
            return {
              ...row,
              [columnName]: newColumnValue,
            };
          });
  
          state.data = newData;
          // Only add if it's genuinely a new column
          // if (!columnNames.includes(columnName)) {
          //   state.columns.push(columnName);
          // }
        });
      },
  
      deleteColumn: columnName => {
        set((state : DataSetState) => {
          state.data = state.data.map((row: RowData) => {
            const newRow = { ...row };
            delete newRow[columnName];
            return newRow;
          });
          state.columns = state.columns.filter(column => column.name !== columnName)
        });
      },
  
      setLoading: isLoading => {
        set(state => {
          state.isLoading = isLoading;
        });
      },
  
      setError: error => {
        set(state => {
          state.error = error;
        });
      },
  
      resetStore: () => {
        set(initialState);
      },
    })),
  );