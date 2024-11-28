const users = [
    { rfid: "0014612206", name: "Niel Alvin Maquilan", studentId: "193", books: [], profileImage: "images/profile_nielalvinmaquilan.jpg" },
    { rfid: "0011193113", name: "Angelica Ramos", studentId: "102", books: [], profileImage: "images/profile_angelicaramos.jpg" },
    { rfid: "0011143242", name: "Constantino Jr. T. Juanillo", studentId: "261", books: [], profileImage: "images/profile_constantinojuanillo.jpg" },
    { rfid: "0011169095", name: "Bernado Cortes Jr.", studentId: "271", books: [], profileImage: "images/profile_bernardocortes.jpg" },
    { rfid: "0002746580", name: "Arvin Galuna Daffon", studentId: "1", books: [], profileImage: "images/profile_jake.jpg" },
    { rfid: "0002783701", name: "Bernardo X Bernardo", studentId: "3", books: [], profileImage: "images/profile_user.jpg" },
    { rfid: "0013654285", name: "Joscoro E Cantero", studentId: "4", books: [], profileImage: "images/profile_cado.jpg" },
    { rfid: "0002773042", name: "Alexander M Co Hat", studentId: "5", books: [], profileImage: "images/profile_tatay.jpg" },
    { rfid: "0005066888", name: "Martin L Martinez", studentId: "6", books: [], profileImage: "images/profile_max.jpg" },
    { rfid: "0014647749", name: "Nonon B Nicolas", studentId: "93", books: [], profileImage: "images/profile_nonon1.jpg" },
    { rfid: "0014646127", name: "JJ Loraine E Daga", studentId: "94", books: [], profileImage: "images/profile_daga1.jpg" },
    { rfid: "0014626916", name: "Lloyd G Perez", studentId: "95", books: [], profileImage: "images/profile_i125.jpg" },
    { rfid: "0010252879", name: "Benjie R Roque", studentId: "96", books: [], profileImage: "images/profile_i759.jpg" }
];

const books = [
    { rfid: "E280699500004007F9B60AB9", title: "Clean Code", author: "Robert C. Martin", ebookAvailable: true },
    { rfid: "E280699500004007F9B5FAB9", title: "Design Patterns", author: "Erich Gamma et al.", ebookAvailable: false },
    { rfid: "E280699500004007F9B5F6B9", title: "Robotics", author: "Beginner's Guide", ebookAvailable: true },
    { rfid: "E280699500005007F9B602B9", title: "Microprocessors", author: "Advanced Applications", ebookAvailable: false },
    { rfid: "E280699500004007F9B606B9", title: "Data Structures", author: "Thomas H. Cormen", ebookAvailable: true },
];

// Handle Search Button Click
function handleSearch() {
    

    const bookInfoDiv = document.getElementById("book-info");

    const rfid = document.getElementById("book-input").value.trim().toUpperCase();
    const book = books.find(b => b.rfid.toUpperCase() === rfid);


    if (book) {
        // Display book details
        bookInfoDiv.innerHTML = `
            <h3>Book Info</h3>
            <p><strong>Title:</strong> ${book.title}</p>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Ebook Available:</strong> ${book.ebookAvailable ? "Yes" : "No"}</p>
        `;
    } else {
        bookInfoDiv.innerHTML = `<p>Book not found. Please scan or search again.</p>`;
    }
}
// Variable to track last scanned RFID for books
let lastScannedBookRfid = "";

// Login Functionality
function handleLogin() {
    let scannedRfid = ""; // Variable to store the scanned RFID

    document.addEventListener("keydown", (event) => {
        const key = event.key;

        if (key === "Enter") {
            const trimmedRfid = scannedRfid.trim();
            const user = users.find((u) => u.rfid === trimmedRfid);

            if (user) {
                sessionStorage.setItem("currentUser", JSON.stringify(user));
                location.href = "dash.html"; // Redirect to dashboard
            } else {
                alert("Invalid RFID. Please try again.");
            }

            scannedRfid = ""; // Reset RFID for next scan
        } else {
            scannedRfid += key; // Append each key to the RFID
        }
    });
}

// Initialize login only on login page
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("login.html")) {
        handleLogin();
    }
});


