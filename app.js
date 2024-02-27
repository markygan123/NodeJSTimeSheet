//NodeJS Core Modules
const http = require('http');
const fs = require('fs');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // Handle only GET requests for the specified route '/'
    if (req.method === 'GET' && req.url === '/') {
        // Read the HTML file asynchronously
        fs.readFile('views/index.html', 'utf8', (err, data) => {
            if (err) {
                // Handle error
                console.error(err);
                res.writeHead(500, {
                    'Content-Type' : 'text/plain'
                });
                res.end('Internal Server Error');
                return;
            }

            //Dynamic data
            const pageTitle = 'Weekly Time Sheet';
            const date = new Date();
            let weeklyTotal = 8;
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            let dateToday = `${day}/${month}/${year}`;
            const employeeName = 'Norman Banzon';

            // Replace the placeholder with actual data
            const htmlContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="stylesheet" type="text/css" href="/views/styles.css" />
                    <title>SafeTrust</title>
                </head>
                <body>
                    <div id="container">
                        <div class="nav-logo">
                            <img src="./src/images/logo.png" alt="Page Logo">
                        </div>
                        <div class="page-name">${pageTitle}</div>
                        <div class="page-body">
                            <div class="employee-name">
                                Employee Name: ${employeeName}
                            </div>
                
                            <div id="time-sheet">
                                <div class="time-sheet-header row">
                                    <p class="sheet-row">Date</p>
                                    <p class="sheet-row">Time In (AM)</p>
                                    <p class="sheet-row">Time Out (AM)</p>
                                    <p class="sheet-row">Time In (PM)</p>
                                    <p class="sheet-row">Time Out (PM)</p>
                                    <p class="sheet-row">Total Hours</p>
                                </div>
                                <div class="time-sheet-body row">
                                    <p class="sheet-row">${dateToday}</p>
                                    <p class="sheet-row">8:00</p>
                                    <p class="sheet-row">12:00</p>
                                    <p class="sheet-row">1:00</p>
                                    <p class="sheet-row">5:00</p>
                                    <p class="sheet-row">8</p>
                                </div>
                                <div class="time-sheet-totals row">
                                    <p class="sheet-row">Weekly Totals</p>
                                    <p class="sheet-row">${weeklyTotal}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `;

            // Serve the HTML content with a 200 status code
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(htmlContent);
        });
    } else if (req.url === '/views/styles.css') {
        fs.readFile('./views/styles.css', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.writeHead(500, {
                    'Content-Type' : 'text/plain'
                });
                res.end('Internal Server Error');
                return;
            }

            res.writeHead(200, {
                'Content-Type': 'text/css'
            });
            res.end(data);
        });
    } else {
        res.writeHead(404, { 'Content-Type' : 'text/plain' });
        res.end('Not Found');
    }
});

// Start the server on port 3000 (or choose a different port if needed)
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
})