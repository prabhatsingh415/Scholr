"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { db } from "@/lib/local-storage"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { Pencil, Plus, Trash2 } from "lucide-react"
import ConfirmDelete from "@/components/common/confirm-delete"
import StudentForm from "@/components/students/student-form"

export default function StudentsPage() {
  const students = db.students.getAll()

  const [q, setQ] = useState("")
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState<any | null>(null)

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const v = `${s.first_name} ${s.last_name} ${s.email || ""} ${s.parent_contact || ""}`.toLowerCase()
      return v.includes(q.toLowerCase())
    })
  }, [students, q])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold">Students</h1>
        <Button
          className="bg-teal-600 hover:bg-teal-700 text-white"
          onClick={() => {
            setEdit(null)
            setOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Student
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">All Students ({students.length})</CardTitle>
          <Input placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Parent Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      {s.first_name} {s.last_name}
                    </TableCell>
                    <TableCell>{s.email || "-"}</TableCell>
                    <TableCell>{s.date_of_birth ? new Date(s.date_of_birth).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>{s.parent_contact || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setEdit(s)
                            setOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <ConfirmDelete
                          title="Delete student"
                          description="This will permanently remove the student."
                          onConfirm={() => {
                            db.students.delete(s.id)
                            toast({ title: "Deleted", description: "Student removed successfully." })
                          }}
                        >
                          <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </ConfirmDelete>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No students found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{edit ? "Edit Student" : "Add Student"}</DialogTitle>
          </DialogHeader>
          <StudentForm
            initial={edit ?? undefined}
            onCancel={() => setOpen(false)}
            onSubmit={(values) => {
              if (edit) {
                const res = db.students.update(edit.id, values)
                if (res) {
                  toast({ title: "Updated", description: "Student updated successfully." })
                }
              } else {
                db.students.insert(values)
                toast({ title: "Created", description: "Student added successfully." })
              }
              setOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
