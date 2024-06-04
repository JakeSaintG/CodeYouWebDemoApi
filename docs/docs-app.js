let port = 8000;
let pingInterval = 0;
let serverPreviouslyHealthy = false;
const serverStatus = document.getElementById('server_status');
const dialog = document.querySelector('dialog');
const contactRequestData = document.getElementById('contact_request_data');

const toggleMobileMenu = () => {
    const menuState = document.querySelector('nav');

    if (menuState.style.display !== 'flex') {
        menuState.style.display = 'flex';
    } else {
        menuState.style.display = 'none';
    }
};

const checkPing = () => {
    const check = setInterval(() => {
        pingServer();

        if (pingInterval === 0) {
            pingInterval = 3000;
            clearInterval(check);
            checkPing();
        }
    }, pingInterval);
};

const pingServer = () =>
    fetch(`http://localhost:${port}/ping`)
        .then((r) => r.status)
        .then((status) => {
            if (status === 200) {
                showServerHealth('healthy');
            } else {
                showServerHealth('warning', status);
            }
        })
        .catch((error) => {
            showServerHealth('error', error);
            serverStatus.innerText = `Error: ${error}`;
        });

const showServerHealth = (serverOnline, additionalData) => {
    if (!serverPreviouslyHealthy && serverOnline === 'healthy') {
        serverPreviouslyHealthy = true;
        serverStatus.innerText = `Server status: Healthy`;

        // Removing an element class that may not exist is "safe". No need to check element.classList before removing.
        serverStatus.parentElement.classList.remove('server_unhealthy', 'server_warning');
        serverStatus.parentElement.classList.add('server_healthy');
    } else if (!serverPreviouslyHealthy && serverOnline === 'warning') {
        console.log('warning');
        serverPreviouslyHealthy = false;
        serverStatus.parentElement.classList.remove('server_healthy', 'server_unhealthy');
        serverStatus.parentElement.classList.add('server_warning');
        serverStatus.innerText = `Server status: Possible error with status code ${additionalData}`;
    } else if (serverOnline === 'error') {
        serverPreviouslyHealthy = false;
        serverStatus.innerText = `Error: ${additionalData}`;
        serverStatus.parentElement.classList.remove('server_healthy', 'server_warning');
        serverStatus.parentElement.classList.add('server_unhealthy');
    }
};

const clearData = () =>
    fetch(`http://localhost:${port}/contact-requests`, { method: 'DELETE' })
        .then((r) => r.status)
        .then((status) => {
            console.log(status);
        });

const resetData = () =>
    fetch(`http://localhost:${port}/contact-requests?reset=true`, { method: 'DELETE' })
        .then((r) => r.status)
        .then((status) => {
            console.log(status);
        });

const showData = (show) => {
    if (show) {
        dialog.showModal();
        getData();
        return;
    }
    dialog.close();
    contactRequestData.innerHTML = '';
};

const getData = () =>
    fetch(`http://localhost:${port}/contact-requests`)
        .then(async (r) => await r.json())
        .then((json) => {
            const htmlTable = generateHtmlTable(json);
            contactRequestData.appendChild(htmlTable);
        });

const refreshTableData = () => {
    contactRequestData.innerHTML = '';
    getData();
};

const generateHtmlTable = (jsonData) => {
    if (jsonData.length === 0) {
        const emptyData = document.createElement('p');
        emptyData.innerText = 'No data to display!';
        return emptyData;
    }

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');

    Object.keys(jsonData[0]).forEach((key) => {
        if (key !== 'id') {
            const columnHead = document.createElement('th');
            columnHead.textContent = camelCaseToWords(key);
            headerRow.appendChild(columnHead);
        }
    });

    table.appendChild(headerRow);

    jsonData.forEach((rowData) => {
        const tableRow = document.createElement('tr');
        tableRow.id = rowData.id;
        delete rowData.id;

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

// Injected; Nesting code and pre tags can make the HTML look nasty.
(() => {
    const postRequestExample = {
        name: 'string',
        email: 'string',
        piecesOfInterest: ['string'],
        message: 'string'
    };

    const postResetJson = document.createElement('code');
    postResetJson.innerText = JSON.stringify(postRequestExample, null, 4);
    document.getElementById('post_request').appendChild(postResetJson);
})();

(() => {
    fetch(`port.json`)
        .then(async (r) => await r.json())
        .then((json) => {
            port = json.port || 8000;
            document.querySelectorAll('.port').forEach((e) => (e.innerText = port));
        })
        .then(() => checkPing())
        .catch((error) =>
            console.error(`Unable to retrieve configurable PORT from port.json: ${error}`)
        );
})();

addEventListener('resize', () => {
    if (window.innerWidth > 769) {
        document.querySelector('nav').style.display = 'flex';
    } else {
        document.querySelector('nav').style.display = 'none';
    }
});
