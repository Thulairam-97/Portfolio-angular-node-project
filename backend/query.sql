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
  `updated_by` varchar(255) DEFAULT NULL,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` varchar(10) DEFAULT 'A'
) 



CREATE TABLE buses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    operator VARCHAR(255) NOT NULL,
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
    updated_by int DEFAULT 1
);

create table passenger_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id int NOT NULL DEFAULT 0,
    email varchar(255) DEFAULT NULL ,
    phone varchar(30) DEFAULT NULL,
    operator VARCHAR(255) NOT NULL,
    bus_number VARCHAR(255) NOT NULL,
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    travel_date DATE NOT NULL,
    seats_selected VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by int DEFAULT 1
);

CREATE TABLE api_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  url VARCHAR(255) NOT NULL,
  user_id INT NOT NULL,
  platform VARCHAR(255),
  data TEXT
);

-- create table login_log (
--     `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
--     `user_id` int DEFAULT NULL,
--     `session_id` varchar(50) DEFAULT NULL,
--     `login_date` datetime DEFAULT NULL,
--     `logout_date` datetime DEFAULT NULL,
--     `ip` varchar(30) DEFAULT NULL,
--     `status` varchar(10) DEFAULT NULL
-- )

