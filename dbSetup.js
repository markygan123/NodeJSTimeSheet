const sqlite3 = require('sqlite3').verbose();
let sql;

const initializeDb = () => {
    const db = new sqlite3.Database('./database/timesheet.db', sqlite3.OPEN_READWRITE, (error) => {
        if (error) return console.error(error.message);
        
        sql = `CREATE TABLE timesheet(table_id INTEGER PRIMARY KEY, row_id,date,time_in_am,time_out_am,time_in_pm,time_out_pm,work_day_status,
            total_hrs_daily,total_hrs_weekly)`;
        db.run(sql);
    });
}


module.exports = { initializeDb };