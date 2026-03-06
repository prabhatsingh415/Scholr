"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Student } from "@/lib/local-storage";
interface StudentFormProps {
    initial?: Student;
    onSubmit: (values: Omit<Student, "id" | "created_at" | "updated_at">) => void;
    onCancel: () => void;
}
export default function StudentForm({ initial, onSubmit, onCancel }: StudentFormProps) {
    const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
    const branchOptions = ["CSE", "IT", "ECE", "EE", "ME", "CE"];
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        date_of_birth: "",
        gender: "",
        year: "",
        branch: "",
        parent_contact: "",
        address: "",
    });
    useEffect(() => {
        if (initial) {
            setForm({
                first_name: initial.first_name || "",
                last_name: initial.last_name || "",
                email: initial.email || "",
                date_of_birth: initial.date_of_birth || "",
                gender: initial.gender || "",
                year: initial.year || "",
                branch: initial.branch || "",
                parent_contact: initial.parent_contact || "",
                address: initial.address || "",
            });
        }
        else {
            setForm({
                first_name: "",
                last_name: "",
                email: "",
                date_of_birth: "",
                gender: "",
                year: "",
                branch: "",
                parent_contact: "",
                address: "",
            });
        }
    }, [initial]);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };
    return (<form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">First Name *</Label>
          <Input id="first_name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} required/>
        </div>
        <div>
          <Label htmlFor="last_name">Last Name *</Label>
          <Input id="last_name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} required/>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}/>
        </div>
        <div>
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input id="date_of_birth" type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}/>
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Input id="gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} placeholder="Male/Female/Other"/>
        </div>
        <div>
          <Label htmlFor="year">Year</Label>
          <Select value={form.year} onValueChange={(value) => setForm({ ...form, year: value })}>
            <SelectTrigger id="year">
              <SelectValue placeholder="Select Year"/>
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((year) => (<SelectItem key={year} value={year}>
                  {year}
                </SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="branch">Branch</Label>
          <Select value={form.branch} onValueChange={(value) => setForm({ ...form, branch: value })}>
            <SelectTrigger id="branch">
              <SelectValue placeholder="Select Branch"/>
            </SelectTrigger>
            <SelectContent>
              {branchOptions.map((branch) => (<SelectItem key={branch} value={branch}>
                  {branch}
                </SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="parent_contact">Parent Contact</Label>
          <Input id="parent_contact" value={form.parent_contact} onChange={(e) => setForm({ ...form, parent_contact: e.target.value })} placeholder="Phone number"/>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Full address"/>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
          {initial ? "Update Student" : "Add Student"}
        </Button>
      </div>
    </form>);
}
