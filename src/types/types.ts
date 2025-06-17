enum DataType {
  TEXT = "text",
  NUMBER = "number"
}

enum OperationType {
  ADD = "Add",
  SUBTRACT = "Subtract",
  MULTIPLY = "Multiply",
  DIVIDE = "Divide",
  CONCATENATE = "Concatenate"
}

type RowData = {
    [key: string]: string; // Value types can be more specific based on your parsing
  };

type ColumnData = {
  name: string,
  dataType: DataType
}
  
 type DataSetState = {
    data: RowData[];
    columns: ColumnData[]; // To maintain order and display columns
    fileName: string | null;
    isLoading: boolean;
    error: string | null;
  };

export {
    DataType,
    OperationType,
    RowData,
    ColumnData,
    DataSetState
}