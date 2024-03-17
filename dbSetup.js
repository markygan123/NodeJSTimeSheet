const sqlite3 = require('sqlite3').verbose();
let sql;

const initializeDb = () => {
    const db = new sqlite3.Database('./database/timesheet.db', sqlite3.OPEN_READWRITE, (error) => {
        if (error) console.error(error.message);
        
        sql = `CREATE TABLE IF NOT EXISTS timesheet(table_id,row_id INTEGER PRIMARY KEY,date,time_in_am,time_out_am,time_in_pm,time_out_pm,
            total_hrs_daily,total_hrs_weekly)`;
        db.run(sql, (err) => {
            err ? console.error('Error creating timesheet table: ', err.message) : console.log('Timesheet table created successfully.');
        });
        // db.run(`DELETE FROM timesheet`);
    });

    db.close(error => {
        error ? console.error('Error closing database: ', err.message) : console.log('Disconnected from the SQLite database.');
    });
}


module.exports = { initializeDb };