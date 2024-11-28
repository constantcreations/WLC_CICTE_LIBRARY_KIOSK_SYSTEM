const express = require('express');
const { google } = require('googleapis');
const app = express();
const PORT = 3000;

// Google Sheets API setup
const sheets = google.sheets({ version: 'v4', auth: 'YOUR_API_KEY' }); // Replace YOUR_API_KEY with your actual API key
const spreadsheetId = '1SUvetZptrSWVz04qkQfj9n2NbfjcsohOFZRSmnXs5Rw'; // Replace with your spreadsheet ID
const range = 'Sheet1!A2:D'; // Adjust based on your sheet's data range

app.use(express.json());
app.use(express.static('public')); // For serving static files like HTML, CSS

// Endpoint to get student data based on RFID
app.get('/getStudentData', async (req, res) => {
  const { rfid } = req.query;

  if (!rfid) {
    return res.status(400).json({ message: 'RFID is required' });
  }

  try {
    // Fetch data from Google Sheets
    const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'No data found in the spreadsheet' });
    }

    // Search for the student data using RFID
    const studentData = rows.find(row => row[0] === rfid);

    if (!studentData) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Respond with student data
    res.json({
      name: studentData[1], // Assuming the name is in column B
      studentId: studentData[2], // Assuming Student ID is in column C
      borrowedBooks: studentData[3], // Assuming Borrowed Books is in column D
    });
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error.message);
    res.status(500).json({ message: 'Error fetching data from Google Sheets' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
