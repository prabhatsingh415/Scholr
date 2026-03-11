"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { db, type Notice } from "@/lib/local-storage";
import { toast } from "@/hooks/use-toast";
import { Download, Plus, Pencil, Trash2 } from "lucide-react";
import ConfirmDelete from "@/components/common/confirm-delete";
type Audience = "teacher" | "student" | "all";
const AUDIENCE_LABELS: Record<Audience, string> = {
    teacher: "Faculty",
    student: "Student",
    all: "All",
};
export default function NoticesPage() {
    const [notices, setNotices] = useState<Notice[]>(() => db.notices.getAll());
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState<Notice | null>(null);
    const [selectedFileName, setSelectedFileName] = useState("");
    const [form, setForm] = useState({
        title: "",
        message: "",
        audience: "all" as Audience,
        file_name: "",
        file_type: "",
        file_data_url: "",
    });
    const sorted = useMemo(() => [...notices].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()), [notices]);
    const openCreate = () => {
        setEdit(null);
        setSelectedFileName("");
        setForm({
            title: "",
            message: "",
            audience: "all",
            file_name: "",
            file_type: "",
            file_data_url: "",
        });
        setOpen(true);
    };
    const openEdit = (notice: Notice) => {
        setEdit(notice);
        setForm({
            title: notice.title,
            message: notice.message,
            audience: notice.audience,
            file_name: notice.file_name || "",
            file_type: notice.file_type || "",
            file_data_url: notice.file_data_url || "",
        });
        setSelectedFileName(notice.file_name || "");
        setOpen(true);
    };
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file)
            return;
        const allowed = file.type === "application/pdf" || file.type.startsWith("image/");
        if (!allowed) {
            toast({
                title: "Invalid file type",
                description: "Only PDF and image files are allowed.",
                variant: "destructive",
            });
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = String(reader.result || "");
            setForm((prev) => ({
                ...prev,
                file_name: file.name,
                file_type: file.type,
                file_data_url: dataUrl,
            }));
            setSelectedFileName(file.name);
        };
        reader.readAsDataURL(file);
    };
    const clearSelectedFile = () => {
        setForm((prev) => ({
            ...prev,
            file_name: "",
            file_type: "",
            file_data_url: "",
        }));
        setSelectedFileName("");
    };
    const saveNotice = () => {
        if (!form.title.trim() || !form.message.trim()) {
            toast({ title: "Missing fields", description: "Title and message are required.", variant: "destructive" });
            return;
        }
        if (edit) {
            const updated = db.notices.update(edit.id, form);
            if (updated) {
                setNotices((prev) => prev.map((n) => (n.id === edit.id ? updated : n)));
                toast({ title: "Updated", description: "Notice updated successfully." });
            }
        }
        else {
            const created = db.notices.insert(form);
            setNotices((prev) => [created, ...prev]);
            toast({ title: "Created", description: "Notice published successfully." });
        }
        setOpen(false);
    };
    const dataUrlToBlob = (dataUrl: string): Blob => {
        const parts = dataUrl.split(",");
        if (parts.length !== 2)
            throw new Error("Invalid data URL");
        const mimeMatch = parts[0].match(/data:(.*?);base64/);
        const mime = mimeMatch?.[1] || "application/octet-stream";
        const binary = atob(parts[1]);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++)
            bytes[i] = binary.charCodeAt(i);
        return new Blob([bytes], { type: mime });
    };
    const openAttachment = (notice: Notice) => {
        if (!notice.file_data_url)
            return;
        try {
            const blob = dataUrlToBlob(notice.file_data_url);
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank", "noopener,noreferrer");
            setTimeout(() => URL.revokeObjectURL(url), 60000);
        }
        catch {
            toast({ title: "Open failed", description: "Could not open this file.", variant: "destructive" });
        }
    };
    const downloadAttachment = (notice: Notice) => {
        if (!notice.file_data_url)
            return;
        try {
            const blob = dataUrlToBlob(notice.file_data_url);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = notice.file_name || "notice-file";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        catch {
            toast({ title: "Download failed", description: "Could not download this file.", variant: "destructive" });
        }
    };
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold">Notices</h1>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2"/> Add Notice
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Notices ({notices.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sorted.map((n) => (<div key={n.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{n.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                  {n.file_data_url && (<div className="mt-2 flex items-center gap-3 text-sm">
                      <button type="button" onClick={() => openAttachment(n)} className="text-teal-700 hover:underline">
                        Open: {n.file_name || "Attachment"}
                      </button>
                      <button type="button" onClick={() => downloadAttachment(n)} className="inline-flex items-center gap-1 text-teal-700 hover:underline">
                        <Download className="h-3.5 w-3.5"/>
                        Download
                      </button>
                    </div>)}
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="secondary">{AUDIENCE_LABELS[n.audience]}</Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => openEdit(n)}>
                    <Pencil className="h-4 w-4"/>
                  </Button>
                  <ConfirmDelete title="Delete notice" description="This notice will be removed permanently." onConfirm={() => {
                db.notices.delete(n.id);
                setNotices((prev) => prev.filter((x) => x.id !== n.id));
                toast({ title: "Deleted", description: "Notice removed successfully." });
            }}>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4"/>
                    </Button>
                  </ConfirmDelete>
                </div>
              </div>
            </div>))}
          {sorted.length === 0 && (<div className="text-center text-sm text-muted-foreground py-6">No notices available.</div>)}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{edit ? "Edit Notice" : "Add Notice"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Notice title"/>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea value={form.message} onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))} placeholder="Write notice details..." rows={5}/>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Audience</label>
              <Select value={form.audience} onValueChange={(value) => setForm((prev) => ({ ...prev, audience: value as Audience }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="teacher">Faculty</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Add File (PDF/Image)</label>
              <Input type="file" accept=".pdf,image/*" onChange={handleFileChange}/>
              {selectedFileName && (<div className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                  <span className="truncate">{selectedFileName}</span>
                  <Button type="button" variant="ghost" onClick={clearSelectedFile}>
                    Remove
                  </Button>
                </div>)}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={saveNotice}>
                {edit ? "Update Notice" : "Publish Notice"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>);
}
