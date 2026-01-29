-- CreateTable
CREATE TABLE admin_users (
    id TEXT NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(150) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMP(3),
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL,

    CONSTRAINT admin_users_pkey PRIMARY KEY (id)
);

-- CreateTable
CREATE TABLE session (
    sid VARCHAR(255) NOT NULL,
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL,

    CONSTRAINT session_pkey PRIMARY KEY (sid)
);

-- CreateIndex
CREATE UNIQUE INDEX admin_users_email_key ON admin_users(email);

-- CreateIndex
CREATE INDEX admin_users_email_idx ON admin_users(email);

-- CreateIndex
CREATE INDEX admin_users_is_active_idx ON admin_users(is_active);

-- CreateIndex
CREATE INDEX idx_session_expire ON session(expire);
