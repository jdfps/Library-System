from pydantic import BaseModel


class Book(BaseModel):
    ISBN: str
    Title: str
    Author: str
    Genre: str
    Description: str


class ShowBook(BaseModel):
    Title: str
    Author: str
    Genre: str
    ISBN: str
    Description: str

    class Config:
        orm_mode = True
