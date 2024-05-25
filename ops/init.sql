CREATE DATABASE IF NOT EXISTS borboletas;

USE borboletas;

-- usuarios + session + roles
CREATE TABLE IF NOT EXISTS internal_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE INDEX users_email_index (email),
    INDEX users_email_password_hash_is_active_index (email, password_hash, is_active)
);

CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS roles_to_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES internal_users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS external_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE INDEX users_email_index (email),
    INDEX users_email_password_hash_index (email, password_hash)
);

CREATE TABLE IF NOT EXISTS external_users_extra_data (
    user_id INT PRIMARY KEY,
    cpf CHAR(11) NOT NULL,
    birth_date DATE NOT NULL,
    address VARCHAR(255) NOT NULL,

    -- validar dados necessarios para o formulario de medida protetiva

    FOREIGN KEY (user_id) REFERENCES external_users(id)
);

CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    expiries_at TIMESTAMP NOT NULL,
    token VARCHAR(255) NOT NULL,

    INDEX session_token_index (token)
);

-- usuarios + session + roles end

-- voluntario
-- voluntario end

-- help
-- help end
