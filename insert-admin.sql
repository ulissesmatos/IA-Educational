INSERT INTO "AdminUser" (id, email, "passwordHash", name, "isActive", "createdAt", "updatedAt") 
VALUES (
    'admin-001', 
    'admin@iaounao.com', 
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5koSK3MerVIfa', 
    'Admin Master', 
    true, 
    NOW(), 
    NOW()
);
