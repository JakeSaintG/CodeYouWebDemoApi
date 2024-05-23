# Contacts API
This ContactRequest API have been developed for the purpose of giving Code:YOU students a local API to practice working with. 

## Synopsis
You have been tasked with developing a web page for an artist that would like intested parties to contact them about various art pieces. They had a backend developer set up this ContactRequest API for them and have supplied this GitHub repository for you to work with. You have complete creative freedom for this contact request form! Best of luck!

## Installation
Before cloning down this repo, first verify that recent versions of Node and npm are installed on you machine.
- Check for installation by running the below commands:
> npm -v
> node -v

- If version number are NOT returned, install Node via your preferred method. Here is a place to get started:
https://nodejs.org/en/download/prebuilt-installer

- If version numbers are returned, go ahead and open a terminal to clone down this repo.

After cloning the repo, use your terminal to navigate (`cd`) to the root project directory that contains the package.json. Use the following npm command to install the API's dependancies:
> npm install 

- build
- start
- safely closing

## Use
### Port
configured in the .env file

### Documentation
Work in Progress

### Resetting Data

## Troubleshooting:
### Mac
If an error comes up for the port already being in use on a Mac:
- Open a terminal and enter the below command to check the process id (PID) assigned to port 8000
  - > sudo lsof -i:8000
  - Note: if the port was altered in the .env file, replace 8000 above with the assigned port.
- Take note of the process ID (PID). This is what you will look for in Activity Monitor for the process to terminate.

### Windows
If an error comes up for the port already being in use on a Windows PC:
``

## Inquiring Minds
While this project is intended for practice making API calls, the hope is that inquiring minds go digging to see what is going on under the hood. There are many concepts in this Express API that have likely not yet be covered yet at this point including TypeScript, Node, Express, Object Oriented Programming, SQLite, and a few others. Ideally, when these concepts are covered in class, this project can also serve as a reference so you can see these topics in action!

NOTE! Most developers would consider this project to be "overly commented". This has been done due to the educational nature of the project. Usually, there is not a need to comment on what every line of code. Consider this a "do as I say, not as I do" moment. 
