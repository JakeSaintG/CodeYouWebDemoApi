let port = 8000;
let pingInterval = 0;
let serverPreviouslyHealthy = false;
const serverStatus = document.getElementById('server_status');

const addScreenReadOnlyElement = ( HTMLElement, screenReaderText ) => {
    /*
        Some elements don't support aria-label so you must work around it with css.
        - https://tailwindcss.com/docs/screen-readers
        - https://bootcamp.uxdesign.cc/when-to-use-aria-label-or-screen-reader-only-text-cd778627b43b
    */
    const screenReaderOnly = document.createElement('span');
    screenReaderOnly.className = 'sr-only';
    screenReaderOnly.textContent = screenReaderText;
    HTMLElement.appendChild(screenReaderOnly);
}

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

// Usually, we wouldn't want to show a user the exact error message.
// In this case, for this developer education tool, we'll break that rule.
const showServerHealth = (serverOnline, additionalData) => {
    if (!serverPreviouslyHealthy && serverOnline === 'healthy') {
        serverPreviouslyHealthy = true;

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

const toggleMobileMenu = () => {
    const menuState = document.querySelector('nav');

    if (menuState.style.display !== 'flex') {
        menuState.style.display = 'flex';
    } else {
        menuState.style.display = 'none';
    }
};

fetch(`./port.json`)
    .then(async (r) => await r.json())
    .then((json) => {
        port = json.port || 8000;
        document.querySelectorAll('.port').forEach((e) => (e.innerText = port));
    })
    .then(() => checkPing())
    .catch((error) =>
        console.error(`Unable to retrieve configurable PORT from port.json: ${error}`)
    );

/*
    <code> element injection; 
    Nesting <code> and <pre> tags can make the HTML file can look nasty.
*/ 
(() => {
    const postRequestExample = {
        name: 'string',
        email: 'string',
        piecesOfInterest: ['string'],
        message: 'string'
    };

    const postResetJson = document.createElement('code');
    addScreenReadOnlyElement(postResetJson, 'JSON code block for ');
    postResetJson.innerText = JSON.stringify(postRequestExample, null, 4);
    document.getElementById('post_request').appendChild(postResetJson);
})();

addEventListener('resize', () => {
    if (window.innerWidth > 769) {
        document.querySelector('nav').style.display = 'flex';
    } else {
        document.querySelector('nav').style.display = 'none';
    }
});
