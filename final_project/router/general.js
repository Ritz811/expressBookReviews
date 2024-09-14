const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Register a new user
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: 
            "User successfully registered, you can now login."});
      } else {
        return res.status(404).json({message: 
            "User already exists, please try again with a different username."});    
      }
    } 
    return res.status(404).json({message: 
        "A error ocurred when trying to register user, please try again."});
});

// Get the book list available in the shop
//public_users.get('/',function (req, res) {
  //  res.send(JSON.stringify(books,null,10));
//});

// Task 10: Get the list of books available in the shop
// by async/await
public_users.get('/', async function (req, res) {
    let bookList = await getBooksPromise(books);
    res.send(bookList);
});

// Get book details based on ISBN
//public_users.get('/isbn/:isbn',function (req, res) {
  //  const isbn = req.params.isbn;
    //res.send(books[isbn]);
 //});

 //Task 11: Get book details based on ISBN by Promise
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    getBooksPromise(books[isbn])
    .then(
        result => res.send(result),
        error => res.send(error)
    )
 });
  
// Get book details based on author
//public_users.get('/author/:author',function (req, res) {
  //const author = req.params.author;
  //let book = [];
  //Object.keys(books).forEach(i => {
    //if(books[i].author === author) {
     //   book.push(books[i])
    //}
//});
  //  res.send(book);
//});
//Task 12: Get book details based on author by async/await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    let book = [];
    let bookList = await getBooksPromise(books);

    Object.keys(bookList).forEach(i => {
        if(bookList[i].author == author){
            book.push(books[i])
        }
    });
    res.send(book);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let book = [];
    Object.keys(books).forEach(i => {
      if(books[i].title === title) {
          book.push(books[i])
      }
  });
      res.send(book);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews)
});

module.exports.general = public_users;