// Dashboard Logic
function loadDashboard() {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!currentUser) {
        alert("User not logged in. Redirecting to login page.");
        location.href = "login.html";
        return;
    }

    // Display user info
    document.getElementById("welcome-message").innerText = `Welcome, ${currentUser.name}!`;
    document.getElementById("user-name").innerText = currentUser.name;
    document.getElementById("student-id").innerText = `Student ID: ${currentUser.studentId}`;
    document.getElementById("profile-image").src = currentUser.profileImage;

    // Display borrowed books
    const borrowedBooks = currentUser.books.map((bookId) => {
        const book = books.find((b) => b.rfid === bookId);
        return book ? `${book.title} by ${book.author}` : "Unknown Book";
    });
    document.getElementById("borrowed-books").innerText =
        borrowedBooks.length > 0
            ? `You have ${borrowedBooks.length} borrowed book(s): ${borrowedBooks.join(", ")}`
            : "You have no borrowed books.";

    // Option to scan a book
    document.getElementById("book-input-section").style.display = "block";

    function handleScan() {
        // Get the RFID value from the input field
        const rfid = document.getElementById("book-input").value;
    
        // Find the book based on the RFID
        const book = books.find(b => b.rfid === rfid);
    
        // If the book is found, display its details
        if (book) {
            // Display book details
            document.getElementById("book-title").innerText = book.title;
            document.getElementById("book-author").innerText = `Author: ${book.author}`;
            document.getElementById("book-image").src = book.image;
            document.getElementById("book-ebook").innerText = book.hasEbook ? "E-book available" : "No E-book available";
            document.getElementById("book-ebook-link").href = book.hasEbook ? book.ebookUrl : '#';
            document.getElementById("book-owners").innerText = `Previous Owners: ${book.previousOwners.join(', ')}`;
        } else {
            alert("Book not found.");
        }
    }
}

// Borrow Book Logic
function borrowBook() {
    const bookRfid = document.getElementById("book-input").value.trim();
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

    if (bookRfid === lastScannedBookRfid) {
        alert("This book has already been scanned. Please scan a new one.");
        return;
    }

    lastScannedBookRfid = bookRfid;
    const book = books.find((b) => b.rfid === bookRfid);

    if (book) {
        if (!currentUser.books.includes(book.rfid)) {
            currentUser.books.push(book.rfid);
            sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
            alert(`You have successfully borrowed: ${book.title}. Enjoy reading!`);
        } else {
            alert("This book is already borrowed by you.");
        }
    } else {
        alert("Book not found. Please try scanning again.");
    }
}

// Return Book Logic
function returnBook() {
    const bookRfid = document.getElementById("book-input").value.trim();
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

    if (bookRfid === lastScannedBookRfid) {
        alert("This book has already been scanned. Please scan a new one.");
        return;
    }

    lastScannedBookRfid = bookRfid;
    const book = books.find((b) => b.rfid === bookRfid);

    if (book) {
        if (currentUser.books.includes(book.rfid)) {
            currentUser.books = currentUser.books.filter((b) => b !== book.rfid);
            sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
            alert(`Thank you for returning: ${book.title}. Hope you learned something new!`);
        } else {
            alert("This book is not borrowed by you.");
        }
    } else {
        alert("Book not found. Please try scanning again.");
    }
}

let studentData = {}; // Object to store student data

// Pre-fetch student data when the page loads
async function loadStudentData() {
    const spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/YOUR_STUDENT_DATA_SPREADSHEET_ID/export?format=csv'; // Link to student data CSV
    const response = await fetch(spreadsheetUrl);
    const data = await response.text();
    const rows = data.split('\n').map(row => row.trim()).filter(row => row !== ''); // Trim and remove empty rows

    // Process rows and store them in an object
    rows.forEach(row => {
        const columns = row.split(',');
        const id = columns[0].trim();
        const name = columns[1].trim();
        const image = columns[2].trim(); // Profile Image URL
        studentData[id] = { name, image };
    });
}

// Fetch and display student information based on the ID
function fetchStudentInfo(studentID) {
    const studentInfo = studentData[studentID];
    if (studentInfo) {
        const { name, image } = studentInfo;

        // Update the right panel with student details
        document.getElementById('studentName').textContent = name;
        document.getElementById('studentID').textContent = `Student ID: ${studentID}`;
        const studentImageElement = document.getElementById('studentImage');
        studentImageElement.src = image || 'images/profile_placeholder.jpg';
        studentImageElement.style.display = 'block';
    } else {
        document.getElementById('studentName').textContent = 'Student Name will appear here';
        document.getElementById('studentID').textContent = 'Student ID will appear here';
        document.getElementById('studentImage').style.display = 'none';
    }
}

// Handle RFID scan for both book and student data
function handleRFIDScan(event) {
    const code = event.target.value.trim();

    // Determine if the code is for a book or a student
    if (bookData[code]) {
        fetchBookInfo(code); // Fetch book data
    } else if (studentData[code]) {
        fetchStudentInfo(code); // Fetch student data
    }
}

// Call this on page load
window.onload = () => {
    loadBookData();   // Load book data
    loadStudentData(); // Load student data
};


// Dashboard Scan for Book Info
function displayBookInfo() {
    const bookRfid = document.getElementById("book-input").value.trim();
    const book = books.find((b) => b.rfid === bookRfid);

    if (book) {
        document.getElementById("book-info").innerHTML = `
            <h3>Book Info</h3>
            <p>Title: ${book.title}</p>
            <p>Author: ${book.author}</p>
        `;
    } else {
        alert("Book not found. Please scan again.");
    }
}

// Navigation between pages
function navigateToBorrow() {
    location.href = "borrowbook.html";
}

function navigateToReturn() {
    location.href = "returnbook.html";
}
