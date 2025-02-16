DROP DATABASE IF EXISTS diabetes_db;

CREATE DATABASE diabetes_db;
USE diabetes_db;


CREATE TABLE IF NOT EXISTS users(
    user_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(400) NOT NULL,
    passwordChangedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    role ENUM('patient','doctor','pharmacy','admin') NOT NULL default 'patient',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) DEFAULT 'not set',
    number VARCHAR(50) DEFAULT 'not set',
    photo VARCHAR(255) DEFAULT 'not set',
    date_of_birth DATE NOT NULL,
    map_link VARCHAR(255) NOT NULL DEFAULT 'not set',
    cover_photo VARCHAR(255) DEFAULT 'not set',
    email VARCHAR(255) DEFAULT 'not set',
    address VARCHAR(255) DEFAULT 'not set'
);
CREATE TABLE IF NOT EXISTS user_review(
    review_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    review_rating Decimal(2,1) NOT NULL,
    review_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);


CREATE TABLE IF NOT EXISTS books(
    book_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    book_created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    book_title VARCHAR(50) NOT NULL,
    book_desc VARCHAR(2000) NOT NULL DEFAULT 'not set',
    book_summary VARCHAR(1500) NOT NULL DEFAULT 'not set',
    book_url VARCHAR(255) NOT NULL DEFAULT 'not set',
    book_photo VARCHAR(255) NOT NULL DEFAULT 'not set',
    admin_id INT NOT NULL ,
    FOREIGN KEY (admin_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS book_review(
    review_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    review_rating Decimal(2,1) NOT NULL,
    review_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id)
);

CREATE TABLE IF NOT EXISTS book_comments(
    comment_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    comment_content VARCHAR(2000)not NULL,
    comment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id)
);

CREATE TABLE IF NOT EXISTS meds(
    med_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    med_created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    med_name VARCHAR(50) NOT NULL,
    med_price INTEGER not NULL,
    med_photo VARCHAR(255) NOT NULL DEFAULT 'not set',
    med_summary VARCHAR(500) NOT NULL DEFAULT 'not set',
    med_cat VARCHAR(500) NOT NULL DEFAULT 'not set',
    pharm_id INT NOT NULL ,
    FOREIGN KEY (pharm_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS med_review(
    review_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    review_rating Decimal(2,1) NOT NULL,
    review_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    med_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (med_id) REFERENCES meds(med_id)
);

CREATE TABLE IF NOT EXISTS med_comments(
    comment_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    comment_content VARCHAR(2000)not NULL,
    comment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    med_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (med_id) REFERENCES meds(med_id)
);



CREATE TABLE IF NOT EXISTS categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS recipes (
    recipe_id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_name VARCHAR(100) NOT NULL,
    instructions TEXT,
    recipe_carb INT NOT NULL ,
    category_id INT,
    admin_id INT,
    FOREIGN KEY (recipe_id) REFERENCES users(user_id ),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE IF NOT EXISTS ingredients (
    ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
    ingredient_carb INT NOT NULL,
    ingredient_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
    recipe_id INT,
    ingredient_id INT,
    quantity VARCHAR(50),
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id),
    PRIMARY KEY (recipe_id, ingredient_id)
);

CREATE TABLE IF NOT EXISTS recipe_review(
    review_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    review_rating Decimal(2,1) NOT NULL,
    review_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id)
);

CREATE TABLE IF NOT EXISTS recipe_comments(
    comment_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    comment_content VARCHAR(2000)not NULL,
    comment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id)
);




CREATE TABLE IF NOT EXISTS chats (
    chat_id INT AUTO_INCREMENT PRIMARY KEY,
    chat_name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    chat_id INT,
    message TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (chat_id) REFERENCES chats(chat_id)
);





