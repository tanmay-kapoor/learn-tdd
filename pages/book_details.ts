import { Response } from 'express';
import Book, { IBook }  from '../models/book';
import BookInstance, { IBookInstance }  from '../models/bookinstance';


// Function to get a book by ID
async function getBook(id: string): Promise<IBook | null> {
  if (typeof id !== 'string') {
    return null;
  }
  return Book.findOne({ _id: id }).populate('author').exec();
}

// Function to get book details
async function getBookDtl(id: string): Promise<IBookInstance[] | null> {
  if (typeof id !== 'string') {
    return null;
  }
  return BookInstance.find({ book: id }).select('imprint status').exec();
}

// Function to handle showing book details
export const showBookDtls = async (res: Response, id: string): Promise<void> => {
  try {
    const [book, copies] = await Promise.all([
      getBook(id),
      getBookDtl(id)
    ]);

    console.log("book", book);
    console.log("copies", copies);
    
    if (!book) {
      res.status(404).send(`Book ${id} not found`);
      return;
    }

    if(!copies) {
      res.status(404).send(`Book details not found for book ${id}`);
      return;
    }

    res.send({
      title: book.title,
      author: book.author.name,
      copies: copies
    });
  } catch (err) {
    res.status(500).send(`Error fetching book ${id}`);
  }
};