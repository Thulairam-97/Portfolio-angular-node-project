create database portfolio;
use portfolio;

create table users (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `email` varchar(255) DEFAULT NULL Unique,
  `password` varchar(100) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `role` varchar(30) DEFAULT NULL,
  `entered_by` int DEFAULT NULL,
  `entered_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` varchar(10) DEFAULT 'A'
) 

insert into users (email,password,name,phone,entered_by,entered_date,updated_by,status) values ('thulasi@gmail.com','12345','Thulasi','7708735444','1',now(),'1','A');


CREATE TABLE buses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_number VARCHAR(255) NOT NULL,
    starting_point VARCHAR(255) NOT NULL,
    ending_point VARCHAR(255) NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    travel_date DATE NOT NULL,
    seats_available INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by int DEFAULT 1,
);

create table login_log (
    `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` int DEFAULT NULL,
    `session_id` varchar(50) DEFAULT NULL,
    `login_date` datetime DEFAULT NULL,
    `logout_date` datetime DEFAULT NULL,
    `ip` varchar(30) DEFAULT NULL,
    `status` varchar(10) DEFAULT NULL
)


CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(15),
    source VARCHAR(100),
    destination VARCHAR(100),
    date DATE
);
