import { HashRouter, Routes, Route, Link } from "react-router-dom";
import CreateDataSet from "./components/createDataSet";
import AnalyzeDataSet from "./components/analyzeDataSet";
import { SquareStack, Upload, ChartColumnBig, List } from "lucide-react";
import DataSets from "./components/dataSets";

const links = [
  {
    name: "Create Data Set",
    to: "/createDataset",
    icon: <Upload className="h-4 w-4" />,
  },
  {
    name: "Analyze Data Set",
    to: "/analyzeDataSet",
    icon: <ChartColumnBig className="h-4 w-4" />,
  },
  {
    name: "Data Sets",
    to: "/dataSets",
    icon: <List className="h-4 w-4" />,
  },
];

export default function Page() {
  return (
    <div
      className="grid grid-cols-4 px-4 py-4 m-0"
      style={{ minHeight: "100vh" }}
    >
      <HashRouter>
        <div className="flex flex-col mr-4">
          <div className="mb-10 flex items-center gap-2 px-1 italic font-semibold">
            <SquareStack className="h-4 w-4" />
            Easy Data Viz
          </div>

          {links.map((link) => {
            return (
              <Link
                className="flex h-12 items-center gap-2 rounded-sm px-1 py-0.5 hover:bg-gray-300"
                to={link.to}
                key={link.to}
              >
                <div>{link.icon} </div>
                <div>{link.name}</div>
              </Link>
            );
          })}
        </div>
        <div className="col-span-3 border rounded-2xl shadow-xl/20 overflow-scroll" style={{ maxHeight: "95vh" }}>
          <Routes>
            <Route path="/" element={<CreateDataSet />} />
            <Route path="/createDataSet" element={<CreateDataSet />} />
            <Route path="/analyzeDataSet" element={<AnalyzeDataSet />} />
            <Route path="/dataSets" element={<DataSets />} />
          </Routes>
        </div>
      </HashRouter>
    </div>
  );
}
