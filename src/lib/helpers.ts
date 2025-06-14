enum DataFieldType {
    TEXT = "text",
    NUMBER = "number"
}

enum OperationOption {
    ADD = "Add",
    SUBTRACT = "Subtract",
    MULTIPLY = "Multiply",
    DIVIDE = "Divide",
    COMBINE = "Combine"
}

const getDataFieldtypes = (dataSetMap: Map<string, string[]>) : Map<string, string> => {
    const typeMap = new Map<string, string>();

    for(let i = 0; i < 2; i++) {
        [...dataSetMap.keys()].map((header) => {
            typeMap.set(header, (isDollarAmount(dataSetMap.get(header)[i]) ? DataFieldType.NUMBER : DataFieldType.TEXT));
        })
    }

    return typeMap;
}

const isDollarAmount = (str: string): boolean => {
  return /^\$?\d{1,3}(,\d{3})*(\.\d{2})?$|^\$?\d+(\.\d{2})?$/.test(str);
};

  export {
    getDataFieldtypes,
    DataFieldType,
    OperationOption
  }