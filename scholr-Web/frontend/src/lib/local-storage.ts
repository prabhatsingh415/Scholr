import { extractObjectByKeys, extractStringByKeys, scholrApiClient, scholrTokenStorage } from "./scholr-api";

export type Student = {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
    date_of_birth?: string;
    gender?: string;
    year?: string;
    branch?: string;
    parent_contact?: string;
    address?: string;
    created_at: string;
};
export type Teacher = {
    id: string;
    full_name: string;
    email?: string;
    phone?: string;
    created_at: string;
};
export type User = {
    id: string;
    email: string;
    role: "admin" | "teacher" | "student";
    created_at: string;
    name?: string;
};
export type Notice = {
    id: string;
    title: string;
    message: string;
    audience: "teacher" | "student" | "all";
    file_name?: string;
    file_type?: string;
    file_data_url?: string;
    created_at: string;
};

const AUTH_USER_KEY = "auth_user";

const asRecord = (value: unknown): Record<string, unknown> | null => {
    return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;
};

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
    const parts = token.split(".");
    if (parts.length < 2) {
        return null;
    }
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    try {
        const parsed = JSON.parse(atob(padded));
        return asRecord(parsed);
    }
    catch {
        return null;
    }
};

const toAppRole = (backendRole: string | null | undefined, fallback: User["role"]): User["role"] => {
    if (!backendRole) {
        return fallback;
    }
    const role = backendRole.toLowerCase();
    if (role.includes("admin")) {
        return "admin";
    }
    if (role.includes("teacher") || role.includes("faculty")) {
        return "teacher";
    }
    if (role.includes("student")) {
        return "student";
    }
    return fallback;
};

const buildUserFromSources = ({
    collegeId,
    requestedRole,
    profileData,
    loginData,
    tokenPayload,
}: {
    collegeId: string;
    requestedRole: User["role"];
    profileData?: unknown;
    loginData?: unknown;
    tokenPayload?: Record<string, unknown> | null;
}): User => {
    const profileCandidate = extractObjectByKeys(profileData, ["user", "data", "result", "payload"]) ?? asRecord(profileData);
    const loginCandidate = extractObjectByKeys(loginData, ["user", "profile", "account"]) ?? asRecord(loginData);
    const source = profileCandidate ?? loginCandidate ?? tokenPayload ?? {};

    const firstName = extractStringByKeys(source, ["firstName", "first_name", "given_name"]);
    const lastName = extractStringByKeys(source, ["lastName", "last_name", "family_name"]);
    const fullName = extractStringByKeys(source, ["name", "fullName", "full_name"]);
    const composedName = [firstName, lastName].filter(Boolean).join(" ").trim();
    const backendRole =
        extractStringByKeys(source, ["role", "userRole", "user_role"]) ??
            extractStringByKeys(tokenPayload, ["role"]);

    return {
        id: extractStringByKeys(source, ["id", "userId", "user_id", "sub", "collegeId", "college_id"]) ??
            extractStringByKeys(tokenPayload, ["sub", "collegeId", "college_id"]) ??
            collegeId,
        email: extractStringByKeys(source, ["email", "emailId", "mail"]) ??
            extractStringByKeys(tokenPayload, ["email"]) ??
            `${collegeId.toLowerCase()}@college.local`,
        role: toAppRole(backendRole, requestedRole),
        created_at: extractStringByKeys(source, ["created_at", "createdAt"]) ?? new Date().toISOString(),
        name: fullName ?? (composedName || undefined),
    };
};

