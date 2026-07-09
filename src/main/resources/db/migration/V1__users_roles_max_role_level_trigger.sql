-- Ensure id in "Roles" auto-increments for inserts without explicit id.
CREATE SEQUENCE IF NOT EXISTS roles_id_seq;
ALTER TABLE "Roles"
ALTER COLUMN id SET DEFAULT nextval('roles_id_seq');
SELECT setval('roles_id_seq', COALESCE((SELECT MAX(id) FROM "Roles"), 0));
ALTER SEQUENCE roles_id_seq OWNED BY "Roles".id;

-- Ensure id in "Users_Roles" auto-increments for inserts without explicit id.
CREATE SEQUENCE IF NOT EXISTS users_roles_id_seq;
ALTER TABLE "Users_Roles"
ALTER COLUMN id SET DEFAULT nextval('users_roles_id_seq');
SELECT setval('users_roles_id_seq', COALESCE((SELECT MAX(id) FROM "Users_Roles"), 0));
ALTER SEQUENCE users_roles_id_seq OWNED BY "Users_Roles".id;

-- Cache max role level for quick permission checks.
ALTER TABLE "Users_Roles"
ADD COLUMN IF NOT EXISTS max_role_level INTEGER NOT NULL DEFAULT 0;

-- Backfill existing data.
UPDATE "Users_Roles" ur
SET max_role_level = COALESCE(r.role_level, 0)
FROM "Roles" r
WHERE r.id = ur.role_id;

-- Keep max_role_level in sync when role mapping is created/changed.
CREATE OR REPLACE FUNCTION trg_users_roles_set_max_role_level()
RETURNS TRIGGER AS $$
BEGIN
    NEW.max_role_level := COALESCE(
        (SELECT r.role_level FROM "Roles" r WHERE r.id = NEW.role_id),
        0
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_roles_set_max_role_level_ins_upd ON "Users_Roles";
CREATE TRIGGER trg_users_roles_set_max_role_level_ins_upd
BEFORE INSERT OR UPDATE OF role_id
ON "Users_Roles"
FOR EACH ROW
EXECUTE FUNCTION trg_users_roles_set_max_role_level();

-- Propagate role level changes to all mapped users.
CREATE OR REPLACE FUNCTION trg_roles_propagate_role_level_to_users_roles()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE "Users_Roles"
    SET max_role_level = COALESCE(NEW.role_level, 0)
    WHERE role_id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_roles_propagate_role_level_to_users_roles_upd ON "Roles";
CREATE TRIGGER trg_roles_propagate_role_level_to_users_roles_upd
AFTER UPDATE OF role_level
ON "Roles"
FOR EACH ROW
EXECUTE FUNCTION trg_roles_propagate_role_level_to_users_roles();

CREATE INDEX IF NOT EXISTS idx_users_roles_user_id ON "Users_Roles"(user_id);
