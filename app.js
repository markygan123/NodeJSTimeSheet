//NodeJS Core Modules
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // Handle only GET requests for the specified route '/'
    if (req.method === 'GET' && req.url === '/') {
        // Read the HTML file asynchronously
        fs.readFile('public/index.html', 'utf8', (err, data) => {
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
            let date = new Date();
            let weeklyTotal = 8;
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            let dateToday = `${day}/${month}/${year}`;
            const employeeName = 'Norman Banzon';
            const employeeID = '010';
            const employeePosition = 'Senior Software Developer';
            const employeeDept = 'IT/Software Development';


            // Replace the placeholder with actual data
            const htmlContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="stylesheet" type="text/css" href="/public/styles.css" />
                    <title>SafeTrust</title>
                </head>
                <body>
                    <div id="container">
                        <div class="nav-logo">
                            <img src="/src/images/logo.png" alt="Page Logo"> 
                        </div>
                        <div class="page-name">${pageTitle}</div>
                        <div class="page-body">
                            <div class="employee-info">
                                <div class="empinfo-left>
                                    <p class="detail"> Employee Name: ${employeeName} </p>
                                    <p class="detail"> Employee ID: ${employeeID} </p>
                                </div>
                                <div class="empinfo-right">
                                    <p class="detail"> Position: ${employeePosition} </p>
                                    <p class="detail"> Department: ${employeeDept} </p>
                                </div>
                            </div>
                            <div class="dates-section">
                                <input type="week" name="week" id="week">
                                <button>Add New Week</button>
                            </div>

                            <table class="time-sheet">
                                <thead>
                                    <tr>
                                        <th id="date-cell">Date</th>
                                        <th>Time In (AM)</th>
                                        <th>Time Out (AM)</th>
                                        <th>Time In (PM)</th>
                                        <th>Time Out (PM)</th>
                                        <th>Total Hours</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                <tr id='week-1'>
                                        <td data-label="Date Today">${dateToday}</td>
                                        <td class="time-in-am"></td>
                                        <td class="time-out-am">12:00</td>
                                        <td class="time-in-pm">1:00</td>
                                        <td class="time-out-pm">5:00</td>
                                        <td class="total-hrs">8</td>
                                        <td data-label="Action" class="action-cell">
                                            <img src="/src/logo/new.svg" class="svg-logo" alt="Add">
                                            <img src="/src/logo/edit.svg" class="svg-logo" alt="Edit">
                                        </td>
                                    </tr>
                                </tbody>
                                </table>
                        </div>
                    </div>

                    <section class="modal-window hidden">
                        <h3>Confirm Clock Punch</h3>
                        <div class="clock"></div>
                        <button id="submit-punch">Submit Clock Punch</button>
                    </section>

                    <div class="overlay hidden"></div>






                    <script src="/public/js/script.js"></script>
                </body>
                </html>
            `;

            // Serve the HTML content with a 200 status code
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(htmlContent);
        });
    } else if (req.url === '/public/styles.css') {
        fs.readFile('./public/styles.css', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.writeHead(404, {
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
    } else if (req.method === 'GET' && req.url.startsWith('/src/images')) {
        const imagePath = path.join(__dirname, req.url);
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                console.error(err);
                res.writeHead(404, {
                    'Content-Type' : 'text/plain'
                });
                res.end('File Not Found');
                return;                
            }
            const contentType = {
                '.jpg': 'image/jpg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png'
            }
            res.writeHead(200, {
                'Content-Type': contentType
            });
            res.end(data);
        });
    } else if (req.method === 'GET' && req.url.startsWith('/src/logo')) {
        const logoPath = path.join(__dirname, req.url);
        fs.readFile(logoPath, (err, data) => {
            if (err) {
                console.error(err);
                res.writeHead(404, {
                    'Content-Type' : 'text/plain'
                });
                res.end('File Not Found');
                return;                
            }
            res.writeHead(200, {
                'Content-Type': 'image/svg+xml'
            });
            res.end(data);
        });
    } else if (req.method === 'GET' && req.url.startsWith('/public/js')) {
        const scriptPath = path.join(__dirname, req.url);
        fs.readFile(scriptPath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.writeHead(404, {
                    'Content-Type' : 'text/plain'
                });
                res.end('Internal Server Error');
                return;                
            }

            res.writeHead(200, {
                'Content-Type': 'application/javascript'
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