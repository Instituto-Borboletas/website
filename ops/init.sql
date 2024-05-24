CREATE DATABASE IF NOT EXISTS borboletas;

USE borboletas;

-- usuarios + roles
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS internal_users (
    user_id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS external_users (
    user_id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS external_users_extra_data (
    user_id INT PRIMARY KEY,
    cpf CHAR(11) NOT NULL,
    email VARCHAR(255) NULL,
    phone CHAR(11) NULL,
    birth_date DATE NOT NULL,
    address VARCHAR(255) NOT NULL,

    -- validar dados necessarios para o formulario de medida protetiva

    FOREIGN KEY (user_id) REFERENCES external_users(user_id)
);

CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS roles_to_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);
-- usuarios + roles end

-- voluntario
-- voluntario end

-- help
-- help end
