let excelData = [];
const correctPassword = 'jpf123'; // Set your password here

function checkPassword() {
    const passwordInput = document.getElementById('password-input').value;
    if (passwordInput === correctPassword) {
        document.getElementById('password-container').style.display = 'none';
        document.getElementById('main-container').style.display = 'block';
        loadExcelData(); // Load Excel data after the password is confirmed
    } else {
        alert('You are not authorized. Please check the password.');
    }
}

function loadExcelData() {
    fetch('data.xlsx')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.arrayBuffer();
        })
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            excelData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

            console.log('Excel Data:', excelData); // Debugging
            populateColumnSelect();
        })
        .catch(error => {
            console.error('Error fetching or processing the Excel file:', error); // Debugging
        });
}

function populateColumnSelect() {
    const columnSelect = document.getElementById('column-select');
    const headers = excelData[0];

    headers.slice(0, 10).forEach((header, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = header;
        columnSelect.appendChild(option);
    });

    console.log('Headers:', headers.slice(0, 10)); // Debugging
}

function searchData() {
    const columnSelect = document.getElementById('column-select');
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase();
    const columnIndex = parseInt(columnSelect.value, 10); // Ensure column index is an integer

    console.log('Selected Column Index:', columnIndex); // Debugging
    console.log('Search Term:', searchTerm); // Debugging

    const results = excelData.slice(1).filter(row => {
        if (row[columnIndex] !== undefined) {
            return row[columnIndex].toString().toLowerCase().includes(searchTerm);
        }
        return false;
    });

    console.log('Search Results:', results); // Debugging
    displayResults(results, columnIndex);
}

function displayResults(results, columnIndex) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (results.length === 0) {
        resultsDiv.textContent = 'No results found';
        return;
    }

    results.forEach(result => {
        // First table with the first 5 columns
        const table1 = document.createElement('table');
        const tbody1 = document.createElement('tbody');

        for (let i = 0; i < 5 && i < result.length; i++) {
            const row = document.createElement('tr');
            const th = document.createElement('th');
            const td = document.createElement('td');

            th.textContent = excelData[0][i];
            td.textContent = result[i];

            row.appendChild(th);
            row.appendChild(td);
            tbody1.appendChild(row);
        }

        table1.appendChild(tbody1);
        resultsDiv.appendChild(table1);

        // Second table with the next 5 columns
        const table2 = document.createElement('table');
        const tbody2 = document.createElement('tbody');

        for (let i = 5; i < 10 && i < result.length; i++) {
            const row = document.createElement('tr');
            const th = document.createElement('th');
            const td = document.createElement('td');

            th.textContent = excelData[0][i];
            td.textContent = result[i];

            row.appendChild(th);
            row.appendChild(td);
            tbody2.appendChild(row);
        }

        table2.appendChild(tbody2);
        resultsDiv.appendChild(table2);
    });;

        

        // Add "Payment History" line
        const paymentHistoryLine = document.createElement('div');
        paymentHistoryLine.textContent = 'Payment History';
        paymentHistoryLine.style.marginTop = '10px';
        paymentHistoryLine.style.marginBottom = '10px';
        paymentHistoryLine.style.fontWeight = 'bold';
        resultsDiv.appendChild(paymentHistoryLine);

        // Add "Date of Payment" and "Amount Paid" text
        const paymentInfoDiv = document.createElement('div');
        paymentInfoDiv.style.display = 'flex';
        paymentInfoDiv.style.justifyContent = 'space-between';

        const dateOfPayment = document.createElement('div');
        dateOfPayment.textContent = 'Date of Payment';
        dateOfPayment.style.fontWeight = 'bold';

        const amountPaid = document.createElement('div');
        amountPaid.textContent = 'Amount Paid';
        amountPaid.style.fontWeight = 'bold';

        paymentInfoDiv.appendChild(dateOfPayment);
        paymentInfoDiv.appendChild(amountPaid);
        resultsDiv.appendChild(paymentInfoDiv);

        // Create vertical table for the remaining columns
        const verticalTable = document.createElement('table');
        const verticalTbody = document.createElement('tbody');

        result.slice(10).forEach((cell, index) => {
            if (cell !== "" && cell !== undefined) { // Exclude blank cells
                const row = document.createElement('tr');
                const th = document.createElement('th');
                const td = document.createElement('td');

                th.textContent = excelData[0][index + 10];

                if ((index + 10) === columnIndex && typeof cell === 'number' && isExcelDate(cell)) {
                    td.textContent = convertExcelDate(cell);
                } else {
                    td.textContent = cell;
                }

                row.appendChild(th);
                row.appendChild(td);
                verticalTbody.appendChild(row);
            }
        });

        verticalTable.appendChild(verticalTbody);
        resultsDiv.appendChild(verticalTable);
    });
}

function isExcelDate(value) {
    return value > 25569; // January 1, 1970, in Excel date serial number
}

function convertExcelDate(excelSerial) {
    const excelEpoch = new Date(1899, 11, 30); // Excel incorrectly treats 1900 as a leap year
    const msPerDay = 24 * 60 * 60 * 1000;
    const jsDate = new Date(excelEpoch.getTime() + excelSerial * msPerDay);
    return jsDate.toLocaleDateString(); // Format date as needed
}

document.getElementById('search-button').addEventListener('click', searchData);
