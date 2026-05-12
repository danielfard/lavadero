alter table vehicles
  add column if not exists active boolean not null default true;
