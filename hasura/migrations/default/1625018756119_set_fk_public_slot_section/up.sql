alter table "public"."slot"
  add constraint "slot_section_fkey"
  foreign key ("section")
  references "public"."section"
  ("id") on update cascade on delete cascade;
