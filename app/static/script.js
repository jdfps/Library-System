

const amount_container = document.getElementById("book-count");

async function getTotalBooks() {
    console.log("Retrieving Number Of Books");

    try {
        const result = await fetch("http://100.74.27.25:8000/books/count");

        if (!result.ok) {
            throw new Error(`HTTP error! Status: ${result.status}`);
        }

        const data = await result.json();

        amount_container.innerHTML = data.count;

    } catch (error) {
        console.log("Error getting number of books", error);
    }
}

document.addEventListener("DOMContentLoaded", getTotalBooks);



const book_container = document.getElementById("all-books");
async function loadBooks() {
    console.log("Retrieving Books");

    try {
        const result = await fetch("http://100.74.27.25:8000/books");

        if (!result.ok) {
            throw new Error(`HTTP error! Status: ${result.status}`);
        }

        const books = await result.json();

        book_container.innerHTML = "";

        for (const book of books) {
            book_container.innerHTML += `
        <div class="book">
            <p class="book-title">${book.Title}</p>
            <p class="book-author">${book.Author}</p>
            <p class="book-description">${book.Description}</p>

            <button 
                class="book-delete-btn"
                data-title="${book.Title}"
                data-author="${book.Author}">
                🗑 Delete
            </button>
        </div>
    `;
        }

        document.querySelectorAll(".book-delete-btn").forEach(button => {
            button.addEventListener("click", async () => {
                const title = button.dataset.title;
                const author = button.dataset.author;

                const confirmed = confirm(`Delete "${title}" by ${author}?`);
                if (!confirmed) return;

                await deleteBook(title, author);
            });
        });

    } catch (error) {
        console.error("Error loading books:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadBooks);


const addBtn = document.getElementById("add-btn");

addBtn.addEventListener("click", async () => {
    const title = document.getElementById("title-input").value;
    const author = document.getElementById("author-input").value;
    const genre = document.getElementById("genre-input").value;
    const description = document.getElementById("description-area").value;

    const newBook = {
        Title: title,
        Author: author,
        Genre: genre,
        Description: description
    };

    try {
        const response = await fetch("http://100.74.27.25:8000/books", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newBook)
        });

        if (!response.ok) {
            throw new Error("Failed to add book");
        }

        const data = await response.json();
        console.log(data);

        // refresh the page
        loadBooks();
        getTotalBooks();

        // clear input
        document.getElementById("title-input").value = "";
        document.getElementById("author-input").value = "";
        document.getElementById("genre-input").value = "";
        document.getElementById("description-area").value = "";

    } catch (error) {
        console.error("Error adding book:", error);
    }
});



// searching for books
const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", async () => {
    const title = document.getElementById("search-title").value.trim();
    const author = document.getElementById("search-author").value.trim();
    const genre = document.getElementById("search-genre").value.trim();

    try {
        let url = "http://100.74.27.25:8000/books/search?";
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

        book_container.innerHTML = "";

        if (books.length === 0) {
            book_container.innerHTML = `<p class="book-description">No books found.</p>`;
            return;
        }

        for (const book of books) {
            book_container.innerHTML += `
        <div class="book">
            <p class="book-title">${book.Title}</p>
            <p class="book-author">${book.Author}</p>
            <p class="book-description">${book.Description}</p>

            <button 
                class="book-delete-btn"
                data-title="${book.Title}"
                data-author="${book.Author}">
                🗑 Delete
            </button>
        </div>
    `;
        }

    } catch (error) {
        console.error("Error searching books:", error);
    }
});

const deleteBtn = document.getElementById("delete-btn");

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
            `http://100.74.27.25/books/${encodeURIComponent(title)}/${encodeURIComponent(author)}`,
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