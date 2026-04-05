from fastapi import APIRouter
from ..schemas import Book, ShowBook
from typing import List


from ..repository import books


router = APIRouter(tags=["Books"])


# add books
@router.post("/books")
async def create(book: Book):
    return await books.add_book(book)


# get all books
@router.get("/books", response_model=List[ShowBook])
async def all():
    return await books.get_all_books()


# return book by ISBN
@router.get("/books/{ISBN}", response_model=ShowBook)
async def get_isbn(ISBN: str):
    return await books.get_book_isbn(ISBN)


# return book by title
@router.get("/books/{title}", response_model=ShowBook)
async def get_title(title: str):
    return await books.get_book_title(title)


# delete books
@router.delete("/books/{title}/{author}")
async def delete_book(title: str, author: str):
    return await books.del_book(title, author)


# return books by author
# return books by genre
