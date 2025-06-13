import { useState } from "react";
import { Input } from "./ui/input";
import parse from "papaparse";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export default function CreateDataSet() {
  const [file, setFile] = useState<any>(null);
  const [dataSet, setDataSet] = useState<any[]>([]);

  const handFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputedFile = event.target.files?.[0];

    if (inputedFile) {
      console.log(inputedFile.webkitRelativePath);
      parse.parse(inputedFile, {
        step: function (result) {
          dataSet.push(result.data);
        },
        complete: function (results, file) {
          console.log("complete");
          setFile(file);
        },
      });
    } else {
      console.log("No file selected");
    }
  };

  return (
    <div className={`h-full grid ${file ? "py-4 px-4" : "items-center justify-center"}`}>
      {file ? (
        <div>
          <div>Row above that has options (add data)</div>
          <Table>
            <TableHeader>
              <TableRow>
                {dataSet[0].map((header: string, index: number) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataSet.slice(1).map((row, index) => (
                <TableRow>
                  {row.map((cell: any, cellIndex: number) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
