import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/use-auth-store";
import { openNoticeAttachment, downloadNoticeAttachment } from "@/lib/notice-attachments";

type CellKey = "aicte" | "alumni" | "cdp" | "eap" | "environment" | "iic" | "nba" | "sports";
type CellDoc = {
    file_name?: string;
    file_type?: string;
    file_data_url?: string; // base64 data URL
    uploaded_at?: string;
};

const DOC_STORAGE_PREFIX = "college_cells_doc_";

const CELLS = [
    { key: "aicte", sno: 1, name: "AICTE Cell" },
    { key: "alumni", sno: 2, name: "Alumni Cell" },
    { key: "cdp", sno: 3, name: "Campus Development & Planning Cell" },
    { key: "eap", sno: 4, name: "EAP Cell" },
    { key: "environment", sno: 5, name: "Environmental Cell" },
    { key: "iic", sno: 6, name: "IIC Cells" },
    { key: "nba", sno: 7, name: "NBA Cells" },
    { key: "sports", sno: 8, name: "Sports Department Cells" },
] as const;

export default function CollegeCells() {
    const user = useAuthStore((state) => state.user);
    const canEdit = user?.role === "admin";

    const cellKeys = useMemo(() => CELLS.map((c) => c.key), []);
    const [docs, setDocs] = useState<Record<CellKey, CellDoc | null>>(() => {
        const empty = {} as Record<CellKey, CellDoc | null>;
        cellKeys.forEach((k) => {
            empty[k] = null;
        });
        return empty;
    });

    useEffect(() => {
        // Load stored PDFs for visitors (from localStorage demo CMS storage)
        const loaded = {} as Record<CellKey, CellDoc | null>;
        cellKeys.forEach((key) => {
            try {
                const raw = localStorage.getItem(`${DOC_STORAGE_PREFIX}${key}`);
                loaded[key] = raw ? (JSON.parse(raw) as CellDoc) : null;
            }
            catch {
                loaded[key] = null;
            }
        });
        setDocs(loaded);
    }, [cellKeys]);

    const handleUpload = async (cellKey: CellKey, file: File | null) => {
        if (!file) return;

        const allowed = file.type === "application/pdf";
        if (!allowed) {
            // Keep it simple: only PDF uploads for this request
            alert("Please upload a PDF file.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const result = typeof reader.result === "string" ? reader.result : "";
            const nextDoc: CellDoc = {
                file_name: file.name,
                file_type: file.type,
                file_data_url: result,
                uploaded_at: new Date().toISOString(),
            };
            localStorage.setItem(`${DOC_STORAGE_PREFIX}${cellKey}`, JSON.stringify(nextDoc));
            setDocs((prev) => ({ ...prev, [cellKey]: nextDoc }));
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-center text-3xl font-medium">College Cells</h1>
                    <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-600">
                        Explore the different college cells and initiatives.
                    </p>

                    <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <Table className="min-w-[720px]">
                            <TableHeader>
                                <TableRow className="bg-[#112F68] text-white">
                                    <TableHead className="text-white">Sno.</TableHead>
                                    <TableHead className="text-white">Cells</TableHead>
                                    <TableHead className="text-white text-right">Links</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {CELLS.map((cell) => (
                                    <TableRow key={cell.key}>
                                        <TableCell className="font-medium">{cell.sno}</TableCell>
                                        <TableCell className="font-semibold">{cell.name}</TableCell>
                                        <TableCell className="text-right">
                                            {canEdit ? (
                                                <div className="flex items-center justify-end gap-3">
                                                    <Input
                                                        type="file"
                                                        accept="application/pdf"
                                                        onChange={(e) => handleUpload(cell.key as CellKey, e.target.files?.[0] ?? null)}
                                                        className="max-w-[220px]"
                                                    />
                                                    <span className="text-xs text-slate-500">
                                                        {docs[cell.key as CellKey]?.file_name ? "Uploaded" : "Upload PDF"}
                                                    </span>
                                                    {docs[cell.key as CellKey]?.file_data_url ? (
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                className="bg-[#1C4DFF] hover:bg-[#1237bb] text-white"
                                                                onClick={() =>
                                                                    openNoticeAttachment({
                                                                        file_data_url: docs[cell.key as CellKey]!.file_data_url!,
                                                                        file_name: docs[cell.key as CellKey]!.file_name,
                                                                    })
                                                                }
                                                            >
                                                                Open
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    downloadNoticeAttachment({
                                                                        file_data_url: docs[cell.key as CellKey]!.file_data_url!,
                                                                        file_name: docs[cell.key as CellKey]!.file_name,
                                                                    })
                                                                }
                                                            >
                                                                Download
                                                            </Button>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-end">
                                                    {(() => {
                                                        const doc = docs[cell.key as CellKey];
                                                        const hasPdf = Boolean(doc?.file_data_url);
                                                        return (
                                                            <>
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    className="bg-[#1C4DFF] hover:bg-[#1237bb] text-white"
                                                                    disabled={!hasPdf}
                                                                    onClick={() => {
                                                                        if (!hasPdf)
                                                                            return;
                                                                        openNoticeAttachment({
                                                                            file_data_url: doc!.file_data_url!,
                                                                            file_name: doc.file_name,
                                                                        });
                                                                    }}
                                                                >
                                                                    View PDF
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="ml-2"
                                                                    disabled={!hasPdf}
                                                                    onClick={() => {
                                                                        if (!hasPdf)
                                                                            return;
                                                                        downloadNoticeAttachment({
                                                                            file_data_url: doc!.file_data_url!,
                                                                            file_name: doc.file_name,
                                                                        });
                                                                    }}
                                                                >
                                                                    Download
                                                                </Button>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

