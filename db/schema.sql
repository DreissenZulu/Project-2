DROP DATABASE IF EXISTS socialAppDB;

CREATE DATABASE socialAppDB;

USE socialAppDB;

CREATE TABLE userInfo (
	id INT auto_increment PRIMARY KEY,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    userName VARCHAR(30) NOT NULL,
    password VARCHAR(200) NOT NULL,
    first_name varchar(30) NOT NULL,
    last_name varchar(30),
    logged_in varchar(10) NOT NULL default false
);

create table otherComments (
	id int auto_increment primary key,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    commentContent varchar(300) not null,
    user_id int not null,
    likes int default 0 not null,
    mbid varchar(30) not null
);

create table playlistComments (
	id int auto_increment primary key,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    commentContent varchar(300) not null,
    user_id int not null,
    likes int default 0 not null,
    playlist_id int not null
);

create table playlist (
    id int auto_increment primary key,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    playlist_name varchar(30) not null,
    playlist_genre varchar(30) not null,
    playlist_description varchar(300) default 'No description',
    likes int default 0 not null,
    user_id int not null
);

create table favPlaylists (
	id int auto_increment primary key,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    likedByID int not null,
    playlist_id int not null,
    fav_status boolean default false
);

-- mbid and song are not unique as a song can be part of multiple playlists
create table playlistSongs (
    id int auto_increment primary key,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    song varchar(30) not null,
    artist varchar(30) not null,
    playlist_id int not null
);