const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
 //take username and password from request body
 const username = req.body.username;
 const password = req.body.password;
 //check if username is valid
 if(username && password) {
   //check if username is already taken
   if(!isValid(username)) {
     return res.status(400).json({message: "Username already taken"});
   } else {
     //add username and password to users object
     users.push({username: username, password: password});
     return res.status(200).json({message: "User registered successfully"});
   }
 } else {
   return res.status(400).json({message: "Invalid username"});
 }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 3)));
      });
        get_books.then(() =>  console.log("Promise for Task 10 resolved"));
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const get_book_isbn = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        const book = books[isbn];
        if(book) {
          resolve(res.send(book));
        } 
    
        reject(res.status(404).json({messgae:"ISBN not found"}));
    
        get_book_isbn.then(function() {
          console.log("Promise for Task 11 resolved");
        }).catch(function() {
          console.log("Promise for Task 11 rejected");
        });
     });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
        const get_book_author = new Promise((resolve, reject) => {
            let booksbyauthor = [];
            let isbns = Object.keys(books);
            isbns.forEach((isbn) => {
              if(books[isbn].author === author) {
                booksbyauthor.push({"isbn":isbn,
                "title":books[isbn]["title"],
                "reviews":books[isbn]["reviews"]});
                resolve(res.send(JSON.stringify({booksbyauthor}, null, 3)));
              }
            });
            reject(res.status(404).json({messgae:"Author not found"}));
          });
          get_book_author.then(function() {
            console.log("Promise for Task 12 resolved");
          }
          ).catch(function() {
            console.log("Promise for Task 12 rejected");
          }
          );
        });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const number = Object.values(books).filter((book) => book.title === title);
    const anotherNumber = {"booktbytitle" : number}
      if(anotherNumber){
          res.status(200).json(anotherNumber);
      } else {
          res.status(404).json({messgae:"Title not found"});
      }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const review = books[isbn].reviews;
  
    if(review) {
        res.send(review);
    } else {
        res.status(404).json({messgae:"Review not found"});
    }
});

module.exports.general = public_users;
