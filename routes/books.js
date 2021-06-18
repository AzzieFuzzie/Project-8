var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

// router.get('/', async (req, res) => {
//   // res.render('index', { title: 'Express' });
//   const books = await Book.findAll();
//   res.json(books);
// });

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  };
}

// Static files
router.use('/static', express.static('public'));

// Redirects home page to /books

router.get('/', (req, res) => {
  res.redirect('/books');
});

// Shows the full list of books
router.get(
  '/books',
  asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    res.render('index', { books });
    res.render('error', { error: err });
  })
);

// Shows the create new book form
router.get(
  '/books/new',
  asyncHandler(async (req, res) => {
    res.render('new_book');
  })
);

// Posts/Creates a new book to the database
router.post(
  '/books/new',
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect('/books');
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        book = await Book.build(req.body);
        res.render('new_book', {
          book,
          errors: error.errors,
          author: 'New Book',
          title: 'New Book',
        });
      } else {
        throw error; // error caught in the asyncHandler's catch block
      }
    }
  })
);

// Shows book detail form
router.get(
  '/books/:id',
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render('update_book', { book, title: book.title });
  })
);

// Updates book info in the database
router.post(
  '/books/:id',
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    res.redirect('/books');
  })
);

// Finds to Delete book.
router.get(
  '/books/:id/delete',
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render('delete', { book, title: book.title });
  })
);

// Deletes a book.
router.post(
  '/books/:id/delete',
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect('/books');
  })
);

module.exports = router;