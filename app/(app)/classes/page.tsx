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
import ClassForm from "@/components/classes/class-form"

export default function ClassesPage() {
  const classes = db.classes.getAll()
  const teachers = db.teachers.getAll()
  const subjects = db.subjects.getAll()

  const [q, setQ] = useState("")
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState<any | null>(null)

  const filtered = useMemo(() => classes.filter((c: any) => c.name.toLowerCase().includes(q.toLowerCase())), [classes, q])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold">Classes</h1>
        <Button
          className="bg-teal-600 hover:bg-teal-700 text-white"
          onClick={() => {
            setEdit(null)
            setOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Class
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">All Classes ({classes.length})</CardTitle>
          <Input placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => {
                  const teacher = c.teacher_id ? teachers.find((t) => t.id === c.teacher_id) : undefined
                  const classSubjects =
                    c.subject_ids
                      ?.map((id) => subjects.find((s) => s.id === id)?.name)
                      .filter(Boolean)
                      .join(", ") || "-"
                  return (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{teacher?.full_name || "-"}</TableCell>
                      <TableCell>{c.room_number || "-"}</TableCell>
                      <TableCell>{c.capacity || "-"}</TableCell>
                      <TableCell className="max-w-xs truncate">{classSubjects}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setEdit(c)
                              setOpen(true)
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <ConfirmDelete
                            title="Delete class"
                            description="This will permanently remove the class."
                            onConfirm={() => {
                              db.classes.delete(c.id)
                              toast({ title: "Deleted", description: "Class removed successfully." })
                            }}
                          >
                            <Button variant="destructive" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </ConfirmDelete>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No classes found.
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
            <DialogTitle>{edit ? "Edit Class" : "Add Class"}</DialogTitle>
          </DialogHeader>
          <ClassForm
            initial={edit ?? undefined}
            onCancel={() => setOpen(false)}
            onSubmit={(values) => {
              if (edit) {
                const res = db.classes.update(edit.id, values)
                if (res) toast({ title: "Updated", description: "Class updated successfully." })
              } else {
                db.classes.insert(values)
                toast({ title: "Created", description: "Class added successfully." })
              }
              setOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
