const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  
  if (!username || !password) return res.status(400).json({message: "The username or password are missing"});
  if (!isValid(username)) return res.status(400).json({message: "This username already exists"});

  users.push({username, password});
  console.log(users);

  return res.status(200).json({message: "User created"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const bookString = JSON.stringify(books);
  return res.status(200).send(bookString);
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if(book){
    return res.status(200).json(book);
  }
  return res.status(404).send({message: "Book no found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let bookResponse = [];
  for(const key in books){
    const book = books[key];
    if(author === book.author){
      bookResponse.push(book);
      
    }
  }
  if(bookResponse.length > 0) return res.status(200).json(bookResponse);    
  return res.status(404).json({message: "Book no found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let bookResponse = [];
  for(const key in books){
    const book = books[key];
    if(title === book.title){
      bookResponse.push(book);      
    }
  }
  if(bookResponse.length > 0) return res.status(200).json(bookResponse);    
  return res.status(404).json({message: "Book no found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if(book){
    return res.status(200).send(book.reviews);
  }
  return res.status(404).json({message: "Book no found"});
});


const task10 = async(req, res) => {

  try{
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).send(books);
  }
  catch(error){
    return res.status(500).json({message: 'Error to get the book list.'})
  }

}

const task11 = async(isbn) => {

  try{
    const bookResponse = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return bookResponse;
  }
  catch(error){
    console.log(error);
  }

}

const task12 = async(author) => {

  try{
    const bookResponse = await axios.get(`http://localhost:5000/author/${author}`);
    return bookResponse;
  }
  catch(error){
    console.log(error);
  }

}

const task13 = async(title) => {

  try{
    const bookResponse = await axios.get(`http://localhost:5000/title/${title}`);
    return bookResponse;
  }
  catch(error){
    console.log(error);
  }

}


module.exports.general = public_users;
