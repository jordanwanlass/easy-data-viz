enum DataType {
  TEXT = "Text",
  NUMBER = "Number",
  BOOLEAN = "Boolean",
  DATE = "Date",
}

enum OperationType {
  ADD = "Add",
  SUBTRACT = "Subtract",
  MULTIPLY = "Multiply",
  DIVIDE = "Divide",
  CONCATENATE = "Concatenate",
  NEGATE = "Negate",
  ABSOLUTE = "Absolute",
  CUSTOM = "Custom",
}

type RowData = {
  [key: string]: string;
};

type ColumnData = {
  name: string;
  dataType: DataType;
};

type DataSetState = {
  data: RowData[];
  columns: ColumnData[];
  fileName: string | null;
  isLoading: boolean;
  error: string | null;
};

export { DataType, OperationType, RowData, ColumnData, DataSetState };
