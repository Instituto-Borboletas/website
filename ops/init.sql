CREATE DATABASE IF NOT EXISTS borboletas;

USE borboletas;

-- usuarios + session + roles
CREATE TABLE IF NOT EXISTS internal_users (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE INDEX users_email_index (email),
    INDEX users_email_password_hash_is_active_index (email, password_hash, is_active)
);

CREATE TRIGGER IF NOT EXISTS before_insert_internal_user
BEFORE INSERT ON internal_users
FOR EACH ROW SET NEW.id = IFNULL(NEW.id, UUID());

-- CREATE TABLE IF NOT EXISTS roles (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(255) NOT NULL
-- );
--
-- CREATE TABLE IF NOT EXISTS roles_to_users (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT NOT NULL,
--     role_id INT NOT NULL,
--     FOREIGN KEY (user_id) REFERENCES internal_users(id),
--     FOREIGN KEY (role_id) REFERENCES roles(id)
-- );

CREATE TABLE IF NOT EXISTS external_users (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE INDEX users_email_index (email),
    INDEX users_email_password_hash_index (email, password_hash)
);


CREATE TRIGGER IF NOT EXISTS before_insert_external_users
BEFORE INSERT ON external_users
FOR EACH ROW SET NEW.id = IFNULL(NEW.id, UUID());

-- TODO: REMOVE ON PROD ENV
-- TEST DATA
INSERT INTO internal_users (name, email, password_hash) VALUES ('Gabriel Rocha', 'rocha@gmail.com', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4');
INSERT INTO external_users (name, email, password_hash) VALUES ('Gabriel Rocha', 'rocha@gmail.com', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4');
-- REMOVE UNTIL HERE

-- CREATE TABLE IF NOT EXISTS external_users_extra_data (
--     user_id CHAR(36) PRIMARY KEY DEFAULT uuid(),
--     cpf CHAR(11) NOT NULL,
--     birth_date DATE NOT NULL,
--     address VARCHAR(255) NOT NULL,
--
--     -- validar dados necessarios para o formulario de medida protetiva
--
--     FOREIGN KEY (user_id) REFERENCES external_users(id)
-- );

CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    expires_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 12 HOUR),
    token CHAR(36) NOT NULL,

    INDEX session_token_index (token)
);

-- usuarios + session + roles end

-- voluntario
CREATE TABLE IF NOT EXISTS volunteers_kind (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by) REFERENCES internal_users(id)
);

CREATE TABLE IF NOT EXISTS volunteers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NULL,
    phone CHAR(11) NOT NULL,
    kind_id INT NOT NULL,
    registered_by CHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (kind_id) REFERENCES volunteers_kind(id),
    FOREIGN KEY (registered_by) REFERENCES external_users(id)
);
-- voluntario end

-- help
-- TODO: use address table on external user and help requests
-- CREATE TABLE IF NOT EXISTS addresses (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT NOT NULL,
--     cep CHAR(8) NOT NULL,
--     street VARCHAR(255) NOT NULL,
--     number INT NOT NULL,
--     complement VARCHAR(255) NULL,
--     neighborhood VARCHAR(255) NOT NULL,
--     city VARCHAR(255) NOT NULL,
--     state CHAR(2) NOT NULL,
--
--     is_from_location BOOLEAN NOT NULL DEFAULT FALSE,
--     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--
--     FOREIGN KEY (user_id) REFERENCES external_users(id)
-- );

CREATE TABLE IF NOT EXISTS helps_kind (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by) REFERENCES internal_users(id)
);

CREATE TABLE IF NOT EXISTS helps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,

    help_kind_id INT NOT NULL,
    requested_by CHAR(36) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (help_kind_id) REFERENCES helps_kind(id),
    FOREIGN KEY (requested_by) REFERENCES external_users(id)
);

-- TODO: add relation between helps and volunteers so internal user can link a volunteer to a help request
-- CREATE TABLE IF NOT EXISTS helps_volunteers (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     help_id INT NOT NULL,
--     volunteer_id INT NOT NULL,
--     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--
--     FOREIGN KEY (help_id) REFERENCES helps(id),
--     FOREIGN KEY (volunteer_id) REFERENCES volunteers(id)
-- );
-- help end

-- donations
-- donations end
