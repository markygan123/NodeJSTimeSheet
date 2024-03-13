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
    let timePunchJson = {};

    function init() {
        addListeners();
        buttonLabel();

        setInterval(function () {
            digitalClockEl.innerHTML = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }).replace("AM","").replace("PM","");
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

        clockPunchBtn.addEventListener("click", function openModal() {
            modal.classList.remove("hidden");
            overlay.classList.remove("hidden");
        });
        cancelPunchBtn.addEventListener("click", closeModal);
        submitPunchBtn.addEventListener("click", submitPunch);

    }
    
    const buttonLabel = () => {
        let timeInAM = document.querySelector("td.time-in-am").innerHTML;
        let timeOutAM = document.querySelector("td.time-out-am").innerHTML;
        let timeInPM = document.querySelector("td.time-in-pm").innerHTML;
        
        if (timeInAM === "") {
            clockPunchBtn.innerHTML = "Clock In";
            clockPunchModalBtn.innerHTML = "Clock In";
        } else if (timeOutAM === "") {
            clockPunchBtn.innerHTML = "Clock Out";
            clockPunchModalBtn.innerHTML = "Clock Out";
        } else if (timeInPM === "") {
            clockPunchBtn.innerHTML = "Clock In";
            clockPunchModalBtn.innerHTML = "Clock In";
        } else {
            clockPunchBtn.innerHTML = "Clock Out";
            clockPunchModalBtn.innerHTML = "Clock Out";
        }
    }

    const closeModal = () =>  {
        modal.classList.add("hidden");
        overlay.classList.add("hidden");
    }

    const submitPunch = () => {
        let timeInAMCell = document.querySelector("td.time-in-am");
        let timeOutAMCell = document.querySelector("td.time-out-am");        
        let timeInPMCell = document.querySelector("td.time-in-pm");
        let timeOutPMCell = document.querySelector("td.time-out-pm");
        let totalHrsCell = document.querySelector("td.total-hrs");

        let timeNow = digitalClockEl.innerHTML;
        let tempAMHrs;        

        if (timeInAMCell.innerHTML  === "") {
            timeInAMCell.innerHTML = timeNow;
            timeInAMCell.classList.add("punched-in");
            localStorage.setItem("TimeInAM", timeNow);            
            clockPunchCount++;
            storeTimePunch();
        } else if (clockPunchBtn.innerHTML === "Clock Out" && !timeOutAMCell.classList.contains("punched-in") && timeOutAMCell.innerHTML === "") {
            timeOutAMCell.innerHTML = timeNow;
            timeOutAMCell.classList.add("punched-in");
            totalHrsAM = Number(timeOutAMCell.innerHTML.substring(0,2) + "." + timeOutAMCell.innerHTML.substring(3)) - 
                         Number(timeInAMCell.innerHTML.substring(0,2) + "." + timeInAMCell.innerHTML.substring(3));
            totalHrs = totalHrsAM;
            tempAMHrs = totalHrsAM.toFixed(2);
            totalHrsCell.innerHTML = tempAMHrs;
            localStorage.setItem("TimeOutAM", timeNow);
            clockPunchCount++;
            storeTimePunch();            
        } else if (clockPunchBtn.innerHTML === "Clock In" && timeOutAMCell.classList.contains("punched-in")) {
            timeInPMCell.innerHTML = timeNow;
            timeInPMCell.classList.add("punched-in");
            localStorage.setItem("TimeInPM", timeNow);
            clockPunchCount++;
            storeTimePunch();            
        } else if (clockPunchBtn.innerHTML === "Clock Out" && timeOutPMCell.innerHTML === "" && !timeOutPMCell.classList.contains("punched-in")) {
            timeOutPMCell.innerHTML = timeNow;
            timeOutPMCell.classList.add("punched-in");
            totalHrsPM = Number(timeOutPMCell.innerHTML.substring(0,2) + "." + timeOutPMCell.innerHTML.substring(3)) -
                         Number(timeInPMCell.innerHTML.substring(0,2) + "." + timeInPMCell.innerHTML.substring(3));
            localStorage.setItem("TimeOutPM", timeNow);            
            clockPunchCount++;   
            storeTimePunch();   
        }
        
        if (clockPunchCount >= 4) {
            clockPunchBtn.style.display = "none";
            totalHrs = (totalHrsAM + totalHrsPM).toFixed(2);
            totalHrsCell.innerHTML = totalHrs;
            localStorage.clear();
        }

        closeModal();
        //update button label every clock punch
        buttonLabel();
    }

    const storeTimePunch = () => {
        let timeInAm = localStorage.getItem("TimeInAM");
        let timeOutAm = localStorage.getItem("TimeOutAM");
        let timeInPm = localStorage.getItem("TimeInPM");
        let timeOutPm = localStorage.getItem("TimeOutPM");

        
        if (timeInAm != null && timeOutAm === null && timeInPm === null && timeOutPm === null) {
            timePunchJson["TimeInAM"] = timeInAm;
        } else if (timeOutAm != null && timeInAm != null && timeInPm === null && timeOutPm === null) {
            timePunchJson["TimeOutAM"] = timeOutAm;
        } else if (timeInPm != null && timeInAm != null && timeOutAm != null && timeOutPm === null) {
            timePunchJson["TimeInPM"] = timeInPm;
        } else if (timeOutPm != null && timeInAm != null && timeOutAm != null && timeInPm != null) {
            timePunchJson["TimeOutPM"] = timeOutPm;
        }
        
        console.log(timePunchJson);
        fetch("/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(timePunchJson)
        })
         .then(response => response.json())
         .catch(error => console.error('Error: ', error))
    }
    
})();
