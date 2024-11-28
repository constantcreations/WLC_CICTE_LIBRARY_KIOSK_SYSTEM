const express = require('express');
const { google } = require('googleapis');
const app = express();
const PORT = 3000;

// Google Sheets API setup
const sheets = google.sheets({ version: 'v4', auth: 'YOUR_API_KEY' });
const spreadsheetId = 'YOUR_SPREADSHEET_ID'; // Replace with your spreadsheet ID

app.use(express.json());
app.use(express.static('public')); // For serving static files like HTML, CSS

// Endpoint to get student data based on RFID
app.get('/getStudentData', async (req, res) => {
  const rfid = req.query.rfid; // Get RFID from query params
  const range = 'Sheet1!A2:D'; // Adjust based on your sheet range

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (rows.length) {
      // Find the student with the matching RFID
      const student = rows.find((row) => row[0] === rfid);
      if (student) {
        // Return student data as JSON
        res.json({
          name: student[1],
          studentId: student[2],
          borrowedBooks: student[3],
        });
      } else {
        res.status(404).json({ error: 'Student not found' });
      }
    } else {
      res.status(404).json({ error: 'No data found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving data from Google Sheets' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
