

CREATE TABLE user (
    user_id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password TEXT NOT NULL,
    date_joined TIMESTAMP NOT NULL,
    PRIMARY KEY(user_id)
);

CREATE TABLE category ( 
    category_id INT NOT NULL AUTO_INCREMENT,
    category_name VARCHAR(50) NOT NULL,
    PRIMARY KEY(category_id)
);

CREATE TABLE blog_post (
    post_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    category_id INT NOT NULL,
    date_posted TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL,
    report_count INT NOT NULL,
    PRIMARY KEY(post_id),
    FOREIGN KEY(category_id) REFERENCES category(category_id)
);

CREATE TABLE liked (
    post_id INT NOT NULL,
    date_liked TIMESTAMP NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY(post_id),
    FOREIGN KEY(post_id) REFERENCES blog_post(post_id),
    FOREIGN KEY(user_id) REFERENCES user(user_id)
);

CREATE TABLE follows (
    followed_id INT NOT NULL,
    follower_id INT NOT NULL,
    date_of_follow TIMESTAMP NOT NULL,
    PRIMARY KEY(followed_id),
    PRIMARY KEY(follower_id),
    FOREIGN KEY(follower_id) REFERENCES user(user_id),
    FOREIGN KEY(followed_id) REFERENCES user(user_id)
);

CREATE TABLE comments (
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    user_comment TEXT NOT NULL,
    PRIMARY KEY(post_id),
    FOREIGN KEY(post_id) REFERENCES blog_post(post_id),
);

CREATE TABLE saved (
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    date_saved TIMESTAMP NOT NULL,
    PRIMARY KEY(user_id),
    FOREIGN KEY(user_id) REFERENCES user(user_id)
    FOREIGN KEY(post_id) REFERENCES blog_post(post_id),
);
