DROP DATABASE IF EXISTS socialAppDB;

CREATE DATABASE socialAppDB;

USE socialAppDB;

CREATE TABLE userInfo (
	id INT auto_increment PRIMARY KEY,
    userName VARCHAR(30) NOT NULL,
    password VARCHAR(256) NOT NULL,
    first_name varchar(30) NOT NULL,
    last_name varchar(30)
);

create table allComments (
	id int auto_increment primary key,
    commentContent varchar(300) not null,
    user_id int not null,
    likes int default 0 not null,
    mbid varchar(30) not null
);