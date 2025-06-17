import { Input } from "./ui/input";
import parse from "papaparse";
import AddDataDialog from "./addDataDialog";
import DataSetTable from "./DataSetTable";
import { getColumns } from "../lib/helpers";

import { useDataSetStore } from "../store/store";

export default function CreateDataSet() {
  const { data, loadCsvData } = useDataSetStore(state => state)

  const handFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputedFile = event.target.files?.[0];

    if (inputedFile) {
      parse.parse(inputedFile, {
        header: true,
        complete: function (
          results: parse.ParseResult<Record<string, string>>,
          file: File
        ) {
          if (results.data.length > 0) {
            loadCsvData(file.name, results.data, getColumns(results.data[0], Object.keys(results.data[0])))
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
        data.length > 0  ? "py-4 px-4" : "items-center justify-center"
      }`}
    >
      {data.length > 0 ? (
        <div>
          <div className="flex mb-8 items-center">
            <AddDataDialog />
          </div>
          <DataSetTable />
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
