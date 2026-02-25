-- Types
create type public.user_role as enum ('admin','teacher','student','parent');
create type public.attendance_status as enum ('present','absent','late');

-- Profiles linked to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.user_role not null default 'teacher',
  created_at timestamptz default now()
);

-- First user becomes admin automatically
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), 
    case when (select count(*) from public.profiles) = 0 then 'admin' else 'teacher' end);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Core tables
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text,
  date_of_birth date,
  gender text,
  parent_contact text,
  address text,
  created_at timestamptz default now()
);

create table if not exists public.teachers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  created_at timestamptz default now()
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  section text,
  year int,
  created_at timestamptz default now()
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text,
  class_id uuid references public.classes(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  created_at timestamptz default now(),
  unique(student_id, class_id)
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  date date not null,
  status public.attendance_status not null default 'present',
  created_at timestamptz default now(),
  unique(student_id, class_id, date)
);

create table if not exists public.grades (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  term text not null,
  score numeric not null check (score >= 0 and score <= 100),
  created_at timestamptz default now(),
  unique(student_id, subject_id, term)
);

-- Helpers
create or replace function public.is_staff()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('admin','teacher')
  );
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.teachers enable row level security;
alter table public.classes enable row level security;
alter table public.subjects enable row level security;
alter table public.enrollments enable row level security;
alter table public.attendance enable row level security;
alter table public.grades enable row level security;

-- Policies: only staff can manage academic data; users can view their own profile
drop policy if exists "profile_self_select" on public.profiles;
create policy "profile_self_select" on public.profiles
for select using (id = auth.uid());

drop policy if exists "staff_select_profiles" on public.profiles;
create policy "staff_select_profiles" on public.profiles
for select using (public.is_staff());

drop policy if exists "staff_update_profiles" on public.profiles;
create policy "staff_update_profiles" on public.profiles
for update using (public.is_staff());

-- Generic staff policies
create policy if not exists "staff_all_students" on public.students
for all using (public.is_staff()) with check (public.is_staff());

create policy if not exists "staff_all_teachers" on public.teachers
for all using (public.is_staff()) with check (public.is_staff());

create policy if not exists "staff_all_classes" on public.classes
for all using (public.is_staff()) with check (public.is_staff());

create policy if not exists "staff_all_subjects" on public.subjects
for all using (public.is_staff()) with check (public.is_staff());

create policy if not exists "staff_all_enrollments" on public.enrollments
for all using (public.is_staff()) with check (public.is_staff());

create policy if not exists "staff_all_attendance" on public.attendance
for all using (public.is_staff()) with check (public.is_staff());

create policy if not exists "staff_all_grades" on public.grades
for all using (public.is_staff()) with check (public.is_staff());
