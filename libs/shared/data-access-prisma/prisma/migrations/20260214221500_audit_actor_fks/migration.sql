-- Enforce audit actor FK constraints to users(id)
-- Constraints are conditional to keep this migration idempotent-friendly.

DO $$
DECLARE
  tbl text;
  col text;
  cname text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'tenants','users','user_tenants','roles','permissions','role_permissions','user_role_assignments',
    'schools','campuses','academic_years','terms','staff_profiles','teacher_profiles','guardians','students','student_guardians',
    'class_rooms','subjects','classroom_subjects','enrollments','attendance_sessions','attendance_records',
    'fee_plans','fee_items','student_fee_plans','invoices','invoice_lines','payments','payment_allocations',
    'transport_vehicles','transport_routes','transport_stops','student_transport_assignments',
    'documents','timetable_entries','teacher_attendance','notifications','user_notifications','messages','sessions','audit_logs'
  ]
  LOOP
    FOREACH col IN ARRAY ARRAY['created_by_id','updated_by_id','deleted_by_id']
    LOOP
      cname := format('fk_%s_%s_users', tbl, col);

      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = tbl
          AND column_name = col
      ) AND NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = cname
      ) THEN
        EXECUTE format(
          'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES users(id) ON DELETE SET NULL',
          tbl,
          cname,
          col
        );
      END IF;
    END LOOP;
  END LOOP;
END
$$;
