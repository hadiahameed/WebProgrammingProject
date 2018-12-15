# CS-546-Final-Project

Welcome to the Final Project of Group 1! 

Our project is called [The Literary Archives](http://LiteraryArchives.club). It is a website where booklovers can find books, write reviews and add books to their bookshelves. 

Website: http://LiteraryArchives.club

The main parts of the application are:
- Querying the system for books and filtering based on genre/tags
- Bookshelves. Users by default have 3 bookshelves: read, currently reading and want to read. They can create extra bookshelves if they want to. 
- Accounts. To be able to interact with the website a user has to create an account. 
- Timeline. Users can post text, images and videos on their own timeline. Users can follow other users and view their posts in their own timeline. 

## Recommended Environment

* NodeJS version 10, LTS
* MongoDB version 4

## Installation

1. Unzip the archived codebase;
1. Run `npm install`  to install required packages;
2. Unzip the DB `dump.zip`;
3. Run `mongorestore --db literaryArchives dump/literaryArchives` to import data into DB;
4. Run `npm start`;
5. Access `http://localhost:3000`