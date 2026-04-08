from fastapi import APIRouter
from ..schemas import Book, ShowBook
from typing import List

from fastapi import APIRouter, Query


from ..repository import books


router = APIRouter(tags=["Books"])


# add books
@router.post("/books")
async def create(book: Book):
    return await books.add_book(book)


@router.get("/books/count")
async def get_book_count():
    return await books.get_amount()


# get all books
@router.get("/books", response_model=List[ShowBook])
async def all():
    return await books.get_all_books()


# delete books
@router.delete("/books/{title}/{author}")
async def delete_book(title: str, author: str):
    return await books.del_book(title, author)


@router.get("/books/search", response_model=List[ShowBook])
async def search(
    title: str | None = Query(default=None),
    author: str | None = Query(default=None),
    genre: str | None = Query(default=None),
):
    return await books.search_books(title, author, genre)
