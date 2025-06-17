import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

import NewDataFieldForm from "./newDataFieldForm";

export default function AddDataDialog() {

  return (
    <Dialog>
      <Button asChild>
        <DialogTrigger className="flex">
          <Plus className="h-4 w-4" />
          Add Data
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Data</DialogTitle>
          <DialogDescription>
            Choose 2 fields of the same type and how you want to combine them to
            create a new data field.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <NewDataFieldForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
