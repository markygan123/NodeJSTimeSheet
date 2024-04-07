const APP = (function() {
    document.addEventListener("DOMContentLoaded", init);    
    
    const tableBody = document.querySelector("tbody");    
    const modal = document.querySelector(".modal-window");
    const overlay = document.querySelector(".overlay");
    const clockPunchBtn = document.querySelector(".clock-punch-btn");
    const clockPunchModalBtn = document.querySelector(".clock-punch-modal-btn");

    
    let digitalClockEl = document.querySelector("#clock");
    let clockPunchCount = 0;
    let timeInAM = 0;
    let timeInPM = 0;
    let weeklyTotals = 0;
    let timePunchJson = {};
    let timePunchDayJson = {};

    let timeInAMCell = document.querySelector("td.time-in-am");
    let timeOutAMCell = document.querySelector("td.time-out-am");        
    let timeInPMCell = document.querySelector("td.time-in-pm");
    let timeOutPMCell = document.querySelector("td.time-out-pm");
    let totalHrsCell = document.querySelector("td.total-hrs");
    let totalHrsWeekCell = document.querySelector(".total-hrs-week");

    function init() {
        addListeners();
        getDates();
        // buttonLabel();

        setInterval(function () {
            digitalClockEl.innerHTML = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        }, 1000);        
    }
    
    const addListeners = () => {
        // clockPunchBtn.addEventListener("click", function() {
        //     let date = new Date();
        //     let weeklyTotal = 8;
        //     let day = date.getDate();
        //     let month = date.getMonth() + 1;
        //     let year = date.getFullYear();
        //     let dateToday = `${day}/${month}/${year}`;
        //     let tableRow = document.createElement("tr");
        //     let newWeekRow = `
        //     <td data-label="Date Today">${dateToday}</td>
        //     <td data-label="Time In - AM">8:00</td>
        //     <td data-label="Time Out - AM">12:00</td>
        //     <td data-label="Time In - PM">1:00</td>
        //     <td data-label="Time Out - PM">5:00</td>
        //     <td data-label="Total Hours">8</td>
        //     <td data-label="Action" class="action-cell">
        //     <img src="/src/logo/new.svg" class="svg-logo" alt="Add">
        //     <img src="/src/logo/edit.svg" class="svg-logo" alt="Edit">
        //     </td>
        //     `;
            
        //     tableRow.innerHTML = newWeekRow;
        //     tableRow.setAttribute("id",`week-${weekCount+1}`);
        //     tableBody.appendChild(tableRow);
        //     weekCount++;
        // });
        
        const cancelPunchBtn = document.querySelector(".cancel-punch");
        const submitPunchBtn = document.querySelector(".submit-punch");
        const clearTimesheetBtn = document.querySelector("#clear-timesheet");
        const clrLocalStorageBtn = document.querySelector("#clear-local-storage");

        clockPunchBtn.addEventListener("click", function openModal() {
            modal.classList.remove("hidden");
            overlay.classList.remove("hidden");
        });
        cancelPunchBtn.addEventListener("click", closeModal);
        submitPunchBtn.addEventListener("click", submitPunch);
        clearTimesheetBtn.addEventListener("click", clearTimesheet);
        clrLocalStorageBtn.addEventListener("click", function () {
            localStorage.clear();
        });

    }
    
    const closeModal = () =>  {
        modal.classList.add("hidden");
        overlay.classList.add("hidden");
    }

    const getDates = () => {
        let weekDate = [];
        const todayCell = document.querySelectorAll('td[data-label="Date Today"]');
        
        for (let i = 0; i < todayCell.length; i++) {
            weekDate.push(todayCell[i]); 
        }
        
        return weekDate;
    }
    
    const submitPunch = () => {
        checkDay();
        let timeNow = digitalClockEl.innerHTML;
        let day = new Date().getDay();
        let currentTimeInAmCell = getDates()[day-1].nextElementSibling;
        let currentTimeOutAmCell = getDates()[day-1].nextElementSibling.nextElementSibling;
        let currentTimeInPmCell = getDates()[day-1].nextElementSibling.nextElementSibling.nextElementSibling;
        let currentTimeOutPmCell = getDates()[day-1].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling;
        let currentTotalHrsCell = getDates()[day-1].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling;


        if (currentTimeInAmCell.innerHTML === "") {
            currentTimeInAmCell.innerHTML = timeNow;
            currentTimeInAmCell.classList.add("punched-in");
            localStorage.setItem("TimeInAM", timeNow);
            btnLabelClockOut();       
            storeTimePunch();
        } else if (currentTimeOutAmCell.innerHTML  === "" && !currentTimeOutAmCell.classList.contains("punched-in")) {
            currentTimeOutAmCell.innerHTML = timeNow;
            currentTimeOutAmCell.classList.add("punched-in");
            totalHrsAM = Number(currentTimeOutAmCell.innerHTML.substring(0,2) + "." + currentTimeOutAmCell.innerHTML.substring(3)) - 
            Number(currentTimeInAmCell.innerHTML.substring(0,2) + "." + currentTimeInAmCell.innerHTML.substring(3));
            totalHrs = totalHrsAM.toFixed(1);
            currentTotalHrsCell.innerHTML = totalHrs;
            localStorage.setItem("TimeOutAM", timeNow);
            localStorage.setItem("TotalHrs", totalHrs);
            btnLabelClockIn();
            storeTimePunch();            
        } else if (!currentTimeInPmCell.classList.contains("punched-in") && currentTimeInPmCell.innerHTML === "") {
            currentTimeInPmCell.innerHTML = timeNow;
            currentTimeInPmCell.classList.add("punched-in");
            localStorage.setItem("TimeInPM", timeNow);
            btnLabelClockOut();
            storeTimePunch();            
        } else if (currentTimeOutPmCell.innerHTML === "" && !currentTimeOutPmCell.classList.contains("punched-in")) {
            let timeAm = localStorage.getItem("TotalHrs");
            currentTimeOutPmCell.innerHTML = timeNow;
            currentTimeOutPmCell.classList.add("punched-in");
            totalHrsPM = Number(currentTimeOutPmCell.innerHTML.substring(0,2) + "." + currentTimeOutPmCell.innerHTML.substring(3)) -
                         Number(currentTimeInPmCell.innerHTML.substring(0,2) + "." + currentTimeInPmCell.innerHTML.substring(3));
            localStorage.setItem("TimeOutPM", timeNow);
            totalHrs = Math.round((parseInt(timeAm) + totalHrsPM) * 10) / 10;
            weeklyTotals += totalHrs;
            currentTotalHrsCell.innerHTML = totalHrs;
            totalHrsWeekCell.innerHTML = weeklyTotals;
            localStorage.setItem("TotalHrs", totalHrs); 
            localStorage.setItem("WorkDayStatus", "done");
            localStorage.setItem("TotalWeeklyHrs", weeklyTotals);
        }
        
        let workDayStatus = localStorage.getItem("WorkDayStatus", "done");
        
        if (workDayStatus != null) {
            clockPunchBtn.style.display = "none";    
            storeTimePunch();
            localStorage.clear();
        }

        closeModal();
    }

    const btnLabelClockOut = () => {
        clockPunchBtn.innerHTML = "Clock Out";            
        clockPunchModalBtn.innerHTML = "Clock Out"; 
    }

    const btnLabelClockIn = () => {
        clockPunchBtn.innerHTML = "Clock In";            
        clockPunchModalBtn.innerHTML = "Clock In";     
    }

    const storeTimePunch = () => {
        let timeInAm = localStorage.getItem("TimeInAM");
        let timeOutAm = localStorage.getItem("TimeOutAM");
        let timeInPm = localStorage.getItem("TimeInPM");
        let timeOutPm = localStorage.getItem("TimeOutPM");
        let totalHrs = localStorage.getItem("TotalHrs");
        let totalWeeklyHrs = localStorage.getItem("TotalWeeklyHrs");
        let workDayStatus = localStorage.getItem("WorkDayStatus");
        
        if (workDayStatus === "done") {
            timePunchDayJson["TimeInAM"] = timeInAm;
            timePunchDayJson["TimeOutAM"] = timeOutAm;
            timePunchDayJson["TimeInPM"] = timeInPm;
            timePunchDayJson["TimeOutPM"] = timeOutPm;
            timePunchDayJson["TotalHrs"] = totalHrs;
            timePunchDayJson["TotalWeeklyHrs"] = totalWeeklyHrs;

            console.log(timePunchDayJson);

            fetch("/submitHours", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(timePunchDayJson)
            })
             .then(response => response.json())
             .catch(error => console.error('Error: ', error));
        } else {
            timePunchJson["TimeInAM"] = timeInAm;
            timePunchJson["TimeOutAM"] = timeOutAm;
            timePunchJson["TimeInPM"] = timeInPm;
            timePunchJson["TimeOutPM"] = timeOutPm;
            timePunchJson["TotalHrs"] = totalHrs;
            timePunchJson["WorkDayStatus"] = workDayStatus;

            fetch("/", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(timePunchJson)
            })
             .then(response => response.json())
             .catch(error => console.error('Error: ', error));
        }
    }

    const clearTimesheet = () => {
        fetch("/clearTimeSheet", {
            method: "POST"
        })
         .then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                console.error("Failed to clear timesheet: ", response.statusText);
            }
         })
          .catch(error => {
            console.error("Error clearing timesheet");
          })
    }

    const checkDay = () => {
        const currentDay = new Date().getDay();
        const warning = document.querySelector("#invalid-day-warning");

        if (currentDay === 0 || currentDay === 6) {
            warning.style.display = "block";    
        }
    }
    
})();
