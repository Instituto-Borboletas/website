CREATE DATABASE IF NOT EXISTS borboletas;

USE borboletas;

CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT UUID(),
    cep CHAR(8) NOT NULL,
    street VARCHAR(255) NOT NULL,
    number INT NOT NULL,
    complement VARCHAR(255) NULL,
    neighborhood VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state CHAR(2) NOT NULL,

    is_from_location BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
);

-- usuarios + session
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT UUID(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    -- TODO: change from sha256 to a better hashing
    password_hash VARCHAR(255) NOT NULL,

    user_type ENUM('internal', 'external') NOT NULL DEFAULT 'external',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE INDEX email_user_type_index (email, user_type),
    INDEX users_email_password_hash_index (email, password_hash)
);

CREATE TABLE IF NOT EXISTS external_user_data (
    user_id CHAR(36) PRIMARY KEY,
    cpf CHAR(11) NOT NULL,
    phone CHAR(11) NOT NULL,
    birth_date DATE NOT NULL,
    address_id CHAR(36) NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (address_id) REFERENCES addresses(id)
);

CREATE TABLE IF NOT EXISTS sessions (
    id UUID NOT NULL DEFAULT UUID(),
    user_id UUID NOT NULL,
    expires_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 12 HOUR),

    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- usuarios + session + roles end

-- voluntarios
CREATE TABLE IF NOT EXISTS volunteers_kind (
    id UUID PRIMARY KEY DEFAULT UUID(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS volunteers (
    id UUID PRIMARY KEY DEFAULT UUID(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NULL,
    phone CHAR(11) NOT NULL,
    kind_id UUID NOT NULL,
    registered_by UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (kind_id) REFERENCES volunteers_kind(id),
    FOREIGN KEY (registered_by) REFERENCES users(id)
);
-- voluntario end

-- help

CREATE TABLE IF NOT EXISTS helps_kind (
    id UUId PRIMARY KEY DEFAULT UUID(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_by UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS helps (
    id UUID PRIMARY KEY DEFAULT UUID(),
    description TEXT NOT NULL,

    help_kind_id UUID NOT NULL,
    requested_by UUID NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (help_kind_id) REFERENCES helps_kind(id),
    FOREIGN KEY (requested_by) REFERENCES users(id)
);

-- TODO: REMOVE ON PROD ENV
-- TEST DATA
INSERT INTO users (name, email, user_type, password_hash) VALUES ('Gabriel Rocha', 'rocha@gmail.com', 'internal', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4');
-- REMOVE UNTIL HERE

