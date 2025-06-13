import { useState } from "react";
import { Input } from "./ui/input";
import parse from "papaparse";
import AddDataDialog from "./addDataDialog";
import DataSetTable from "./DataSetTable";
import { getDataFieldtypes } from "../lib/helpers";

export default function CreateDataSet() {
  const [file, setFile] = useState<File | null>(null);
  const [dataSetMap, setDataSetMap] = useState<
    Map<string, string[]>
  >(new Map<string, string[]>());
  const [dataFieldTypes, setDataFieldTypes] = useState<Map<string, string>>(new Map<string, string>())

  const handFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputedFile = event.target.files?.[0];

    if (inputedFile) {
      parse.parse(inputedFile, {
        header: true,
        complete: function (
          results: parse.ParseResult<Record<string, string>>
        ) {
          if (results.data.length > 0) {
            const headers = Object.keys(results.data[0]);
            const newDataSetMap = new Map<string, string[]>();

            headers.forEach((header) => {
              newDataSetMap.set(
                header,
                results.data.map((row) => row[header] || "")
              );
            });
            setDataFieldTypes(getDataFieldtypes(newDataSetMap));
            setDataSetMap(newDataSetMap);
            setFile(inputedFile);
          }
        },
      });
    } else {
      console.log("No file selected");
    }
  };

  return (
    <div
      className={`h-full grid ${
        file ? "py-4 px-4" : "items-center justify-center"
      }`}
    >
      {file ? (
        <div>
          <div className="flex mb-8 items-center">
            <AddDataDialog dataFieldTypes={dataFieldTypes}/>
          </div>
          <DataSetTable dataSetMap={dataSetMap}/>
        </div>
      ) : (
        <div className="grid w-full max-w-sm items-center gap-3">
          <div>Upload your file to begin defining your data set.</div>
          <Input
            id="dataSet"
            type="file"
            accept=".csv, .xlsx, .tsv"
            onChange={handFileChange}
          />
        </div>
      )}
    </div>
  );
}
