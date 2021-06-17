var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

// router.get('/', async (req, res) => {
//   // res.render('index', { title: 'Express' });
//   const books = await Book.findAll();
//   res.json(books);
// });

// Static files
router.use('/static', express.static('public'));

// Redirects home page to /books

router.get('/', (req, res) => {
  res.redirect('/books');
});

// Shows the full list of books
router.get('/books', async (req, res) => {
  try {
    const books = await Book.findAll();
    res.render('index', { books });
  } catch (err) {
    res.render('error', { error: err });
  }
});

// Shows the create new book form
router.get('/books/new', async (req, res) => {
  res.render('new_book');
});

// Posts a new book to the database
router.post('/books/new', async (req, res) => {
  const book = await Book.create(req.body);
  res.redirect('/books' + createBook.id);
});

// Shows book detail form
router.get('/books/:id', async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render('update_book', { book });
});

// Updates book info in the database
router.post('/books/:id/', async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.update(req.body);
  res.redirect('/books' + book.id);
});

// Finds to Delete book.
router.get('/books/:id/delete', async (req, res) => {
  const book = await Book.book.findByPk(req.params.id);
  res.render();
});

// Deletes a book.
router.post('/books/:id/delete', async (req, res) => {
  const book = await Book.book.findByPk(req.params.id);
  await article.destroy();
  res.render();
});

module.exports = router;
