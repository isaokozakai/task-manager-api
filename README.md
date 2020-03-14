# Task Manager API

This is an API to manage tasks.

## Purpose
I wanted to make an API to manage tasks to do.

## Features
 - You can register by user name, password and email address.
 - You can login with password and email address.
 - You can get tasks all the tasks that you have.
 - You can get a specific task by id.
 - You can create tasks, and edit and delete them.
 
 # Data Structure
```
    .
    ├── users
    |     ├── _id
    |     ├── name
    |     ├── email
    |     ├── age
    |     ├── password
    |     ├── tokens
    |     └── avatar
    └── items
          ├── _id
          ├── description
          ├── completed
          └── owner
```
 
 ## Technologies
 - Node.js
 - Express
 - MongoDB
 - SendGrid
 - JSON Web Token
