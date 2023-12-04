CREATE DATABASE MetaHub;

CREATE table Pictures (
pictureId int auto_increment primary key,
pictureName varchar(100) not null unique,
pictureDescription json not null
);

CREATE table PDF (
pdfId int auto_increment primary key,
pdfName varchar(100) not null unique,
pdfDescription json not null
);

CREATE table Audio (
audioId int auto_increment primary key,
audioName varchar(100) not null unique,
audioDescription json not null
);

CREATE table Documents (
documentId int auto_increment primary key,
documentName varchar(100) not null unique,
documentDescription json not null
);
