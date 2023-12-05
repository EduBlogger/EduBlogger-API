-- Active: 1679323426294@@127.0.0.1@5432@edublogger@public


CREATE TABLE users (
    user_id SERIAL NOT NULL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    bio VARCHAR(100),
    user_profile_image TEXT,
    date_joined TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE category ( 
    category_id SERIAL NOT NULL PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL
);

CREATE TABLE blog_post (
    post_id SERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    category_id INT NOT NULL REFERENCES category(category_id),
    blog_banner TEXT ,
    user_id INT NOT NULL REFERENCES users(user_id),
    date_posted TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) NOT NULL
);

CREATE TABLE liked (
    post_id INT NOT NULL REFERENCES blog_post(post_id),
    date_liked TIMESTAMP DEFAULT NOW(),
    user_id INT NOT NULL REFERENCES users(user_id)
);

CREATE TABLE follows (
    followed_id INT NOT NULL REFERENCES users(user_id),
    follower_id INT NOT NULL REFERENCES users(user_id),
    date_of_follow TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE comments (
    post_id INT NOT NULL REFERENCES blog_post(post_id),
    user_id INT NOT NULL REFERENCES users(user_id),
    user_comment TEXT NOT NULL,
    date_comment TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE saved (
    user_id INT NOT NULL REFERENCES users(user_id),
    post_id INT NOT NULL REFERENCES blog_post(post_id),
    date_saved TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE reports (
    report_id SERIAL NOT NULL ,
    user_id INT NOT NULL REFERENCES users(user_id),
    report_content VARCHAR(100) NOT NULL,
    post_id INT NOT NULL REFERENCES blog_post(post_id),
    date TIMESTAMP DEFAULT NOW()
);


CREATE TABLE activity (
    act_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    date_time TIMESTAMP DEFAULT NOW(),
    activity_info TEXT NOT NULL ,
    activity VARCHAR(50) NOT NULL
);

CREATE TABLE login_log (
    log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    date_time TIMESTAMP DEFAULT NOW(),
    attempt VARCHAR(50) NOT NULL
);

CREATE TABLE register_log (
    log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    date_time TIMESTAMP DEFAULT NOW()
);


