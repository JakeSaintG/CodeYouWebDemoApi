# Contacts API
This ContactRequest API has been developed for the purpose of giving Code:YOU students a local API to practice working with.

## Synopsis
You have been tasked with developing a web page for an artist that would like interested parties to contact them about various art pieces. They had a backend developer set up this Contact Request API for them and have supplied this GitHub repository for you to work with. You have complete creative freedom for styling this contact request form! Best of luck!

## Installation
Before cloning down this repo, first verify that recent versions of Node and npm are installed on your machine.
- Check for installation by running the below commands:
> npm -v
> node -v

- If version numbers are NOT returned, install Node via your preferred method. Here is a place to get started:
https://nodejs.org/en/download/prebuilt-installer

- If version numbers are returned, go ahead and open a terminal to clone down this repo.

After cloning the repo, use your terminal to navigate (`cd`) to the root project directory that contains the package.json. Use the following npm command to install the API's dependencies:
> npm install

After installing dependencies, run the below build command to compile the API.
> npm run build

A `build` directory will appear. This is the compiled code that will run in Node. Run the below command to start up the API!
> npm run start

**Safely closing the API is necessary to ensure that the port it was running on is freed up. The safest way to do this is to click into the terminal and enter `ctrl` + `c` on both Windows and Mac.**

## Documentation
To view the docs, ensure that the server is running and navigate to `http://localhost:8000/documentation/` in your browser of choice.

## Port Troubleshooting
The default local port for the API to run on is 8000 (`localhost:8000`). If you attempt to run the API and get an error stating that the port is already in use, you may need to change the port listed in the .env file. If you feel that this port should not be taken and an old instance of the API is still running, some troubleshooting may be needed.

It's possible that the port supplied in the .env file is already in use. It's also possible to shut down the API without allowing it to close the port that it is running on. If this is the case, manual intervention is needed. For the easiest path, resetting your machine will likely free up that port. However, there are also easy ways to release the port without restarting your computer. See below for Windows and Mac instructions for doing so. **The below examples assume that the port is set to 8000.**

### Mac
If an error comes up regarding the default port already being in use on a Mac, and you **KNOW** you want to terminate the port:
- Open a terminal and enter the below command to check the process id (PID) assigned to port 8000.
  - > sudo lsof -i:8000
  - Note: if the port was altered in the .env file, replace 8000 from the above command with the assigned port.
- Take note of the process ID (PID). This is what you will look for in Activity Monitor to identify the process to terminate.
- Open Activity Monitor and look in the list for the process ID (PID) in the previous step. The process name should be "node".
- Select this node process and then click the stop sign icon with an X on the top. Quit the program and attempt to start the API again.

### Windows
If an error comes up regarding the default port already being in use on a Windows PC, and you **KNOW** you want to terminate the port:
- Open a terminal and enter the below command to check the process id (PID) assigned to port 8000.
  - > netstat -ano | findstr :8000
  - Note: if the port was altered in the .env file, replace 8000 from the above command with the assigned port.
- Take note of the process ID (PID). This is what you will look for in Task Manager to identify the process to terminate.
- Open Task Manager:
  - Make sure "More details" is expanded (bottom left)
  - Go to the "Details" tap and look in the list for the process ID (PID) in the previous step. The process name should be "node.exe".
	- **If you do not see a PID column, it can be added by right clicking on the columns, clicking "Select columns", and adding "PID".**
- Right click on this node.exe process and select "End Process". Confirm and attempt to start the API again.

## Inquiring Minds
While this project is intended for practice making API calls, I hope that inquiring minds go digging to see what is going on "under the hood". There are many concepts in this Express API that have likely not yet been covered. These include TypeScript, Node, Express, file management, SQLite, and a few others. Ideally, when these concepts are covered in class, this project can also serve as a reference so you can see these topics in action!

This API stores contact request data in both JSON format and in a DB to give examples of both. Both formats are written to but really one can be used for retrieval (without getting too complicated). To switch between which one is read from, alter the .env file. 

NOTE! Most developers would consider this project to be "overly commented". This has been done due to the educational nature of the project. Usually, there is no need to comment on every line of code. Consider this a "do as I say, not as I do" moment.
