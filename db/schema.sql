DROP DATABASE IF EXISTS socialAppDB;

CREATE DATABASE socialAppDB;

USE socialAppDB;

-- 64 character password to accomodate password encryption
CREATE TABLE userInfo (
    id int auto_increment primary key,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    userName VARCHAR(30) NOT NULL,
    password VARCHAR(64) NOT NULL,
    first_name varchar(30) NOT NULL,
    last_name varchar(30)
);

-- mbid refers to a song or album the comment is associated with, pulled from the last fm API
create table allComments (
    id int auto_increment primary key,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    commentContent varchar(300) not null,
    user_id int not null,
    likes int default 0 not null,
    playlist_id varchar(30) not null
);

create table playlist (
    id int auto_increment primary key,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    playlist_name varchar(30) not null,
    playlist_genre varchar(30) not null,
    likes int default 0 not null,
    user_id int not null
);

-- mbid and song are not unique as a song can be part of multiple playlists
create table playlistSongs (
    id int auto_increment primary key,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mbid varchar(50) not null,
    song varchar(30) not null,
    playlist_id int not null
);