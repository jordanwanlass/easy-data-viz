enum DataType {
  Text = "Text",
  Number = "Number",
  Boolean = "Boolean",
  Date = "Date",
  Dollar = "Dollar"
}

export enum DisplayFormat {
  None = 'None',
  CurrencyUSD = 'Currency (USD)',
  Percentage = 'Percentage',
}

enum OperationType {
  Add = "Add",
  Subtract = "Subtract",
  Multiply = "Multiply",
  Divide = "Divide",
  Combine = "Combine",
  Negate = "Negate",
  Absolute = "Absolute",
  Custom = "Custom",
}

type RowData = {
  [key: string]: string;
};

type ColumnData = {
  name: string;
  dataType: DataType;
  format: DisplayFormat;
};

type DataSetState = {
  data: RowData[];
  columnData: ColumnData[];
  fileName: string | null;
  isLoading: boolean;
  error: string | null;
};

interface DataSet {
  tableName: string,
  columnData: ColumnData[],
  data: RowData[]
}

export { DataType, OperationType, RowData, ColumnData, DataSetState, DataSet };
