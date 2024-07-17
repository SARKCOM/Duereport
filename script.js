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

    headers.forEach((header, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = header;
        columnSelect.appendChild(option);
    });

    console.log('Headers:', headers); // Debugging
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
    displayResults(results);
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (results.length === 0) {
        resultsDiv.textContent = 'No results found';
        return;
    }

    results.forEach(result => {
        const table1 = document.createElement('table');
        const table2 = document.createElement('table');
        const tbody1 = document.createElement('tbody');
        const tbody2 = document.createElement('tbody');

        for (let i = 0; i < 5; i++) {
            if (result[i] !== undefined) {
                const row = document.createElement('tr');
                const th = document.createElement('th');
                const td = document.createElement('td');

                th.textContent = excelData[0][i];
                td.textContent = result[i];

                row.appendChild(th);
                row.appendChild(td);
                tbody1.appendChild(row);
            }
        }

        for (let i = 5; i < 10; i++) {
            if (result[i] !== undefined) {
                const row = document.createElement('tr');
                const th = document.createElement('th');
                const td = document.createElement('td');

                th.textContent = excelData[0][i];
                td.textContent = result[i];

                row.appendChild(th);
                row.appendChild(td);
                tbody2.appendChild(row);
            }
        }

        table1.appendChild(tbody1);
        table2.appendChild(tbody2);

        resultsDiv.appendChild(table1);

        const paymentHistoryDiv = document.createElement('div');
        paymentHistoryDiv.classList.add('payment-history');
        paymentHistoryDiv.textContent = 'Payment History';
        resultsDiv.appendChild(paymentHistoryDiv);

        const paymentDetailsDiv = document.createElement('div');
        paymentDetailsDiv.classList.add('payment-details');

        const dateDiv = document.createElement('div');
        dateDiv.textContent = 'Date';
        paymentDetailsDiv.appendChild(dateDiv);

        const amountPaidDiv = document.createElement('div');
        amountPaidDiv.textContent = 'Amount Paid';
        paymentDetailsDiv.appendChild(amountPaidDiv);

        resultsDiv.appendChild(paymentDetailsDiv);
        resultsDiv.appendChild(table2);
    });
}
