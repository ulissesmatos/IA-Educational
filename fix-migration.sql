-- Limpar objetos parcialmente criados
DROP TABLE IF EXISTS "AiTool" CASCADE;
DROP TABLE IF EXISTS "AiCategory" CASCADE;
DROP TYPE IF EXISTS "PricingType" CASCADE;
DELETE FROM _prisma_migrations WHERE migration_name = '20240102000000_add_ai_catalog';
