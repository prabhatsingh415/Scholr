export type CmsUserRole = "admin" | "teacher" | "student";
export interface CmsUser {
    id: string;
    email: string;
    role: CmsUserRole;
    created_at: string;
}
const STORAGE_KEY = "auth_user";
export const cmsAuth = {
    async signIn(email: string, password: string, role: CmsUserRole) {
        if (!email || password.length < 6) {
            return { user: null, error: "Password must be at least 6 characters" };
        }
        const user: CmsUser = {
            id: Date.now().toString(),
            email,
            role,
            created_at: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        return { user, error: null };
    },
    async signOut() {
        localStorage.removeItem(STORAGE_KEY);
        return { error: null };
    },
    getUser(): CmsUser | null {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as CmsUser) : null;
    },
};
