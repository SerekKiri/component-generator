-- Users are managed by Supabase Auth

-- Table: chats
create table public.chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Table: components
create table public.components (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references public.chats on delete cascade unique,
  code text not null,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Table: messages
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references public.chats on delete cascade,
  user_id uuid references auth.users,
  role text check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default timezone('utc', now())
);

-- RLS Policies
-- Enable RLS
alter table public.chats enable row level security;
alter table public.components enable row level security;
alter table public.messages enable row level security;

-- Only allow users to access their own chats
create policy "Users can access their own chats"
  on public.chats
  for select using (user_id = auth.uid());

create policy "Users can insert their own chats"
  on public.chats
  for insert with check (user_id = auth.uid());

-- Only allow users to access messages in their chats
create policy "Users can access messages in their chats"
  on public.messages
  for select using (
    chat_id in (select id from public.chats where user_id = auth.uid())
  );

create policy "Users can insert messages in their chats"
  on public.messages
  for insert with check (
    chat_id in (select id from public.chats where user_id = auth.uid())
  );

-- Only allow users to access components in their chats
create policy "Users can access components in their chats"
  on public.components
  for select using (
    chat_id in (select id from public.chats where user_id = auth.uid())
  );

create policy "Users can insert components in their chats"
  on public.components
  for insert with check (
    chat_id in (select id from public.chats where user_id = auth.uid())
  );

-- For library: allow all users to select components (but not insert/update/delete)
create policy "All users can view all components"
  on public.components
  for select using (true);