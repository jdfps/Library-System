from pydantic import BaseModel


class Book(BaseModel):
    Title: str
    Author: str
    Genre: str
    Description: str


class ShowBook(BaseModel):
    Title: str
    Author: str
    Genre: str
    Description: str

    class Config:
        from_attributes = True
