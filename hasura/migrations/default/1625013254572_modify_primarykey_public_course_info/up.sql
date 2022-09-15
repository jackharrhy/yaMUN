alter table "public"."course_info" drop constraint "course_info_pkey";
alter table "public"."course_info"
    add constraint "course_info_pkey"
    primary key ("subject", "number");
