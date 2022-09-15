alter table "public"."course_info" alter column "id" drop not null;
alter table "public"."course_info" add column "id" text;