export const auth = {
    signIn: async (collegeId: string, password: string, role: "admin" | "teacher" | "student"): Promise<{
        user: User | null;
        error: string | null;
    }> => {
        if (!collegeId || password.length < 6) {
            return { user: null, error: "Invalid credentials" };
        }
        try {
            const loginData = await scholrApiClient.auth.login({ collegeId, password });
            const accessToken = extractStringByKeys(loginData, ["accessToken", "access_token", "token", "jwt"]);
            const refreshToken = extractStringByKeys(loginData, ["refreshToken", "refresh_token"]);
            if (accessToken) {
                scholrTokenStorage.setAccessToken(accessToken);
            }
            if (refreshToken) {
                scholrTokenStorage.setRefreshToken(refreshToken);
            }
            const tokenPayload = accessToken ? decodeJwtPayload(accessToken) : null;
            let profileData: unknown = null;
            try {
                profileData = await scholrApiClient.users.me();
            }
            catch {
                profileData = null;
            }
            const user = buildUserFromSources({
                collegeId,
                requestedRole: role,
                profileData,
                loginData,
                tokenPayload,
            });
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
            return { user, error: null };
        }
        catch (error) {
            const message = extractStringByKeys((error as { response?: { data?: unknown } }).response?.data, [
                "message",
                "error",
                "detail",
            ]) ?? "Login failed. Please check your College ID and password.";
            scholrTokenStorage.clear();
            localStorage.removeItem(AUTH_USER_KEY);
            return { user: null, error: message };
        }
    },
    signUp: async (collegeId: string, password: string): Promise<{
        user: User | null;
        error: string | null;
    }> => {
        if (!collegeId || password.length < 6) {
            return { user: null, error: "Password must be at least 6 characters" };
        }
        try {
            await scholrApiClient.auth.signup({ collegeId, password });
            const user: User = {
                id: collegeId,
                email: `${collegeId.toLowerCase()}@college.local`,
                role: "student",
                created_at: new Date().toISOString(),
            };
            return { user, error: null };
        }
        catch (error) {
            const message = extractStringByKeys((error as { response?: { data?: unknown } }).response?.data, [
                "message",
                "error",
                "detail",
            ]) ?? "Signup failed. Please try again.";
            return { user: null, error: message };
        }
    },
    signOut: async (): Promise<{
        error: string | null;
    }> => {
        try {
            await scholrApiClient.auth.logout();
        }
        catch {
        }
        scholrTokenStorage.clear();
        localStorage.removeItem(AUTH_USER_KEY);
        return { error: null };
    },
    getUser: (): User | null => {
        const stored = localStorage.getItem(AUTH_USER_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            }
            catch {
                localStorage.removeItem(AUTH_USER_KEY);
            }
        }
        const accessToken = scholrTokenStorage.getAccessToken();
        if (!accessToken) {
            return null;
        }
        const tokenPayload = decodeJwtPayload(accessToken);
        if (!tokenPayload) {
            return null;
        }
        const collegeId = extractStringByKeys(tokenPayload, ["sub", "collegeId", "college_id"]) ?? "user";
        const role = toAppRole(extractStringByKeys(tokenPayload, ["role"]), "student");
        const user = buildUserFromSources({
            collegeId,
            requestedRole: role,
            tokenPayload,
        });
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        return user;
    },
    quickLogin: (role: "admin" | "teacher" | "student") => {
        const roleEmail = role === "admin" ? "admin@school.com" : role === "teacher" ? "teacher@school.com" : "student@school.com";
        const name = role === "admin" ? "Administrator" : role === "teacher" ? "Teacher User" : "Student User";
        const user: User = {
            id: `${role}-${Date.now()}`,
            email: roleEmail,
            role,
            name,
            created_at: new Date().toISOString(),
        };
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        return { user };
    },
};
export const db = {
    students: {
        getAll: (): Student[] => {
            if (typeof window === "undefined")
                return [];
            const stored = localStorage.getItem("students");
            return stored ? JSON.parse(stored) : [];
        },
        insert: (student: Omit<Student, "id" | "created_at">): Student => {
            const students = db.students.getAll();
            const newStudent: Student = {
                ...student,
                id: Date.now().toString(),
                created_at: new Date().toISOString(),
            };
            students.push(newStudent);
            localStorage.setItem("students", JSON.stringify(students));
            return newStudent;
        },
        update: (id: string, updates: Partial<Student>): Student | null => {
            const students = db.students.getAll();
            const index = students.findIndex((s) => s.id === id);
            if (index === -1)
                return null;
            students[index] = { ...students[index], ...updates };
            localStorage.setItem("students", JSON.stringify(students));
            return students[index];
        },
        delete: (id: string): boolean => {
            const students = db.students.getAll();
            const filtered = students.filter((s) => s.id !== id);
            localStorage.setItem("students", JSON.stringify(filtered));
            return filtered.length < students.length;
        },
    },
    teachers: {
        getAll: (): Teacher[] => {
            if (typeof window === "undefined")
                return [];
            const stored = localStorage.getItem("teachers");
            return stored ? JSON.parse(stored) : [];
        },
        insert: (teacher: Omit<Teacher, "id" | "created_at">): Teacher => {
            const teachers = db.teachers.getAll();
            const newTeacher: Teacher = {
                ...teacher,
                id: Date.now().toString(),
                created_at: new Date().toISOString(),
            };
            teachers.push(newTeacher);
            localStorage.setItem("teachers", JSON.stringify(teachers));
            return newTeacher;
        },
        update: (id: string, updates: Partial<Teacher>): Teacher | null => {
            const teachers = db.teachers.getAll();
            const index = teachers.findIndex((t) => t.id === id);
            if (index === -1)
                return null;
            teachers[index] = { ...teachers[index], ...updates };
            localStorage.setItem("teachers", JSON.stringify(teachers));
            return teachers[index];
        },
        delete: (id: string): boolean => {
            const teachers = db.teachers.getAll();
            const filtered = teachers.filter((t) => t.id !== id);
            localStorage.setItem("teachers", JSON.stringify(filtered));
            return filtered.length < teachers.length;
        },
    },
    subjects: {
        getAll: () => {
            if (typeof window === "undefined")
                return [];
            const stored = localStorage.getItem("subjects");
            return stored ? JSON.parse(stored) : [];
        },
        insert: (subject: Omit<any, "id" | "created_at">) => {
            const subjects = db.subjects.getAll();
            const newSubject = {
                ...subject,
                id: Date.now().toString(),
                created_at: new Date().toISOString(),
            };
            subjects.push(newSubject);
            localStorage.setItem("subjects", JSON.stringify(subjects));
            return newSubject;
        },
        update: (id: string, updates: any) => {
            const subjects = db.subjects.getAll();
            const index = subjects.findIndex((s: any) => s.id === id);
            if (index === -1)
                return null;
            subjects[index] = { ...subjects[index], ...updates };
            localStorage.setItem("subjects", JSON.stringify(subjects));
            return subjects[index];
        },
        delete: (id: string) => {
            const subjects = db.subjects.getAll();
            const filtered = subjects.filter((s: any) => s.id !== id);
            localStorage.setItem("subjects", JSON.stringify(filtered));
            return filtered.length < subjects.length;
        },
    },
    classes: {
        getAll: () => {
            if (typeof window === "undefined")
                return [];
            const stored = localStorage.getItem("classes");
            return stored ? JSON.parse(stored) : [];
        },
        insert: (classData: Omit<any, "id" | "created_at">) => {
            const classes = db.classes.getAll();
            const newClass = {
                ...classData,
                id: Date.now().toString(),
                created_at: new Date().toISOString(),
            };
            classes.push(newClass);
            localStorage.setItem("classes", JSON.stringify(classes));
            return newClass;
        },
        update: (id: string, updates: any) => {
            const classes = db.classes.getAll();
            const index = classes.findIndex((c: any) => c.id === id);
            if (index === -1)
                return null;
            classes[index] = { ...classes[index], ...updates };
            localStorage.setItem("classes", JSON.stringify(classes));
            return classes[index];
        },
        delete: (id: string) => {
            const classes = db.classes.getAll();
            const filtered = classes.filter((c: any) => c.id !== id);
            localStorage.setItem("classes", JSON.stringify(filtered));
            return filtered.length < classes.length;
        },
    },
    attendance: {
        getAll: () => {
            if (typeof window === "undefined")
                return [];
            const stored = localStorage.getItem("attendance");
            return stored ? JSON.parse(stored) : [];
        },
        insert: (attendance: Omit<any, "id" | "created_at">) => {
            const records = db.attendance.getAll();
            const newRecord = {
                ...attendance,
                id: Date.now().toString(),
                created_at: new Date().toISOString(),
            };
            records.push(newRecord);
            localStorage.setItem("attendance", JSON.stringify(records));
            return newRecord;
        },
        getByDate: (date: string) => {
            return db.attendance.getAll().filter((record: any) => record.date === date);
        },
        getByStudent: (studentId: string) => {
            return db.attendance.getAll().filter((record: any) => record.student_id === studentId);
        },
    },
    grades: {
        getAll: () => {
            if (typeof window === "undefined")
                return [];
            const stored = localStorage.getItem("grades");
            return stored ? JSON.parse(stored) : [];
        },
        insert: (grade: Omit<any, "id" | "created_at">) => {
            const grades = db.grades.getAll();
            const newGrade = {
                ...grade,
                id: Date.now().toString(),
                created_at: new Date().toISOString(),
            };
            grades.push(newGrade);
            localStorage.setItem("grades", JSON.stringify(grades));
            return newGrade;
        },
        getByStudent: (studentId: string) => {
            return db.grades.getAll().filter((grade: any) => grade.student_id === studentId);
        },
        getBySubject: (subjectId: string) => {
            return db.grades.getAll().filter((grade: any) => grade.subject_id === subjectId);
        },
    },
    fees: {
        getAll: () => {
            if (typeof window === "undefined")
                return [];
            const stored = localStorage.getItem("fees");
            return stored ? JSON.parse(stored) : [];
        },
        insert: (fee: Omit<any, "id" | "created_at">) => {
            const fees = db.fees.getAll();
            const newFee = {
                ...fee,
                id: Date.now().toString(),
                created_at: new Date().toISOString(),
            };
            fees.push(newFee);
            localStorage.setItem("fees", JSON.stringify(fees));
            return newFee;
        },
        update: (id: string, updates: any) => {
            const fees = db.fees.getAll();
            const index = fees.findIndex((f: any) => f.id === id);
            if (index === -1)
                return null;
            fees[index] = { ...fees[index], ...updates };
            localStorage.setItem("fees", JSON.stringify(fees));
            return fees[index];
        },
        getByStudent: (studentId: string) => {
            return db.fees.getAll().filter((fee: any) => fee.student_id === studentId);
        },
        getOverdue: () => {
            const today = new Date().toISOString().split("T")[0];
            return db.fees.getAll().filter((fee: any) => fee.due_date < today && fee.status !== "paid");
        },
    },
    notices: {
        getAll: (): Notice[] => {
            if (typeof window === "undefined")
                return [];
            const stored = localStorage.getItem("notices");
            return stored ? JSON.parse(stored) : [];
        },
        insert: (notice: Omit<Notice, "id" | "created_at">): Notice => {
            const notices = db.notices.getAll();
            const newNotice: Notice = {
                ...notice,
                id: Date.now().toString(),
                created_at: new Date().toISOString(),
            };
            notices.unshift(newNotice);
            localStorage.setItem("notices", JSON.stringify(notices));
            return newNotice;
        },
        update: (id: string, updates: Partial<Notice>): Notice | null => {
            const notices = db.notices.getAll();
            const index = notices.findIndex((n) => n.id === id);
            if (index === -1)
                return null;
            notices[index] = { ...notices[index], ...updates };
            localStorage.setItem("notices", JSON.stringify(notices));
            return notices[index];
        },
        delete: (id: string): boolean => {
            const notices = db.notices.getAll();
            const filtered = notices.filter((n) => n.id !== id);
            localStorage.setItem("notices", JSON.stringify(filtered));
            return filtered.length < notices.length;
        },
    },
};
const SEED_DATA = {
    students: [
        {
            id: "1",
            first_name: "Emma",
            last_name: "Johnson",
            email: "emma.johnson@email.com",
            date_of_birth: "2008-03-15",
            gender: "Female",
            parent_contact: "+1 (555) 123-4567",
            address: "123 Oak Street, Springfield, IL 62701",
            created_at: "2024-01-15T08:00:00Z",
        },
        {
            id: "2",
            first_name: "Liam",
            last_name: "Smith",
            email: "liam.smith@email.com",
            date_of_birth: "2007-11-22",
            gender: "Male",
            parent_contact: "+1 (555) 234-5678",
            address: "456 Pine Avenue, Springfield, IL 62702",
            created_at: "2024-01-16T09:15:00Z",
        },
        {
            id: "3",
            first_name: "Sophia",
            last_name: "Davis",
            email: "sophia.davis@email.com",
            date_of_birth: "2008-07-08",
            gender: "Female",
            parent_contact: "+1 (555) 345-6789",
            address: "789 Maple Drive, Springfield, IL 62703",
            created_at: "2024-01-17T10:30:00Z",
        },
        {
            id: "4",
            first_name: "Noah",
            last_name: "Wilson",
            email: "noah.wilson@email.com",
            date_of_birth: "2007-12-03",
            gender: "Male",
            parent_contact: "+1 (555) 456-7890",
            address: "321 Elm Street, Springfield, IL 62704",
            created_at: "2024-01-18T11:45:00Z",
        },
        {
            id: "5",
            first_name: "Olivia",
            last_name: "Brown",
            email: "olivia.brown@email.com",
            date_of_birth: "2008-05-20",
            gender: "Female",
            parent_contact: "+1 (555) 567-8901",
            address: "654 Cedar Lane, Springfield, IL 62705",
            created_at: "2024-01-19T13:00:00Z",
        },
        {
            id: "6",
            first_name: "William",
            last_name: "Taylor",
            email: "william.taylor@email.com",
            date_of_birth: "2007-09-14",
            gender: "Male",
            parent_contact: "+1 (555) 678-9012",
            address: "987 Birch Road, Springfield, IL 62706",
            created_at: "2024-01-20T14:15:00Z",
        },
    ],
    teachers: [
        {
            id: "1",
            full_name: "Dr. Sarah Mitchell",
            email: "sarah.mitchell@school.edu",
            phone: "+1 (555) 111-2222",
            created_at: "2024-01-10T08:00:00Z",
        },
        {
            id: "2",
            full_name: "Prof. Michael Chen",
            email: "michael.chen@school.edu",
            phone: "+1 (555) 222-3333",
            created_at: "2024-01-11T09:00:00Z",
        },
        {
            id: "3",
            full_name: "Ms. Jennifer Rodriguez",
            email: "jennifer.rodriguez@school.edu",
            phone: "+1 (555) 333-4444",
            created_at: "2024-01-12T10:00:00Z",
        },
        {
            id: "4",
            full_name: "Mr. David Thompson",
            email: "david.thompson@school.edu",
            phone: "+1 (555) 444-5555",
            created_at: "2024-01-13T11:00:00Z",
        },
        {
            id: "5",
            full_name: "Dr. Lisa Anderson",
            email: "lisa.anderson@school.edu",
            phone: "+1 (555) 555-6666",
            created_at: "2024-01-14T12:00:00Z",
        },
    ],
    subjects: [
        {
            id: "1",
            name: "Mathematics",
            description: "Advanced mathematics including algebra, geometry, and calculus",
            created_at: "2024-01-01T08:00:00Z",
        },
        {
            id: "2",
            name: "English Literature",
            description: "Comprehensive study of literature, writing, and communication",
            created_at: "2024-01-01T08:15:00Z",
        },
        {
            id: "3",
            name: "Physics",
            description: "Fundamental principles of physics and scientific methodology",
            created_at: "2024-01-01T08:30:00Z",
        },
        {
            id: "4",
            name: "Chemistry",
            description: "Chemical reactions, molecular structure, and laboratory work",
            created_at: "2024-01-01T08:45:00Z",
        },
        {
            id: "5",
            name: "Biology",
            description: "Life sciences, ecology, and human anatomy",
            created_at: "2024-01-01T09:00:00Z",
        },
        {
            id: "6",
            name: "History",
            description: "World history, social studies, and cultural analysis",
            created_at: "2024-01-01T09:15:00Z",
        },
    ],
    classes: [
        {
            id: "1",
            name: "Grade 10A",
            teacher_id: "1",
            subject_ids: ["1", "2", "3"],
            room_number: "A101",
            capacity: 30,
            created_at: "2024-01-05T08:00:00Z",
        },
        {
            id: "2",
            name: "Grade 10B",
            teacher_id: "2",
            subject_ids: ["4", "5", "6"],
            room_number: "B102",
            capacity: 28,
            created_at: "2024-01-05T08:30:00Z",
        },
        {
            id: "3",
            name: "Grade 11A",
            teacher_id: "3",
            subject_ids: ["1", "3", "5"],
            room_number: "A201",
            capacity: 25,
            created_at: "2024-01-05T09:00:00Z",
        },
        {
            id: "4",
            name: "Grade 11B",
            teacher_id: "4",
            subject_ids: ["2", "4", "6"],
            room_number: "B202",
            capacity: 27,
            created_at: "2024-01-05T09:30:00Z",
        },
    ],
    attendance: [
        { id: "1", student_id: "1", class_id: "1", date: "2024-12-16", present: true, created_at: "2024-12-16T08:00:00Z" },
        { id: "2", student_id: "2", class_id: "1", date: "2024-12-16", present: true, created_at: "2024-12-16T08:00:00Z" },
        { id: "3", student_id: "3", class_id: "2", date: "2024-12-16", present: false, created_at: "2024-12-16T08:00:00Z" },
        { id: "4", student_id: "4", class_id: "2", date: "2024-12-16", present: true, created_at: "2024-12-16T08:00:00Z" },
        { id: "5", student_id: "1", class_id: "1", date: "2024-12-17", present: true, created_at: "2024-12-17T08:00:00Z" },
        { id: "6", student_id: "2", class_id: "1", date: "2024-12-17", present: false, created_at: "2024-12-17T08:00:00Z" },
        { id: "7", student_id: "3", class_id: "2", date: "2024-12-17", present: true, created_at: "2024-12-17T08:00:00Z" },
        { id: "8", student_id: "4", class_id: "2", date: "2024-12-17", present: true, created_at: "2024-12-17T08:00:00Z" },
    ],
    grades: [
        {
            id: "1",
            student_id: "1",
            subject_id: "1",
            grade: "A",
            score: 92,
            term: "Fall 2024",
            created_at: "2024-12-01T10:00:00Z",
        },
        {
            id: "2",
            student_id: "1",
            subject_id: "2",
            grade: "B+",
            score: 88,
            term: "Fall 2024",
            created_at: "2024-12-01T10:15:00Z",
        },
        {
            id: "3",
            student_id: "2",
            subject_id: "1",
            grade: "B",
            score: 85,
            term: "Fall 2024",
            created_at: "2024-12-01T10:30:00Z",
        },
        {
            id: "4",
            student_id: "2",
            subject_id: "3",
            grade: "A-",
            score: 90,
            term: "Fall 2024",
            created_at: "2024-12-01T10:45:00Z",
        },
        {
            id: "5",
            student_id: "3",
            subject_id: "4",
            grade: "A",
            score: 94,
            term: "Fall 2024",
            created_at: "2024-12-01T11:00:00Z",
        },
        {
            id: "6",
            student_id: "4",
            subject_id: "5",
            grade: "B+",
            score: 87,
            term: "Fall 2024",
            created_at: "2024-12-01T11:15:00Z",
        },
    ],
    fees: [
        {
            id: "1",
            student_id: "1",
            amount: 1200,
            due_date: "2024-12-31",
            status: "paid",
            description: "Tuition Fee - Fall 2024",
            created_at: "2024-09-01T08:00:00Z",
        },
        {
            id: "2",
            student_id: "2",
            amount: 1200,
            due_date: "2024-12-31",
            status: "pending",
            description: "Tuition Fee - Fall 2024",
            created_at: "2024-09-01T08:00:00Z",
        },
        {
            id: "3",
            student_id: "3",
            amount: 150,
            due_date: "2024-12-20",
            status: "overdue",
            description: "Library Fee",
            created_at: "2024-11-01T08:00:00Z",
        },
        {
            id: "4",
            student_id: "4",
            amount: 1200,
            due_date: "2024-12-31",
            status: "paid",
            description: "Tuition Fee - Fall 2024",
            created_at: "2024-09-01T08:00:00Z",
        },
    ],
    notices: [
        {
            id: "1",
            title: "Exam Circular",
            message: "Mid-semester exams start from next Monday. Check timetable regularly.",
            audience: "all",
            created_at: "2026-02-25T10:00:00Z",
        },
    ],
};
const initializeSeedData = () => {
    if (typeof window === "undefined")
        return;
    if (!localStorage.getItem("students")) {
        localStorage.setItem("students", JSON.stringify(SEED_DATA.students));
    }
    if (!localStorage.getItem("teachers")) {
        localStorage.setItem("teachers", JSON.stringify(SEED_DATA.teachers));
    }
    if (!localStorage.getItem("subjects")) {
        localStorage.setItem("subjects", JSON.stringify(SEED_DATA.subjects));
    }
    if (!localStorage.getItem("classes")) {
        localStorage.setItem("classes", JSON.stringify(SEED_DATA.classes));
    }
    if (!localStorage.getItem("attendance")) {
        localStorage.setItem("attendance", JSON.stringify(SEED_DATA.attendance));
    }
    if (!localStorage.getItem("grades")) {
        localStorage.setItem("grades", JSON.stringify(SEED_DATA.grades));
    }
    if (!localStorage.getItem("fees")) {
        localStorage.setItem("fees", JSON.stringify(SEED_DATA.fees));
    }
    if (!localStorage.getItem("notices")) {
        localStorage.setItem("notices", JSON.stringify(SEED_DATA.notices));
    }
};
initializeSeedData();
export const getStudents = () => db.students.getAll();
export const getTeachers = () => db.teachers.getAll();
export const getSubjects = () => db.subjects.getAll();
export const getClasses = () => db.classes.getAll();
export const getAttendance = () => db.attendance.getAll();
export const getGrades = () => db.grades.getAll();
export const getFees = () => db.fees.getAll();
export const getNotices = () => db.notices.getAll();
