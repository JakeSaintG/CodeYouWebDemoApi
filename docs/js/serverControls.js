const dialog = document.querySelector('dialog');
const contactRequestData = document.getElementById('contact_request_data');
const errorHtml = document.getElementById('server_control_error');

const showServerControls = (open) => {
    if (open) {
        dialog.showModal();
        getData();
        return;
    }
    dialog.close();
    contactRequestData.innerHTML = '';
};

const camelCaseToWords = (camelCase) => {
    const wordsSplit = camelCase.replace(/([A-Z])/g, ' $1');
    return wordsSplit.charAt(0).toUpperCase() + wordsSplit.slice(1);
};

const getData = () =>
    fetch(`http://localhost:${port}/contact-requests`)
        .then(async (r) => await r.json())
        .then((json) => {
            const htmlTable = createDataPreviewTable(json);
            contactRequestData.appendChild(htmlTable);
        })
        .catch((error) => showServerControlError(error));

const clearData = () =>
    fetch(`http://localhost:${port}/contact-requests`, { method: 'DELETE' })
        .then((r) => r.status)
        .then((status) => {
            refreshTableData();
        })
        .catch((error) => showServerControlError(error));

const deleteDataById = (id) =>
    fetch(`http://localhost:${port}/contact-requests?id=${id}`, { method: 'DELETE' })
        .then((r) => r.status)
        .then((status) => {
            refreshTableData();
        })
        .catch((error) => showServerControlError(error));

const resetData = () =>
    fetch(`http://localhost:${port}/contact-requests?reset=true`, { method: 'DELETE' })
        .then((r) => r.status)
        .then((status) => {
            refreshTableData();
        })
        .catch((error) => showServerControlError(error));

const refreshTableData = () => {
    contactRequestData.innerHTML = ''; //Clear anything that may already be there.
    getData();
};

const showServerControlError = (error) => {
    console.error(error);

    errorHtml.innerText = ''; //Clear anything that may already be there.
    errorHtml.style.display = 'flex';

    const errorText = document.createElement('p');
    errorText.innerText = 'Error performing action. Check server status.';

    const closeError = document.createElement('a');
    closeError.onclick = () => hideServerControlError();
    closeError.href = '#!';
    closeError.ariaLabel = 'Close error message.'
    closeError.innerText = 'close error';

    errorHtml.appendChild(errorText);
    errorHtml.appendChild(closeError);
};

const hideServerControlError = () => {
    errorHtml.innerText = '';
    errorHtml.style.display = 'none';
};

const createDataPreviewTable = (jsonData) => {
    if (jsonData.length === 0) {
        const emptyData = document.createElement('p');
        emptyData.innerText = 'No data to display!';
        return emptyData;
    }

    const table = document.createElement('table');
    const tableHeader = createTableHeader(jsonData);
    table.appendChild(tableHeader);

    jsonData.forEach((rowData) => {
        const tableRow = createTableRow(rowData);
        table.appendChild(tableRow);
    });

    return table;
};

const createTableHeader = (jsonData) => {
    const headerRow = document.createElement('tr');

    Object.keys(jsonData[0]).forEach((key) => {
        if (key !== 'id') {
            const columnHead = document.createElement('th');
            columnHead.textContent = camelCaseToWords(key);
            headerRow.appendChild(columnHead);
        }
    });

    const deleteColumnHead = document.createElement('th');
    deleteColumnHead.textContent = 'Remove?';
    headerRow.appendChild(deleteColumnHead);
    return headerRow;
};

const createTableRow = (rowData) => {
    //Add unique ID to table row element and remove it from Obj;
    const tableRow = document.createElement('tr');
    tableRow.id = rowData.id;
    delete rowData.id;

    Object.values(rowData).forEach((value) => {
        const tableCell = document.createElement('td');
        tableCell.textContent = value;
        tableRow.appendChild(tableCell);
    });

    const deleteTableCell = document.createElement('td');
    deleteTableCell.classList.add('centered-cell');
    deleteTableCell.appendChild(createDataDeleteButton(tableRow.id));
    tableRow.appendChild(deleteTableCell);
    return tableRow;
};

const createDataDeleteButton = (idToDelete) => {
    const button = document.createElement('button');
    button.classList = 'icon_btn';
    button.style = 'background-color: rgb(247, 78, 78)';
    button.ariaLabel = 'Deletes contact request from database.';

    const buttonImage = document.createElement('img');
    buttonImage.style = 'height: 1rem';
    buttonImage.alt = 'Delete icon';
    buttonImage.src = './img/trash-solid.svg';
    buttonImage.ariaHidden = 'true';

    button.appendChild(buttonImage);
    button.onclick = () => deleteDataById(idToDelete);

    return button;
};

dialog.addEventListener('click', (event) => {
    /*
        This closes the dialog if the area outside of it is clicked.

        When a dialog is open, its margin takes up the rest of the screen, so clicking outside 
        of it is still considered clicking the dialog element.
        The visible dialog has a nested div that takes up the whole dialog content so clicking there 
        is not considered the dialog element itself.
    */
    if (event.target.nodeName === 'DIALOG') {
        showServerControls(false);
    } else {
        event.stopPropagation();
    }
});
