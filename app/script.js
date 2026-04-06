

const amount_container = document.getElementById("book-count");

async function getTotalBooks() {
    console.log("Retrieving Number Of Books");

    try {
        const result = await fetch("http://127.0.0.1:8000/books/count");

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
        const result = await fetch("http://127.0.0.1:8000/books");

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
                </div>
            `;
        }

    } catch (error) {
        console.error("Error loading books:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadBooks);