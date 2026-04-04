from fastapi import FastAPI
from .db import books_collection
from .schemas import Book

app = FastAPI()


@app.post("/books")
async def add_book(book: Book):
    result = await books_collection.insert_one(book.model_dump())

    return {"message": "Book added successfully", "id": str(result.inserted_id)}
