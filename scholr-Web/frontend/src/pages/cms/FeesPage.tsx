"use client";
import type React from "react";
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { auth, getStudents, getFees, db } from "@/lib/local-storage";
import { toast } from "@/hooks/use-toast";
import { CreditCard, Plus, DollarSign, AlertCircle, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
interface FeeRecord {
    id: string;
    student_id: string;
    amount: number;
    type?: string;
    due_date: string;
    paid_date?: string;
    status: "pending" | "paid" | "overdue";
    description?: string;
}
const FEE_TYPES = ["Tuition Fee", "Library Fee", "Lab Fee", "Sports Fee", "Transport Fee", "Examination Fee", "Other"];
const formatCurrency = (value: unknown) => {
    const num = typeof value === "number" && Number.isFinite(value) ? value : Number.parseFloat(String(value ?? "0"));
    return Number.isFinite(num) ? num.toLocaleString() : "0";
};
const formatDate = (isoLike: unknown) => {
    if (!isoLike)
        return "-";
    const d = new Date(String(isoLike));
    return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
};
export default function FeesPage() {
    const user = auth.getUser();
    const canManage = user?.role !== "student";
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null);
    const [formData, setFormData] = useState({
        studentId: "",
        amount: "",
        type: "",
        dueDate: "",
        description: "",
    });
    const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "pending" | "overdue">("all");
    const [sortKey, setSortKey] = useState<"due_date" | "amount" | "student">("due_date");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const students = getStudents();
    const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
    const withComputedStatus = (r: FeeRecord): FeeRecord => {
        if (r.status === "paid")
            return r;
        const due = new Date(r.due_date);
        const today = new Date();
        return { ...r, status: due < today ? "overdue" : "pending" };
    };
    useEffect(() => {
        const loaded = getFees().map(withComputedStatus);
        setFeeRecords(loaded);
    }, []);
    const filteredRecords = useMemo(() => {
        return feeRecords.filter((record) => {
            const student = students.find((s) => s.id === record.student_id);
            const studentName = student ? `${student.first_name} ${student.last_name}` : "";
            const feeLabel = record.type || record.description || "";
            const matchesQuery = studentName.toLowerCase().includes(query.toLowerCase()) || feeLabel.toLowerCase().includes(query.toLowerCase());
            const matchesStatus = statusFilter === "all" ? true : record.status === statusFilter;
            return matchesQuery && matchesStatus;
        });
    }, [feeRecords, query, students, statusFilter]);
    const sortedRecords = useMemo(() => {
        const arr = [...filteredRecords];
        arr.sort((a, b) => {
            if (sortKey === "amount") {
                const aVal = Number(a.amount) || 0;
                const bVal = Number(b.amount) || 0;
                return sortDir === "asc" ? aVal - bVal : bVal - aVal;
            }
            if (sortKey === "due_date") {
                const aTime = new Date(a.due_date).getTime() || 0;
                const bTime = new Date(b.due_date).getTime() || 0;
                return sortDir === "asc" ? aTime - bTime : bTime - aTime;
            }
            const aName = (() => {
                const s = students.find((x) => x.id === a.student_id);
                return s ? `${s.first_name} ${s.last_name}` : "";
            })();
            const bName = (() => {
                const s = students.find((x) => x.id === b.student_id);
                return s ? `${s.first_name} ${s.last_name}` : "";
            })();
            return sortDir === "asc" ? aName.localeCompare(bName) : bName.localeCompare(aName);
        });
        return arr;
    }, [filteredRecords, sortKey, sortDir, students]);
    const totalPages = Math.max(1, Math.ceil(sortedRecords.length / pageSize));
    const paginatedRecords = useMemo(() => {
        const start = (page - 1) * pageSize;
        return sortedRecords.slice(start, start + pageSize);
    }, [sortedRecords, page]);
    useEffect(() => {
        setPage(1);
    }, [query, statusFilter, sortKey, sortDir]);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.studentId || !formData.type || !formData.dueDate || !formData.amount) {
            toast({ title: "Missing fields", description: "Please fill all required fields.", variant: "destructive" });
            return;
        }
        const parsedAmount = Number.parseFloat(formData.amount);
        if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
            toast({ title: "Invalid amount", description: "Amount must be a positive number.", variant: "destructive" });
            return;
        }
        const toInsert = {
            student_id: formData.studentId,
            amount: parsedAmount,
            type: formData.type,
            due_date: formData.dueDate,
            status: "pending" as const,
            description: formData.description,
        };
        const created = db.fees.insert(toInsert);
        setFeeRecords((prev) => [...prev, withComputedStatus(created as FeeRecord)]);
        toast({ title: "Success", description: "Fee record created successfully." });
        setOpen(false);
        setFormData({
            studentId: "",
            amount: "",
            type: "",
            dueDate: "",
            description: "",
        });
    };
    const handlePayment = () => {
        if (!selectedFee)
            return;
        const updated = db.fees.update(selectedFee.id, {
            status: "paid",
            paid_date: new Date().toISOString().split("T")[0],
        }) as FeeRecord | null;
        if (updated) {
            setFeeRecords((prev) => prev.map((r) => (r.id === updated.id ? withComputedStatus(updated) : r)));
            toast({ title: "Payment Recorded", description: "Fee payment has been recorded successfully." });
        }
        else {
            toast({ title: "Not found", description: "The selected fee could not be updated.", variant: "destructive" });
        }
        setPaymentOpen(false);
        setSelectedFee(null);
    };
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="h-8 w-8 text-teal-600"/>
            Fee Management
          </h1>
          <p className="text-gray-600">Track and manage student fee payments</p>
        </div>
        {canManage && (<Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2"/>
            Add Fee Record
          </Button>)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              ${formatCurrency(feeRecords.reduce((sum, record) => sum + (Number(record.amount) || 0), 0))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              $
              {formatCurrency(feeRecords
            .filter((record) => record.status === "pending")
            .reduce((sum, record) => sum + (Number(record.amount) || 0), 0))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Overdue Records</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {feeRecords.filter((record) => record.status === "overdue").length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Records</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{sortedRecords.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="text-xl font-semibold text-gray-900">Fee Records</h2>
          <Input placeholder="Search by student or fee type..." value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-xs"/>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Label className="text-gray-600">Status</Label>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All statuses"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-gray-600">Sort by</Label>
            <Select value={sortKey} onValueChange={(v) => setSortKey(v as any)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="due_date">Due date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
            <Button type="button" variant="outline" size="icon" onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))} aria-label="Toggle sort direction">
              <ArrowUpDown className="h-4 w-4"/>
            </Button>
          </div>

          <div className="ml-auto text-sm text-gray-600">
            {sortedRecords.length} result{sortedRecords.length !== 1 ? "s" : ""} • Page {page} of {totalPages}
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Fee Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                {canManage && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRecords.map((record) => {
            const student = students.find((s) => s.id === record.student_id);
            return (<TableRow key={record.id}>
                    <TableCell>{student ? `${student.first_name} ${student.last_name}` : "Unknown Student"}</TableCell>
                    <TableCell>{record.type || record.description || "Fee"}</TableCell>
                    <TableCell>${formatCurrency(record.amount)}</TableCell>
                    <TableCell>{formatDate(record.due_date)}</TableCell>
                    <TableCell>
                      <Badge variant={record.status === "paid"
                    ? "default"
                    : record.status === "overdue"
                        ? "destructive"
                        : "secondary"}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    {canManage && (<TableCell>
                        {record.status !== "paid" && (<Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => {
                            setSelectedFee(record);
                            setPaymentOpen(true);
                        }}>
                            Record Payment
                          </Button>)}
                      </TableCell>)}
                  </TableRow>);
        })}
              {paginatedRecords.length === 0 && (<TableRow>
                  <TableCell colSpan={canManage ? 6 : 5} className="text-center text-gray-500">
                    No fee records found.
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, sortedRecords.length)} of{" "}
            {sortedRecords.length}
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4 mr-1"/>
              Previous
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              Next
              <ChevronRight className="h-4 w-4 ml-1"/>
            </Button>
          </div>
        </div>
      </div>

      {canManage && (<Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Fee Record</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Student</Label>
              <Select value={formData.studentId} onValueChange={(value) => setFormData({ ...formData, studentId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student"/>
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (<SelectItem key={student.id} value={student.id}>
                      {student.first_name} {student.last_name}
                    </SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fee Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type"/>
                  </SelectTrigger>
                  <SelectContent>
                    {FEE_TYPES.map((type) => (<SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Amount ($)</Label>
                <Input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="0.00" step="0.01"/>
              </div>
            </div>

            <div>
              <Label>Due Date</Label>
              <Input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}/>
            </div>

            <div>
              <Label>Description</Label>
              <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Additional details..."/>
            </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white flex-1">
                  Create Record
                </Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>)}

      {canManage && (<Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Payment</DialogTitle>
            </DialogHeader>
            {selectedFee && (<div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium">Payment Details</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Student: {students.find((s) => s.id === selectedFee.student_id)?.first_name}{" "}
                    {students.find((s) => s.id === selectedFee.student_id)?.last_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Fee Type: {selectedFee.type || selectedFee.description || "Fee"}
                  </p>
                  <p className="text-sm text-gray-600">Amount: ${formatCurrency(selectedFee.amount)}</p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handlePayment} className="bg-green-600 hover:bg-green-700 text-white flex-1">
                    Confirm Payment
                  </Button>
                  <Button variant="outline" onClick={() => setPaymentOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>)}
          </DialogContent>
        </Dialog>)}
    </div>);
}
