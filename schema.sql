drop database if exists bamazonDB;

create database bamazonDB;

use bamazonDB;

create table products (
	item_id int not null auto_increment,
    product_name varchar(50),
    department_name varchar(50),
    price decimal(10,2),
    stock int not null,
    primary key (item_id)
    );