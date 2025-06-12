import { useState } from "react";
import { Input } from "./ui/input";

export default function CreateDataSet() {
  const [file, setFile] = useState<any>(null);

  const handFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setFile(file);
    } else {
      console.log("No file selected");
    }
  };

  return (
    <div className="h-full grid items-center justify-center">
      {file ? (
        <>{file.name}</>
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
