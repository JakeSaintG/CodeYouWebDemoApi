let port = '8000';
let pingInterval = 0;
let serverPreviouslyHealthy = false;
const serverStatus = document.getElementById('server-status');

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
        serverStatus.parentElement.classList.remove('server-unhealthy');
        serverStatus.parentElement.classList.add('server-healthy');
    } else if (!serverOnline) {
        serverPreviouslyHealthy = false;
        serverStatus.parentElement.classList.remove('server-healthy');
        serverStatus.parentElement.classList.add('server-unhealthy');
    }
};

const clearData = () => {
    console.log('clearing data...')
}

const resetData = () => {
    console.log('resetting data...')
}

checkPing();
