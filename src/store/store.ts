import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { RowData, DataSetState, ColumnData, DataType, DisplayFormat } from "../types/types";
import { inferDataTypeAndFormat, castValueToType } from "../lib/helpers";

interface DataSetStoreActions {
  loadCsvData: (fileName: string, parsedData: RowData[]) => void;
  addColumn: (
    newColumnData: ColumnData,
    valueMapper: (row: RowData, rowIndex: number) => any,
    sourceColumnsUsed?: string[],
  ) => void;
  deleteColumn: (columnName: string) => void;
  updateColumnType: (columnName: string, newType: DataType) => void;
  updateColumnFormat: (columnName: string, newFormat: DisplayFormat) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  resetStore: () => void;
}

const initialState: DataSetState = {
  data: [],
  columnData: [],
  fileName: null,
  isLoading: false,
  error: null,
};

export const useDataSetStore = create<DataSetState & DataSetStoreActions>()( // Renamed types here
  immer((set, get) => ({
    ...initialState,

    loadCsvData: (fileName, parsedData) => {
      const finalColumnData: ColumnData[] = [];
      if (parsedData.length > 0) {
        const sampleRow = parsedData[0];
        Object.keys(sampleRow).map(key => {
          const { dataType, format } = inferDataTypeAndFormat(sampleRow[key]);
          console.log("key: {}, type: {}, format: {}", key, dataType, format);
          finalColumnData.push({
            name: key,
            dataType: dataType,
            format: format,
          });
        })
      }

      set(state => {
        state.fileName = fileName;
        state.data = parsedData;
        state.columnData = finalColumnData;
        state.isLoading = false;
        state.error = null;
      });
    },

    addColumn: (newColumnData, valueMapper, sourceColumnsUsed) => {
      set(state => {
        const { name: columnName } = newColumnData;

        const existingColumnIndex = state.columnData.findIndex(
          data => data.name === columnName,
        );

        if (existingColumnIndex !== -1) {
          console.warn(`Column '${columnName}' already exists. Overwriting values and data.`);
          state.columnData[existingColumnIndex] = newColumnData;
        }

        const newData = state.data.map((row, index) => {
          const newColumnValue = valueMapper(row, index);
          return {
            ...row,
            [columnName]: castValueToType(newColumnValue, newColumnData.dataType),
          };
        });

        state.data = newData;
        if (existingColumnIndex === -1) {
          state.columnData.push(newColumnData);
        }
      });
    },

    deleteColumn: columnName => {
      set(state => {
        state.data = state.data.map(row => {
          const newRow = { ...row };
          delete newRow[columnName];
          return newRow;
        });
        state.columnData = state.columnData.filter(
          data => data.name !== columnName,
        );
      });
    },

    updateColumnType: (columnName, newDataType) => {
      set(state => {
        const columnDataItem = state.columnData.find(data => data.name === columnName);
        if (columnDataItem) {
          columnDataItem.dataType = newDataType;
          if (newDataType !== DataType.Number) {
             columnDataItem.format = DisplayFormat.None;
          }
        }
      });
    },

    updateColumnFormat: (columnName: string, newFormat: DisplayFormat) => {
        set(state => {
            const columnDataItem = state.columnData.find(data => data.name === columnName);
            if (columnDataItem) {
                columnDataItem.format = newFormat;
            }
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
