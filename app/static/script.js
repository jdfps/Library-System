const amount_container = document.getElementById("book-count");
const book_container = document.getElementById("all-books");
const addBtn = document.getElementById("add-btn");
const searchBtn = document.getElementById("search-btn");
const deleteBtn = document.getElementById("delete-btn");

const BASE_URL = "http://100.74.27.25:8000";

// GLOBAL STATE (must be at top)
let editingBook = null;


const formHeader = document.getElementById("form-header");

async function getTotalBooks() {
    console.log("Retrieving Number Of Books");

    try {
        const result = await fetch(`${BASE_URL}/books/count`);

        if (!result.ok) {
            throw new Error(`HTTP error! Status: ${result.status}`);
        }

        const data = await result.json();
        amount_container.innerHTML = data.count;
    } catch (error) {
        console.log("Error getting number of books", error);
    }
}


function attachBookButtonListeners() {
    document.querySelectorAll(".book-delete-btn").forEach((button) => {
        button.addEventListener("click", async () => {
            const title = button.dataset.title;
            const author = button.dataset.author;

            const confirmed = confirm(`Delete "${title}" by ${author}?`);
            if (!confirmed) return;

            await deleteBook(title, author);
        });
    });

    document.querySelectorAll(".book-edit-btn").forEach((button) => {
        button.addEventListener("click", () => {
            document.getElementById("title-input").value = button.dataset.title;
            document.getElementById("author-input").value = button.dataset.author;
            document.getElementById("genre-input").value = button.dataset.genre;
            document.getElementById("description-area").value = button.dataset.description;

            editingBook = {
                title: button.dataset.title,
                author: button.dataset.author
            };

            addBtn.textContent = "Update Book";
            formHeader.textContent = "🩷 Update A Book";
            console.log("Editing:", editingBook);
        });
    });
}

function renderBooks(books) {
    book_container.innerHTML = "";

    if (books.length === 0) {
        book_container.innerHTML = `<p class="book-description">No books found.</p>`;
        return;
    }

    for (const book of books) {
        const title = book.Title || book.title;
        const author = book.Author || book.author;
        const genre = book.Genre || book.genre;
        const description = book.Description || book.description;

        book_container.innerHTML += `
<div class="book">
    <button 
        class="book-btn book-edit-btn"
        data-title="${title}"
        data-author="${author}"
        data-genre="${genre}"
        data-description="${description}">
        ✏️ Edit
    </button>

    <button 
        class="book-btn book-delete-btn"
        data-title="${title}"
        data-author="${author}">
        🗑 Delete
    </button>

    <p class="book-title">${title}</p>
    <p class="book-author">${author}</p>
    <p class="book-description">${description}</p>
</div>
`;
    }

    attachBookButtonListeners();
}

async function loadBooks() {
    console.log("Retrieving Books");

    try {
        const result = await fetch(`${BASE_URL}/books`);

        if (!result.ok) {
            throw new Error(`HTTP error! Status: ${result.status}`);
        }

        const books = await result.json();
        console.log("BOOKS FROM API:", books);
        console.log("FIRST BOOK:", books[0]);

        renderBooks(books);
    } catch (error) {
        console.error("Error loading books:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    editingBook = null; // force reset

    addBtn.textContent = "Add Book"; // force correct button text

    document.getElementById("title-input").value = "";
    document.getElementById("author-input").value = "";
    document.getElementById("genre-input").value = "";
    document.getElementById("description-area").value = "";

    getTotalBooks();
    loadBooks();
});

addBtn.addEventListener("click", async () => {
    const title = document.getElementById("title-input").value.trim();
    const author = document.getElementById("author-input").value.trim();
    const genre = document.getElementById("genre-input").value.trim();
    const description = document.getElementById("description-area").value.trim();

    if (!title || !author || !genre || !description) {
        alert("Please fill out all book fields.");
        return;
    }

    const newBook = {
        Title: title,
        Author: author,
        Genre: genre,
        Description: description
    };

    try {
        let response;

        if (editingBook) {
            response = await fetch(
                `${BASE_URL}/books/${encodeURIComponent(editingBook.title)}/${encodeURIComponent(editingBook.author)}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newBook)
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update book");
            }

            editingBook = null;
            addBtn.textContent = "Add";
        } else {
            response = await fetch(`${BASE_URL}/books`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newBook)
            });

            if (!response.ok) {
                throw new Error("Failed to add book");
            }
        }

        const data = await response.json();
        console.log(data);

        loadBooks();
        getTotalBooks();

        document.getElementById("title-input").value = "";
        document.getElementById("author-input").value = "";
        document.getElementById("genre-input").value = "";
        document.getElementById("description-area").value = "";
    } catch (error) {
        console.error("Error saving book:", error);
    }
});

// searching for books
searchBtn.addEventListener("click", async () => {
    const title = document.getElementById("search-title").value.trim();
    const author = document.getElementById("search-author").value.trim();
    const genre = document.getElementById("search-genre").value.trim();

    try {
        let url = `${BASE_URL}/books/search?`;
        const params = new URLSearchParams();

        if (title) params.append("title", title);
        if (author) params.append("author", author);
        if (genre) params.append("genre", genre);

        url += params.toString();

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const books = await response.json();
        renderBooks(books);
    } catch (error) {
        console.error("Error searching books:", error);
    }
});

deleteBtn.addEventListener("click", async () => {
    const title = document.getElementById("delete-title").value.trim();
    const author = document.getElementById("delete-author").value.trim();

    if (!title || !author) {
        alert("Enter both title and author to delete a book.");
        return;
    }

    const confirmed = confirm(`Delete "${title}" by ${author}?`);
    if (!confirmed) return;

    await deleteBook(title, author);

    document.getElementById("delete-title").value = "";
    document.getElementById("delete-author").value = "";
    document.getElementById("delete-genre").value = "";
});

async function deleteBook(title, author) {
    console.log("Deleting book:", title, author);

    try {
        const response = await fetch(
            `${BASE_URL}/books/${encodeURIComponent(title)}/${encodeURIComponent(author)}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error(`Delete failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        loadBooks();
        getTotalBooks();
    } catch (error) {
        console.error("Error deleting book:", error);
    }
}