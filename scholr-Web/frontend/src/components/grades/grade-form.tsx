"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/local-storage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
type GradeInput = {
    student_id: string;
    subject_id: string;
    score: number;
    term: string;
    date?: string;
    teacher_id?: string;
    exam_type?: string;
};
export default function GradeForm({ onSubmit, onCancel, }: {
    onSubmit: (values: GradeInput) => void;
    onCancel?: () => void;
}) {
    const students = db.students.getAll();
    const subjects = db.subjects.getAll();
    const teachers = db.teachers.getAll();
    const [student_id, setStudentId] = useState<string>(students[0]?.id || "");
    const [subject_id, setSubjectId] = useState<string>(subjects[0]?.id || "");
    const [score, setScore] = useState<number>(85);
    const [term, setTerm] = useState<string>("Term 1");
    const [teacher_id, setTeacherId] = useState<string>(teachers[0]?.id || "");
    const [exam_type, setExamType] = useState<string>("Midterm");
    useEffect(() => {
        if (!student_id && students[0])
            setStudentId(students[0].id);
        if (!subject_id && subjects[0])
            setSubjectId(subjects[0].id);
        if (!teacher_id && teachers[0])
            setTeacherId(teachers[0].id);
    }, [students, subjects, teachers, student_id, subject_id, teacher_id]);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!student_id || !subject_id)
            return;
        onSubmit({
            student_id,
            subject_id,
            score,
            term,
            teacher_id,
            exam_type,
            date: new Date().toISOString().split("T")[0],
        });
    };
    return (<form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Student</label>
          <Select value={student_id} onValueChange={setStudentId}>
            <SelectTrigger>
              <SelectValue placeholder="Select student"/>
            </SelectTrigger>
            <SelectContent>
              {students.map((s) => (<SelectItem key={s.id} value={s.id}>
                  {s.first_name} {s.last_name}
                </SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Subject</label>
          <Select value={subject_id} onValueChange={setSubjectId}>
            <SelectTrigger>
              <SelectValue placeholder="Select subject"/>
            </SelectTrigger>
            <SelectContent>
              {subjects.map((s) => (<SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Exam Type</label>
          <Select value={exam_type} onValueChange={setExamType}>
            <SelectTrigger>
              <SelectValue placeholder="Select exam type"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Midterm">Midterm</SelectItem>
              <SelectItem value="Final">Final</SelectItem>
              <SelectItem value="Unit Test">Unit Test</SelectItem>
              <SelectItem value="Quiz">Quiz</SelectItem>
              <SelectItem value="Practical">Practical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Teacher (Examiner)</label>
          <Select value={teacher_id} onValueChange={setTeacherId}>
            <SelectTrigger>
              <SelectValue placeholder="Select teacher"/>
            </SelectTrigger>
            <SelectContent>
              {teachers.map((t) => (<SelectItem key={t.id} value={t.id}>
                  {t.full_name}
                </SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Score (%)</label>
          <Input type="number" min={0} max={100} value={score} onChange={(e) => setScore(Number(e.target.value))} placeholder="Enter score (0-100)"/>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Term</label>
          <Select value={term} onValueChange={setTerm}>
            <SelectTrigger>
              <SelectValue placeholder="Select term"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Term 1">Term 1</SelectItem>
              <SelectItem value="Term 2">Term 2</SelectItem>
              <SelectItem value="Term 3">Term 3</SelectItem>
              <SelectItem value="Final">Final</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4">
        <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
          Save Exam
        </Button>
        {onCancel && (<Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>)}
      </div>
    </form>);
}
