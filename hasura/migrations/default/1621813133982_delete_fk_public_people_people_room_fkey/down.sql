alter table "public"."people"
  add constraint "people_room_fkey"
  foreign key ("room")
  references "public"."room"
  ("name") on update cascade on delete restrict;
