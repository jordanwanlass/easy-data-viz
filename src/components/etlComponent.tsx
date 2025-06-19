import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { ETLForm } from "./etlForm";
import { EtlFormValues } from "../schemas/etlFormSchema";

export default function ETLComponent() {
  const handleETLFormSubmit = async (formValues: EtlFormValues) => {};
  return (
    <div className="flex flex-col py-4 px-4">
      <div className="w-full">
        <ETLForm onSubmit={handleETLFormSubmit} />
      </div>
    </div>
  );
}
