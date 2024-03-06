const APP = (function() {
    document.addEventListener('DOMContentLoaded', init);
    
    
    const tableBody = document.querySelector('tbody');    
    const modal = document.querySelector('.modal-window');
    const overlay = document.querySelector('.overlay');
    const logBtn = document.querySelector('button');

    
    let digitalClockEl = document.querySelector('#clock');

    let weekCount = 1;

    function init() {
        addListeners();
        buttonLabel();
        digitalClock();
        runClock();
    }
    
    const addListeners = () => {
        // logBtn.addEventListener('click', function() {
        //     let date = new Date();
        //     let weeklyTotal = 8;
        //     let day = date.getDate();
        //     let month = date.getMonth() + 1;
        //     let year = date.getFullYear();
        //     let dateToday = `${day}/${month}/${year}`;
        //     let tableRow = document.createElement('tr');
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
        //     tableRow.setAttribute('id',`week-${weekCount+1}`);
        //     tableBody.appendChild(tableRow);
        //     weekCount++;
        // });
        
        const cancelPunchBtn = document.querySelector('.cancel-punch');
        const submitPunchBtn = document.querySelector('.submit-punch');

        logBtn.addEventListener('click', openModal);
        cancelPunchBtn.addEventListener('click', closeModal);
        submitPunchBtn.addEventListener('click', submitPunch);

    }
    
    const buttonLabel = () => {
        let timeInAM = document.querySelector('td.time-in-am').innerHTML;
        let timeOutAM = document.querySelector('td.time-out-am').innerHTML;
        let timeInPM = document.querySelector('td.time-in-pm').innerHTML;

        console.log(timeOutAM);
        
        let btnLabel = ((timeInAM === undefined || timeInAM === "") || (timeInPM === undefined || timeInPM === "")) ?  logBtn.innerHTML = "Clock In" : logBtn.innerHTML = "Clock Out";

    }

    const openModal = () =>  {
        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');
    }

    const closeModal = () =>  {
        modal.classList.add('hidden');
        overlay.classList.add('hidden');
    }

    const digitalClock = () =>  {
        digitalClockEl.innerHTML = new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" }).replace("AM","").replace("PM","");
    }

    const runClock = () => {
        setInterval(digitalClock, 1000);
    }

    const submitPunch = () => {
        let timeInAMCell = document.querySelector('td.time-in-am');
        timeInAMCell.innerHTML = digitalClockEl.innerHTML;
        closeModal();
    }
    
})();
