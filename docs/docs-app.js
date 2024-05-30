let port = '8000';
let pingInterval = 0;
let serverPreviouslyHealthy = false;
const serverStatus = document.getElementById('server_status');
const dialog = document.querySelector('dialog');
const contactRequestData = document.getElementById('contact_request_data');

const checkPing = () => {
    const check = setInterval(() => {
        pingServer();

        if (pingInterval === 0) {
            pingInterval = 5000;
            clearInterval(check);
            checkPing();
        }
    }, pingInterval);
};

const pingServer = () => {
    fetch(`http://localhost:${port}/ping`)
        .then(async (r) => await r.json())
        .then((json) => {
            serverStatus.innerText = `Server status: ${json.message}`;
            showServerHealth(true);
        })
        .catch((error) => {
            serverStatus.innerText = `Server status: ${error}`;
            showServerHealth(false);
        });
};

const showServerHealth = (serverOnline) => {
    if (!serverPreviouslyHealthy && serverOnline) {
        serverPreviouslyHealthy = true;

        // Removing an element class that may not exist is "safe". No need to check element.classList before removing.
        serverStatus.parentElement.classList.remove('server_unhealthy');
        serverStatus.parentElement.classList.add('server_healthy');
    } else if (!serverOnline) {
        serverPreviouslyHealthy = false;
        serverStatus.parentElement.classList.remove('server_healthy');
        serverStatus.parentElement.classList.add('server_unhealthy');
    }
};

const clearData = () => {
    console.log('clearing data...');
};

const resetData = () => {
    console.log('resetting data...');
};

const showData = (show) => {
    if (show) {
        dialog.showModal();
        getData();
        return;
    }
    dialog.close();
    contactRequestData.innerHTML = '';
};

const getData = () => {
    fetch(`http://localhost:${port}/contact`)
        .then(async (r) => await r.json())
        .then((json) => {
            const htmlTable = generateHtmlTable(json.data);
            contactRequestData.appendChild(htmlTable);
        });
};

const refreshTableData = () => {
    contactRequestData.innerHTML = '';
    getData();
};

const generateHtmlTable = (jsonData) => {
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');

    Object.keys(jsonData[0]).forEach((key) => {
        const columnHead = document.createElement('th');
        columnHead.textContent = camelCaseToWords(key);
        headerRow.appendChild(columnHead);
    });

    table.appendChild(headerRow);

    jsonData.forEach((rowData) => {
        const tableRow = document.createElement('tr');

        Object.values(rowData).forEach((value) => {
            const tableCell = document.createElement('td');
            tableCell.textContent = value;
            tableRow.appendChild(tableCell);
        });

        table.appendChild(tableRow);
    });

    return table;
};

const camelCaseToWords = (camelCase) => {
    const wordsSplit = camelCase.replace(/([A-Z])/g, ' $1');
    return wordsSplit.charAt(0).toUpperCase() + wordsSplit.slice(1);
};

checkPing();
