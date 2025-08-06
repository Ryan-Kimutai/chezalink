ALTER TABLE profile
RENAME TO player_profile;
ALTER TABLE player_profile
DROP COLUMN account_type;

CREATE TABLE profile(
    user_name VARCHAR(255) PRIMARY KEY,
    account_type VARCHAR(45) NOT NULL,
    CONSTRAINT fk_profile_user FOREIGN KEY(user_name) REFERENCES accounts(user_name)
);

CREATE TABLE scout_profile(
    user_name VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    bio VARCHAR(255),
    county VARCHAR(255),
    date_of_birth DATE,
    institution VARCHAR(255) NOT NULL,
    CONSTRAINT fk_profile_user FOREIGN KEY(user_name) REFERENCES accounts(user_name)
);

CREATE TABLE institution(
    user_name VARCHAR(255) PRIMARY KEY,
    institution_name VARCHAR(100) NOT NULL,
    county VARCHAR(255),
    institution_type VARCHAR(45) NOT NULL,
    CONSTRAINT fk_profile_user FOREIGN KEY(user_name) REFERENCES accounts(user_name)
);
ALTER TABLE institution RENAME TO institutions_profile;