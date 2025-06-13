import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function DataFieldSelect(props: {
  dataFields: string[];
  handleChange: (value: string) => void;
}) {
  const { dataFields, handleChange } = props;

  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger className="w-[135]">
        <SelectValue placeholder="Select a field" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {dataFields.map((dataField: string) => (
            <SelectItem key={`first-${dataField}`} value={dataField}>
              {dataField}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
