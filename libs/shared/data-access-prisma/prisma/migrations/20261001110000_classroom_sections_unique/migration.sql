DROP INDEX IF EXISTS "uq_class_rooms_academic_year_name";
CREATE UNIQUE INDEX "uq_class_rooms_academic_year_name_section" ON "class_rooms"("academic_year_id", "name", "section");
