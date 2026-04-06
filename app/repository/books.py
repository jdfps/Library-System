from ..db import books_collection
from ..schemas import Book, ShowBook
from typing import List
from fastapi import HTTPException, status


# get all books
async def get_all_books():

    books = []  # create empty book tuple

    # loop through the book_collections array in db.py which holds all the books
    async for book in books_collection.find():
        books.append(book)

    return books


# return book by title
async def get_book_title(title: str):
    book = await books_collection.find_one({"Title": title})

    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    return book


# delete book
async def del_book(title: str, author: str):
    print("User Deleting Book!")
    # find the book in the book collection & delete it
    book = await books_collection.find_one({"Title": title, "Author": author})
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{title} by {author} Not Found In Database",
        )
    print(f"deleting book w/ book id: {book["_id"]}")
    await books_collection.delete_one({"_id": book["_id"]})
    return f"{title} by {author} deleted successfully"


# return books by author
# return books by genre


# add books ()
async def add_book(book: Book):

    existing_book = await books_collection.find_one(
        {"Title": book.Title}, {"Author": book.Author}
    )
    if existing_book:
        raise HTTPException(status_code=400, detail="Book already exists")

    result = await books_collection.insert_one(book.model_dump())
    return {"message": f"{book.Title} added successfully"}


async def get_amount():
    count = await books_collection.count_documents({})
    return {"count": count}
