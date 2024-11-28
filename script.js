let bookData = {}; // Object to store book data

// Pre-fetch the book data when the page loads
async function loadBookData() {
    const spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1SUvetZptrSWVz04qkQfj9n2NbfjcsohOFZRSmnXs5Rw/export?format=csv'; // Google Sheets CSV link
    const response = await fetch(spreadsheetUrl);
    const data = await response.text();
    const rows = data.split('\n').map(row => row.trim()).filter(row => row !== ''); // Trim and remove empty rows

    // Process the rows and store them in an object
    rows.forEach(row => {
        const columns = row.split(',');
        const id = columns[0].trim();
        const name = columns[1].trim();
        const image = columns[2].trim();
        bookData[id] = { name, image: `images/${image}` }; // Assuming images are in the "images" folder
    });
}

// Fetch book information based on the book code
function fetchBookInfo(bookCode) {
    // Display "Loading..." immediately
    displayBookInfo('Loading...', '');

    // Look for the book in the pre-loaded data
    if (bookData[bookCode]) {
        // Book found, update the UI
        const { name, image } = bookData[bookCode];
        displayBookInfo(name, image);
    } else {
        // Book not found, just keep "Loading..."
        displayBookInfo('Book not found', '');
    }
}

// Function to update book information on the page
function displayBookInfo(bookName, bookImage) {
    const bookNameElement = document.getElementById('bookName');
    const bookImageElement = document.getElementById('bookImage');

    // Update book name and image
    bookNameElement.textContent = bookName;
    if (bookImage) {
        bookImageElement.src = bookImage;
        bookImageElement.style.display = 'block';
    } else {
        bookImageElement.style.display = 'none';
    }
}

// Handle book code input
function handleScan(event) {
    const bookCode = event.target.value.trim();
    if (bookCode) {
        // Clear any previous "Book not found" message before making a new request
        displayBookInfo('Loading...', '');
        fetchBookInfo(bookCode);
    }
}

// Load the book data when the page loads
window.onload = loadBookData;
