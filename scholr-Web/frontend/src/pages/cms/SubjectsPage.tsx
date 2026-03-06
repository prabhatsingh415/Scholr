"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/lib/local-storage";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Pencil, Plus, Trash2 } from "lucide-react";
import ConfirmDelete from "@/components/common/confirm-delete";
import SubjectForm from "@/components/subjects/subject-form";
export default function SubjectsPage() {
    const [subjects, setSubjects] = useState<any[]>(() => db.subjects.getAll());
    const [q, setQ] = useState("");
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState<any | null>(null);
    const filtered = useMemo(() => subjects.filter((s) => s.name.toLowerCase().includes(q.toLowerCase())), [subjects, q]);
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold">Subjects</h1>
        <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={() => {
            setEdit(null);
            setOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2"/> Add Subject
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">All Subjects ({subjects.length})</CardTitle>
          <Input placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs"/>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (<TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="text-gray-600">{s.description || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Button variant="outline" size="icon" onClick={() => {
                setEdit(s);
                setOpen(true);
            }}>
                          <Pencil className="h-4 w-4"/>
                        </Button>
                        <ConfirmDelete title="Delete subject" description="This will permanently remove the subject." onConfirm={() => {
                const ok = db.subjects.delete(s.id);
                if (ok) {
                    setSubjects((prev) => prev.filter((x) => x.id !== s.id));
                    toast({ title: "Deleted", description: "Subject removed successfully." });
                }
                else {
                    toast({ title: "Not found", description: "Could not delete the subject." });
                }
            }}>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4"/>
                          </Button>
                        </ConfirmDelete>
                      </div>
                    </TableCell>
                  </TableRow>))}
                {filtered.length === 0 && (<TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500">
                      No subjects found.
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={(val) => {
            setOpen(val);
            if (!val)
                setEdit(null);
        }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{edit ? "Edit Subject" : "Add Subject"}</DialogTitle>
          </DialogHeader>
          <SubjectForm initial={edit ?? undefined} onCancel={() => setOpen(false)} onSubmit={(values) => {
            if (edit) {
                const res = db.subjects.update(edit.id, values);
                if (res) {
                    setSubjects((prev) => prev.map((x) => (x.id === edit.id ? res : x)));
                    toast({ title: "Updated", description: "Subject updated successfully." });
                }
                else {
                    toast({ title: "Update failed", description: "Could not update the subject." });
                }
            }
            else {
                const created = db.subjects.insert(values);
                setSubjects((prev) => [created, ...prev]);
                toast({ title: "Created", description: "Subject added successfully." });
            }
            setOpen(false);
        }}/>
        </DialogContent>
      </Dialog>
    </div>);
}
