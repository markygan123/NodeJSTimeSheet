//NodeJS Core Modules
const http = require('http');
const fs = require('fs');
const path = require('path');
const { initializeDb } = require('./dbSetup');
const sqlite3 = require('sqlite3').verbose();

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
            let weeklyTotal = 0;            
            const employeeName = 'Norman Banzon';
            const employeeID = '010';
            const employeePosition = 'Senior Software Developer';
            const employeeDept = 'IT/Software Development'; 
            const dateToday = getDateToday();    
            
            let storedTimeInAM = "";
            let storedTimeOutAM = "";
            let storedTimeInPM = "";
            let storedTimeOutPM = "";
            let storedtotalHrs = "";
            let storedtotalWeeklyHrs = "";            

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
                                <button id="clear-timesheet">Clear Table</button>
                                <button class="clock-punch-btn">Clock In</button>
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
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr id='week-1'>
                                        <td data-label="Date Today">${dateToday}</td>
                                        <td class="time-in-am">${storedTimeInAM ? storedTimeInAM : ''}</td>
                                        <td class="time-out-am">${storedTimeOutAM ? storedTimeOutAM : ''}</td>
                                        <td class="time-in-pm">${storedTimeInPM ? storedTimeInPM : ''}</td>
                                        <td class="time-out-pm">${storedTimeOutPM ? storedTimeOutPM : ''}</td>
                                        <td class="total-hrs">${storedtotalHrs ? storedtotalHrs : '0'}</td>
                                    </tr>
                                </tbody>
                                </table>
                        </div>
                        
                        <div class="weekly-totals">
                            <p>Weekly Totals:</p>
                            <p class="total-hrs-week">${storedtotalWeeklyHrs ? storedtotalWeeklyHrs : '0'}</p>
                        </div>
                    </div>

                    
                    <div class="overlay hidden">
                        <section class="modal-window">

                            <h3>Confirm Clock Punch</h3>
                            <div id="clock"></div>
                            <button class="clock-punch-modal-btn submit-punch"></button>
                            <button class="cancel-punch">Cancel</button>
                        </section>
                    </div>






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
    } else if (req.method === 'POST', req.url === '/') { 
        let body = '';
        

        req.on('data', function (data) {
            body += data.toString();
        });

        req.on('end', () => {  
            try {
                const postData = JSON.parse(body);                
                storedTimeInAM = postData.TimeInAM;
                storedTimeOutAM = postData.TimeOutAM;
                storedTimeInPM = postData.TimeInPM;
                storedTimeOutPM = postData.TimeOutPM;
                storedtotalHrs = postData.TotalHrs;
                storedDayStatus = postData.WorkDayStatus;
            }
            catch (error) {
                console.error('Error parsing JSON', error);
            }

            console.log('Time Punch: ', storedTimeInAM, storedTimeOutAM, storedTimeInPM, storedTimeOutPM, storedtotalHrs, storedDayStatus);
        });
    } else if (req.method === 'POST', req.url === '/submitHours') { 
        let body = '';
        getDateToday();
        

        req.on('data', function (data) {
            body += data.toString();
        });

        req.on('end', () => {  
            try {
                const postData = JSON.parse(body);   
                const workDate = getDateToday();           
                             
                storedTimeInAM = postData.TimeInAM;
                storedTimeOutAM = postData.TimeOutAM;
                storedTimeInPM = postData.TimeInPM;
                storedTimeOutPM = postData.TimeOutPM;
                storedtotalHrs = postData.TotalHrs;
                storedtotalWeeklyHrs = postData.TotalWeeklyHrs;

                const db = new sqlite3.Database('database/timesheet.db');

                db.run(`INSERT INTO timesheet (date,time_in_am,time_out_am,time_in_pm,time_out_pm,total_hrs_daily,total_hrs_weekly)
                        VALUES (?,?,?,?,?,?,?)`, [workDate,storedTimeInAM,storedTimeOutAM,storedTimeInPM,storedTimeOutPM,storedtotalHrs,storedtotalWeeklyHrs], function (err) {
                            if (err) {
                                console.error('Error inserting data into timesheet table: ', err.message);
                                res.writeHead(500, {
                                    'Content-Type': 'application/json'
                                });
                                res.end(JSON.stringify({
                                    error: 'Internal server error'
                                }));
                            } else {
                                console.log(`Data inserted into timesheet table with ID ${this.lastID}`);
                                res.writeHead(200, {
                                    'Content-Type': 'application/json'
                                });
                                res.end(JSON.stringify({
                                    message: 'Data inserted successfully.'
                                }));
                            }
                        });

                db.close();
            }
            catch (error) {
                console.error('Error parsing JSON', error);
                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify({
                    error: 'Invalid JSON format'
                }));
            }

            console.log('Daily Punch: ', storedTimeInAM, storedTimeOutAM, storedTimeInPM, storedTimeOutPM, storedtotalHrs, storedtotalWeeklyHrs);
        });
    } else if (req.method === 'POST' && req.url === '/clearTimeSheet') {
        const db = new sqlite3.Database('database/timesheet.db');

        db.run(`DELETE FROM timesheet`, function (error) {
            if (error) {
                console.error('Error clearing timesheet', error.message);
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                res.end('Internal Server Error');
            } else {
                console.log('Table cleared successfully.');
                res.writeHead(200, {
                    'Content-Type' : 'text/plain'
                });
                res.end('Table cleared successfully.');
            }
        });

        db.close();

    } else {
        res.writeHead(404, { 'Content-Type' : 'text/plain' });
        res.end('Not Found');
    }
});

initializeDb();

const getDateToday = () => {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let dateToday = `${month}/${day}/${year}`;

    return dateToday;
}

// Start the server on port 3000 (or choose a different port if needed)
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
})