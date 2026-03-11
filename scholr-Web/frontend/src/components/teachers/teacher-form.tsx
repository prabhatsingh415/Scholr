"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Teacher } from "@/lib/local-storage";
interface TeacherFormProps {
    initial?: Teacher;
    onSubmit: (values: Omit<Teacher, "id" | "created_at" | "updated_at">) => void;
    onCancel: () => void;
}
export default function TeacherForm({ initial, onSubmit, onCancel }: TeacherFormProps) {
    const [form, setForm] = useState({
        full_name: "",
        email: "",
        phone: "",
        subject_specialization: "",
        hire_date: "",
    });
    useEffect(() => {
        if (initial) {
            setForm({
                full_name: initial.full_name || "",
                email: initial.email || "",
                phone: initial.phone || "",
                subject_specialization: initial.subject_specialization || "",
                hire_date: initial.hire_date || "",
            });
        }
        else {
            setForm({
                full_name: "",
                email: "",
                phone: "",
                subject_specialization: "",
                hire_date: "",
            });
        }
    }, [initial]);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };
    return (<form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="full_name">Full Name *</Label>
          <Input id="full_name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required placeholder="Enter full name"/>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="teacher@school.com"/>
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone number"/>
        </div>
        <div>
          <Label htmlFor="subject_specialization">Subject Specialization</Label>
          <Input id="subject_specialization" value={form.subject_specialization} onChange={(e) => setForm({ ...form, subject_specialization: e.target.value })} placeholder="e.g., Mathematics, Science"/>
        </div>
        <div>
          <Label htmlFor="hire_date">Hire Date</Label>
          <Input id="hire_date" type="date" value={form.hire_date} onChange={(e) => setForm({ ...form, hire_date: e.target.value })}/>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
          {initial ? "Update Teacher" : "Add Teacher"}
        </Button>
      </div>
    </form>);
}
