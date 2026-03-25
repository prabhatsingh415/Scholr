import { create } from "zustand";
import {
    CMS_DB_UPDATED_EVENT,
    db,
    type CmsCollectionKey,
    type CmsDbUpdatedDetail,
    type Notice,
} from "@/lib/local-storage";

const cmsReaders = {
    students: () => db.students.getAll(),
    teachers: () => db.teachers.getAll(),
    subjects: () => db.subjects.getAll(),
    classes: () => db.classes.getAll(),
    attendance: () => db.attendance.getAll(),
    grades: () => db.grades.getAll(),
    fees: () => db.fees.getAll(),
    notices: () => db.notices.getAll(),
} as const;

const EMPTY_CMS_COLLECTIONS: CmsCollections = {
    students: [],
    teachers: [],
    subjects: [],
    classes: [],
    attendance: [],
    grades: [],
    fees: [],
    notices: [],
};

type CmsCollections = {
    [K in keyof typeof cmsReaders]: ReturnType<(typeof cmsReaders)[K]>;
};

type NoticeInput = Omit<Notice, "id" | "created_at">;

interface CmsStore extends CmsCollections {
    isHydrated: boolean;
    initialize: () => void;
    refreshAll: () => void;
    refreshCollection: (collection: CmsCollectionKey) => void;
    createNotice: (notice: NoticeInput) => Notice;
    updateNotice: (id: string, updates: Partial<Notice>) => Notice | null;
    deleteNotice: (id: string) => boolean;
}

const storageKeysToCollections: Record<CmsCollectionKey, CmsCollectionKey> = {
    students: "students",
    teachers: "teachers",
    subjects: "subjects",
    classes: "classes",
    attendance: "attendance",
    grades: "grades",
    fees: "fees",
    notices: "notices",
};

const safeReadCollection = <K extends CmsCollectionKey>(collection: K): CmsCollections[K] => {
    try {
        return cmsReaders[collection]();
    }
    catch {
        return EMPTY_CMS_COLLECTIONS[collection];
    }
};

const readCmsSnapshot = (): CmsCollections => ({
    students: safeReadCollection("students"),
    teachers: safeReadCollection("teachers"),
    subjects: safeReadCollection("subjects"),
    classes: safeReadCollection("classes"),
    attendance: safeReadCollection("attendance"),
    grades: safeReadCollection("grades"),
    fees: safeReadCollection("fees"),
    notices: safeReadCollection("notices"),
});

const getCollectionSnapshot = <K extends CmsCollectionKey>(collection: K): Pick<CmsStore, K> => ({
    [collection]: safeReadCollection(collection),
} as Pick<CmsStore, K>);

let cmsListenersBound = false;

export const useCmsStore = create<CmsStore>((set) => ({
    ...EMPTY_CMS_COLLECTIONS,
    isHydrated: false,
    initialize: () => {
        bindCmsStoreListeners();
        set({
            ...readCmsSnapshot(),
            isHydrated: true,
        });
    },
    refreshAll: () => {
        set(readCmsSnapshot());
    },
    refreshCollection: (collection) => {
        set(getCollectionSnapshot(collection));
    },
    createNotice: (notice) => db.notices.insert(notice),
    updateNotice: (id, updates) => db.notices.update(id, updates),
    deleteNotice: (id) => db.notices.delete(id),
}));

function bindCmsStoreListeners() {
    if (cmsListenersBound || typeof window === "undefined") {
        return;
    }

    const handleStorage = (event: StorageEvent) => {
        if (!event.key) {
            return;
        }
        const collection = storageKeysToCollections[event.key as CmsCollectionKey];
        if (collection) {
            useCmsStore.setState(getCollectionSnapshot(collection));
        }
    };

    const handleCmsUpdated = (event: Event) => {
        const detail = (event as CustomEvent<CmsDbUpdatedDetail>).detail;
        if (!detail?.collection) {
            return;
        }
        useCmsStore.setState(getCollectionSnapshot(detail.collection));
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(CMS_DB_UPDATED_EVENT, handleCmsUpdated as EventListener);
    cmsListenersBound = true;
}
