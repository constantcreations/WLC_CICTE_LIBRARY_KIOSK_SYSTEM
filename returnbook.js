// Mock user and book data
const users = [
    { rfid: "0011143242", name: "Niel Alvin Maquilan", studentId: "193", books: ["Clean Code", "Robotics"] },
    { rfid: "67890", name: "Maria Clara", studentId: "102", books: ["Design Patterns"] },
    { rfid: "11223", name: "Jose Rizal", studentId: "101", books: ["Microprocessors"] },
    { rfid: "44556", name: "Andres Bonifacio", studentId: "106", books: [] },
];

const books = [
    { code: "E280699500004007F9B5FAB9", title: "Clean Code", author: "Robert C. Martin" },
    { code: "BOOK456", title: "Design Patterns", author: "Erich Gamma et al." },
    { code: "BOOK789", title: "Robotics", author: "Beginner's Guide" },
    { code: "BOOK101", title: "Microprocessors", author: "Advanced Applications" },
];

// Function to simulate returning a book
function returnBook(bookCode) {
    // Replace this with the current user's data (e.g., based on RFID from login)
    const currentUser = users.find(user => user.rfid === "0011143242");

    if (!currentUser) {
        alert("Error: User not recognized.");
        return;
    }

    // Check if the book is in the user's borrowed list
    const borrowedIndex = currentUser.books.findIndex(book => books.some(b => b.code === bookCode && b.title === book));

    if (borrowedIndex > -1) {
        const returnedBook = currentUser.books.splice(borrowedIndex, 1); // Remove the book from the borrowed list
        alert(`Success! You have returned "${returnedBook[0]}". Thank you!`);
    } else {
        alert("This book was not borrowed by you or does not exist.");
    }
}

// Listen for input in the book return field
document.getElementById('bookReturnInput').addEventListener('input', function() {
    const bookCode = this.value.trim();

    if (bookCode) {
        returnBook(bookCode); // Attempt to return the book
        this.value = ""; // Clear the input field after scanning
    }
});
