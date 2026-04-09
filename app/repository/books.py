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
    print(f"deleting book w/ book id: {book['_id']}")
    await books_collection.delete_one({"_id": book["_id"]})
    return f"{title} by {author} deleted successfully"


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


from ..db import books_collection
from ..schemas import Book, ShowBook
from fastapi import HTTPException, status


# search books
async def search_books(title: str = None, author: str = None, genre: str = None):
    query = {}

    if title:
        query["Title"] = {"$regex": title, "$options": "i"}

    if author:
        query["Author"] = {"$regex": author, "$options": "i"}

    if genre:
        query["Genre"] = {"$regex": genre, "$options": "i"}

    books = []

    async for book in books_collection.find(query):
        books.append(book)

    return books


# update book
async def update_book(old_title: str, old_author: str, updated_book: Book):

    print("User Updating Book!")

    existing_book = await books_collection.find_one(
        {"Title": old_title, "Author": old_author}
    )

    if not existing_book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{old_title} by {old_author} not found in database",
        )

    await books_collection.update_one(
        {"_id": existing_book["_id"]},
        {
            "$set": {
                "Title": updated_book.Title,
                "Author": updated_book.Author,
                "Genre": updated_book.Genre,
                "Description": updated_book.Description,
            }
        },
    )

    return {"message": f"{old_title} by {old_author} updated successfully"}
