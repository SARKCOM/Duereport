function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (results.length === 0) {
        resultsDiv.textContent = 'No results found';
        return;
    }

    results.forEach(result => {
        const table1 = document.createElement('table');
        const tbody1 = document.createElement('tbody');
        const headerRow1 = document.createElement('tr');
        const dataRow1 = document.createElement('tr');

        const table2 = document.createElement('table');
        const tbody2 = document.createElement('tbody');
        const headerRow2 = document.createElement('tr');
        const dataRow2 = document.createElement('tr');

        const table3 = document.createElement('table');
        const tbody3 = document.createElement('tbody');

        // First 5 columns
        for (let i = 0; i < 5; i++) {
            if (result[i] !== undefined && result[i] !== null && result[i].toString().trim() !== '') {
                const th = document.createElement('th');
                th.textContent = excelData[0][i];
                headerRow1.appendChild(th);

                const td = document.createElement('td');
                td.textContent = result[i];
                dataRow1.appendChild(td);
            }
        }

        // Next 5 columns
        for (let i = 5; i < 10; i++) {
            if (result[i] !== undefined && result[i] !== null && result[i].toString().trim() !== '') {
                const th = document.createElement('th');
                th.textContent = excelData[0][i];
                headerRow2.appendChild(th);

                const td = document.createElement('td');
                td.textContent = result[i];
                dataRow2.appendChild(td);
            }
        }

        // Remaining columns
        for (let i = 10; i < result.length; i++) {
            if (result[i] !== undefined && result[i] !== null && result[i].toString().trim() !== '') {
                const row = document.createElement('tr');

                const th = document.createElement('th');
                th.textContent = excelData[0][i];
                row.appendChild(th);

                const td = document.createElement('td');
                td.textContent = result[i];
                row.appendChild(td);

                tbody3.appendChild(row);
            }
        }

        tbody1.appendChild(headerRow1);
        tbody1.appendChild(dataRow1);
        table1.appendChild(tbody1);

        tbody2.appendChild(headerRow2);
        tbody2.appendChild(dataRow2);
        table2.appendChild(tbody2);

        table3.appendChild(tbody3);

        resultsDiv.appendChild(table1);
        resultsDiv.appendChild(table2);
        resultsDiv.appendChild(table3);
    });
}
