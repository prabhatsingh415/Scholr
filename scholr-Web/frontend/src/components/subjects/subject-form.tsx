"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
type SubjectFormValues = {
    name: string;
    description?: string;
};
export default function SubjectForm({ initial, onSubmit, onCancel, }: {
    initial?: Partial<SubjectFormValues>;
    onSubmit: (values: SubjectFormValues) => void;
    onCancel: () => void;
}) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    useEffect(() => {
        if (initial) {
            setName(initial.name || "");
            setDescription(initial.description || "");
        }
    }, [initial]);
    return (<form className="space-y-3" onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ name, description: description || undefined });
        }}>
      <div>
        <label className="text-sm text-muted-foreground">Subject name</label>
        <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Mathematics"/>
      </div>
      <div>
        <label className="text-sm text-muted-foreground">Description (optional)</label>
        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description"/>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>);
}
