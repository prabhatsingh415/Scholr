"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { auth, db } from "@/lib/local-storage";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Pencil, Plus, Trash2 } from "lucide-react";
import ConfirmDelete from "@/components/common/confirm-delete";
import StudentForm from "@/components/students/student-form";
export default function StudentsPage() {
    const students = db.students.getAll();
    const user = auth.getUser();
    const canManageStudents = user?.role === "admin";
    const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
    const branchOptions = ["CSE", "IT", "ECE", "EE", "ME", "CE"];
    const [q, setQ] = useState("");
    const [yearFilter, setYearFilter] = useState("all");
    const [branchFilter, setBranchFilter] = useState("all");
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState<any | null>(null);
    const filtered = useMemo(() => {
        return students.filter((s) => {
            const v = `${s.first_name} ${s.last_name} ${s.email || ""} ${s.parent_contact || ""} ${s.year || ""} ${s.branch || ""}`.toLowerCase();
            const matchesSearch = v.includes(q.toLowerCase());
            const matchesYear = yearFilter === "all" || (s.year || "") === yearFilter;
            const matchesBranch = branchFilter === "all" || (s.branch || "") === branchFilter;
            return matchesSearch && matchesYear && matchesBranch;
        });
    }, [students, q, yearFilter, branchFilter]);
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold">Students</h1>
        {canManageStudents && (<Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => {
                setEdit(null);
                setOpen(true);
            }}>
            <Plus className="h-4 w-4 mr-2"/> Add Student
          </Button>)}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">All Students ({students.length})</CardTitle>
          <div className="flex gap-2">
            <Input placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} className="w-56"/>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter Year"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {yearOptions.map((year) => (<SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>))}
              </SelectContent>
            </Select>
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter Branch"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branchOptions.map((branch) => (<SelectItem key={branch} value={branch}>
                    {branch}
                  </SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Parent Contact</TableHead>
                  {canManageStudents && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (<TableRow key={s.id}>
                    <TableCell>
                      {s.first_name} {s.last_name}
                    </TableCell>
                    <TableCell>{s.email || "-"}</TableCell>
                    <TableCell>{s.date_of_birth ? new Date(s.date_of_birth).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>{s.year || "-"}</TableCell>
                    <TableCell>{s.branch || "-"}</TableCell>
                    <TableCell>{s.parent_contact || "-"}</TableCell>
                    {canManageStudents && (<TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button variant="outline" size="icon" onClick={() => {
                    setEdit(s);
                    setOpen(true);
                }}>
                            <Pencil className="h-4 w-4"/>
                          </Button>
                          <ConfirmDelete title="Delete student" description="This will permanently remove the student." onConfirm={() => {
                    db.students.delete(s.id);
                    toast({ title: "Deleted", description: "Student removed successfully." });
                }}>
                            <Button variant="destructive" size="icon">
                              <Trash2 className="h-4 w-4"/>
                            </Button>
                          </ConfirmDelete>
                        </div>
                      </TableCell>)}
                  </TableRow>))}
                {filtered.length === 0 && (<TableRow>
                    <TableCell colSpan={canManageStudents ? 7 : 6} className="text-center text-muted-foreground">
                      No students found.
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {canManageStudents && (<Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{edit ? "Edit Student" : "Add Student"}</DialogTitle>
            </DialogHeader>
            <StudentForm initial={edit ?? undefined} onCancel={() => setOpen(false)} onSubmit={(values) => {
                if (edit) {
                    const res = db.students.update(edit.id, values);
                    if (res) {
                        toast({ title: "Updated", description: "Student updated successfully." });
                    }
                }
                else {
                    db.students.insert(values);
                    toast({ title: "Created", description: "Student added successfully." });
                }
                setOpen(false);
            }}/>
          </DialogContent>
        </Dialog>)}
    </div>);
}
