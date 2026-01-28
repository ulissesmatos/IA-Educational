UPDATE "AdminUser" 
SET "passwordHash" = '$2b$12$Z9b8UZTQooGxgnh6vGEg9OnjMQGc3yRfXlI0VJzLZF8eylyZ8W2aa', 
    "updatedAt" = NOW() 
WHERE email = 'admin@iaounao.com';
