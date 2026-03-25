import type { Notice } from "@/lib/local-storage";

type NoticeAttachment = Pick<Notice, "file_data_url" | "file_name">;

const dataUrlToBlob = (dataUrl: string): Blob => {
    const parts = dataUrl.split(",");
    if (parts.length !== 2) {
        throw new Error("Invalid data URL");
    }

    const mimeMatch = parts[0].match(/data:(.*?);base64/);
    const mime = mimeMatch?.[1] || "application/octet-stream";
    const binary = atob(parts[1]);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
    }

    return new Blob([bytes], { type: mime });
};

export const openNoticeAttachment = (notice: NoticeAttachment) => {
    if (!notice.file_data_url || typeof window === "undefined") {
        return false;
    }

    try {
        const blob = dataUrlToBlob(notice.file_data_url);
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank", "noopener,noreferrer");
        window.setTimeout(() => URL.revokeObjectURL(url), 60000);
        return true;
    }
    catch {
        return false;
    }
};

export const downloadNoticeAttachment = (notice: NoticeAttachment) => {
    if (!notice.file_data_url || typeof window === "undefined" || typeof document === "undefined") {
        return false;
    }

    try {
        const blob = dataUrlToBlob(notice.file_data_url);
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = notice.file_name || "notice-file";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
        return true;
    }
    catch {
        return false;
    }
};
