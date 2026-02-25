"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { db, type Class } from "@/lib/local-storage"

interface ClassFormProps {
  initial?: Class
  onSubmit: (values: Omit<Class, "id" | "created_at" | "updated_at">) => void
  onCancel: () => void
}

export default function ClassForm({ initial, onSubmit, onCancel }: ClassFormProps) {
  const [form, setForm] = useState({
    name: "",
    teacher_id: "",
    room_number: "",
    capacity: "",
    subject_ids: [] as string[],
  })

  const teachers = db.teachers.getAll()
  const subjects = db.subjects.getAll()

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || "",
        teacher_id: initial.teacher_id || "",
        room_number: initial.room_number || "",
        capacity: initial.capacity?.toString() || "",
        subject_ids: initial.subject_ids || [],
      })
    } else {
      setForm({
        name: "",
        teacher_id: "",
        room_number: "",
        capacity: "",
        subject_ids: [],
      })
    }
  }, [initial])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name: form.name,
      teacher_id: form.teacher_id || null,
      room_number: form.room_number || null,
      capacity: form.capacity ? Number.parseInt(form.capacity) : null,
      subject_ids: form.subject_ids,
    })
  }

  const toggleSubject = (subjectId: string) => {
    setForm((prev) => ({
      ...prev,
      subject_ids: prev.subject_ids.includes(subjectId)
        ? prev.subject_ids.filter((id) => id !== subjectId)
        : [...prev.subject_ids, subjectId],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="name">Class Name *</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            placeholder="e.g., Grade 10-A"
          />
        </div>
        <div>
          <Label htmlFor="teacher_id">Class Teacher</Label>
          <Select value={form.teacher_id} onValueChange={(value) => setForm({ ...form, teacher_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select a teacher" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.full_name}
                </SelectItem>
              ))}
              {teachers.length === 0 && (
                <div className="px-2 py-1 text-sm text-muted-foreground">No teachers available</div>
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="room_number">Room Number</Label>
          <Input
            id="room_number"
            value={form.room_number}
            onChange={(e) => setForm({ ...form, room_number: e.target.value })}
            placeholder="e.g., Room 101"
          />
        </div>
        <div>
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            type="number"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            placeholder="Maximum students"
            min="1"
          />
        </div>
        <div className="md:col-span-2">
          <Label>Subjects</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 p-3 border rounded-md bg-gray-50">
            {subjects.map((subject) => (
              <div key={subject.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`subject-${subject.id}`}
                  checked={form.subject_ids.includes(subject.id)}
                  onCheckedChange={() => toggleSubject(subject.id)}
                />
                <Label htmlFor={`subject-${subject.id}`} className="text-sm font-normal">
                  {subject.name}
                </Label>
              </div>
            ))}
            {subjects.length === 0 && (
              <div className="col-span-full text-sm text-muted-foreground">No subjects available</div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
          {initial ? "Update Class" : "Add Class"}
        </Button>
      </div>
    </form>
  )
}
