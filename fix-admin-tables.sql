-- Renomear tabela AdminUser para admin_users (seguindo padrão snake_case)
ALTER TABLE "AdminUser" RENAME TO "admin_users";

-- Renomear tabela Session para session (seguindo padrão snake_case)
ALTER TABLE "Session" RENAME TO "session";

-- Renomear coluna passwordHash para password_hash
ALTER TABLE "admin_users" RENAME COLUMN "passwordHash" TO "password_hash";

-- Renomear coluna isActive para is_active
ALTER TABLE "admin_users" RENAME COLUMN "isActive" TO "is_active";

-- Renomear coluna lastLoginAt para last_login_at
ALTER TABLE "admin_users" RENAME COLUMN "lastLoginAt" TO "last_login_at";

-- Renomear coluna createdAt para created_at
ALTER TABLE "admin_users" RENAME COLUMN "createdAt" TO "created_at";

-- Renomear coluna updatedAt para updated_at
ALTER TABLE "admin_users" RENAME COLUMN "updatedAt" TO "updated_at";
