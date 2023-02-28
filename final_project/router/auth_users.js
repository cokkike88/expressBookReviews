const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  //write code to check is the username is valid
  const user = users.find(e => e.username === username);
  if(user) return false;
  return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  const user = users.filter(x => x.username == username && x.password == password);
  if(user.length > 0) return true;
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if(!username || !password) return res.status(404).json({message: "Error logging in"});

  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60*60});

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User successfully logged in");
  }

  return res.status(208).json({message: 'Invalid Login. Check username and password'});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const review = req.query.review;
  const isbn = req.params.isbn;

  if(req.session.authorization){
    const username = req.session.authorization.username;
    const book = books[isbn];
    console.log(book);
    console.log(books);
    if(book){
      let reviews = book.reviews;
      reviews[username] = review;
      return res.status(200).send(book);
    }

    return res.status(404).json({message: 'book no found'});
  }


  return res.status(403).json({message: "User not logged in"})
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if(req.session.authorization){
    const username = req.session.authorization.username;
    const book = books[isbn];
    console.log(book);
    console.log(books);
    if(book){
      delete book.reviews[username];
      return res.status(200).send(book);
    }

    return res.status(404).json({message: 'book no found'});
  }


  return res.status(403).json({message: "User not logged in"})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
