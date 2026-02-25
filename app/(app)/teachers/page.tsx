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
import TeacherForm from "@/components/teachers/teacher-form"

export default function TeachersPage() {
  const teachers = db.teachers.getAll()
  const subjects = db.subjects.getAll()

  const [q, setQ] = useState("")
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState<any | null>(null)

  const filtered = useMemo(() => {
    return teachers.filter((t) => {
      const v = `${t.full_name} ${t.email || ""} ${t.phone || ""}`.toLowerCase()
      return v.includes(q.toLowerCase())
    })
  }, [teachers, q])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold">Teachers</h1>
        <Button
          className="bg-teal-600 hover:bg-teal-700 text-white"
          onClick={() => {
            setEdit(null)
            setOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Teacher
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">All Teachers ({teachers.length})</CardTitle>
          <Input placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.full_name}</TableCell>
                    <TableCell>{t.email || "-"}</TableCell>
                    <TableCell>{t.phone || "-"}</TableCell>
                    <TableCell>
                      {/* Show random subjects for demo */}
                      {subjects
                        .slice(0, 2)
                        .map((s) => s.name)
                        .join(", ") || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setEdit(t)
                            setOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <ConfirmDelete
                          title="Delete teacher"
                          description="This will permanently remove the teacher."
                          onConfirm={() => {
                            db.teachers.delete(t.id)
                            toast({ title: "Deleted", description: "Teacher removed successfully." })
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
                      No teachers found.
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
            <DialogTitle>{edit ? "Edit Teacher" : "Add Teacher"}</DialogTitle>
          </DialogHeader>
          <TeacherForm
            initial={edit ?? undefined}
            onCancel={() => setOpen(false)}
            onSubmit={(values) => {
              if (edit) {
                const res = db.teachers.update(edit.id, values)
                if (res) toast({ title: "Updated", description: "Teacher updated successfully." })
              } else {
                db.teachers.insert(values)
                toast({ title: "Created", description: "Teacher added successfully." })
              }
              setOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
