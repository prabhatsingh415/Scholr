"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { auth, db } from "@/lib/local-storage";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import ConfirmDelete from "@/components/common/confirm-delete";
import GradeForm from "@/components/grades/grade-form";
export default function GradesPage() {
    const user = auth.getUser();
    const canManage = user?.role !== "student";
    const [rows, setRows] = useState(() => db.grades.getAll());
    const students = db.students.getAll();
    const subjects = db.subjects.getAll();
    const teachers = db.teachers.getAll();
    const [q, setQ] = useState("");
    const [open, setOpen] = useState(false);
    const filtered = useMemo(() => {
        return rows.filter((g) => {
            const s = students.find((x) => x.id === g.student_id);
            const sub = subjects.find((x) => x.id === g.subject_id);
            const t = teachers.find((x) => x.id === g.teacher_id);
            const v = `${s?.first_name || ""} ${s?.last_name || ""} ${sub?.name || ""} ${g.term || ""} ${g.exam_type || ""} ${t?.full_name || ""}`.toLowerCase();
            return v.includes(q.toLowerCase());
        });
    }, [rows, q, students, subjects, teachers]);
    const getGradeBadge = (score: number) => {
        if (score >= 90)
            return <Badge className="bg-green-100 text-green-800">A</Badge>;
        if (score >= 80)
            return <Badge className="bg-blue-100 text-blue-800">B</Badge>;
        if (score >= 70)
            return <Badge className="bg-yellow-100 text-yellow-800">C</Badge>;
        if (score >= 60)
            return <Badge className="bg-orange-100 text-orange-800">D</Badge>;
        return <Badge className="bg-red-100 text-red-800">F</Badge>;
    };
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold">Exams</h1>
        {canManage && (<Button className="bg-emerald-500 hover:bg-emerald-600" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2"/> Add Exam
          </Button>)}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">All Exams ({rows.length})</CardTitle>
          <Input placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs"/>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exam</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Teacher</TableHead>
                  {canManage && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((g) => {
            const s = students.find((x) => x.id === g.student_id);
            const sub = subjects.find((x) => x.id === g.subject_id);
            const t = teachers.find((x) => x.id === g.teacher_id);
            return (<TableRow key={g.id}>
                      <TableCell>{g.exam_type || "-"}</TableCell>
                      <TableCell>{s ? `${s.first_name} ${s.last_name}` : "-"}</TableCell>
                      <TableCell>{sub?.name || "-"}</TableCell>
                      <TableCell className="font-medium">{typeof g.score === "number" ? `${g.score}%` : "-"}</TableCell>
                      <TableCell>{typeof g.score === "number" ? getGradeBadge(g.score) : "-"}</TableCell>
                      <TableCell>{g.term || "-"}</TableCell>
                      <TableCell>{t?.full_name || "-"}</TableCell>
                      {canManage && (<TableCell className="text-right">
                          <ConfirmDelete title="Delete exam" description="This will permanently remove the exam record." onConfirm={() => {
                        const updated = rows.filter((r) => r.id !== g.id);
                        localStorage.setItem("grades", JSON.stringify(updated));
                        setRows(updated);
                        toast({ title: "Deleted", description: "Exam removed successfully." });
                    }}>
                            <Button variant="destructive" size="icon">
                              <Trash2 className="h-4 w-4"/>
                            </Button>
                          </ConfirmDelete>
                        </TableCell>)}
                    </TableRow>);
        })}
                {filtered.length === 0 && (<TableRow>
                    <TableCell colSpan={canManage ? 8 : 7} className="text-center text-gray-500">
                      No exams found.
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {canManage && (<Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Exam</DialogTitle>
            </DialogHeader>
            <GradeForm onSubmit={(values) => {
                const newItem = db.grades.insert(values);
                setRows((prev) => [...prev, newItem]);
                toast({ title: "Success", description: "Exam added successfully." });
                setOpen(false);
            }} onCancel={() => setOpen(false)}/>
          </DialogContent>
        </Dialog>)}
    </div>);
}
