const newWeekBtn = document.querySelector('button');
const tableBody = document.querySelector('tbody');

newWeekBtn.addEventListener('click', function() {
    let date = new Date();
    let weeklyTotal = 8;
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let dateToday = `${day}/${month}/${year}`;
    let tableRow = document.createElement('tr');
    let newWeekRow = `
        <td data-label="Date Today">${dateToday}</td>
        <td data-label="Time In - AM">8:00</td>
        <td data-label="Time Out - AM">12:00</td>
        <td data-label="Time In - PM">1:00</td>
        <td data-label="Time Out - PM">5:00</td>
        <td data-label="Total Hours">8</td>
        <td data-label="Action" class="action-cell">
            <img src="/src/logo/new.svg" class="svg-logo" alt="Add">
            <img src="/src/logo/edit.svg" class="svg-logo" alt="Edit">
        </td>
    `;

    tableRow.innerHTML = newWeekRow;
    tableBody.appendChild(tableRow);
});