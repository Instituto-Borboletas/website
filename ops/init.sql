CREATE DATABASE IF NOT EXISTS borboletas;

USE borboletas;

 -- ser voluntario init
CREATE TABLE IF NOT EXISTS volunteer_kind (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS volunteer (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(11) NOT NULL,
    cpf VARCHAR(11) NOT NULL,
    birth_date DATE NOT NULL,
    volunteer_kind_id INTEGER NOT NULL,

    FOREIGN KEY (volunteer_kind_id) REFERENCES volunteer_kind(id)
);
-- ser voluntario end

-- parte usuario init
CREATE TABLE IF NOT EXISTS people (
    id SERIAL PRIMARY KEY,
    cpf VARCHAR(11) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
);

CREATE TABLE IF NOT EXISTS internal (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,

    FOREIGN KEY (id) REFERENCES people(id)
);

CREATE TABLE IF NOT EXISTS external (
    id SERIAL PRIMARY KEY,
    phone CHAR(11) NOT NULL,

    FOREIGN KEY (id) REFERENCES people(id)
);
-- parte usuario end
