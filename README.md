# CPL-Jumpstart-IMS
Capstone Project from Lithan


# Setup Guide
- The ims folder in the "jumpstart-back-end" is a Spring Boot 3.0.0 REST API application. You can run this application by installing the Spring Boot Extention Pack on Visual Studio Code or just run the application in an IDE like Spring Tool Suite or IntelliJ

- The folder "jumpstart-ims-front-end" is the project folder itself for the front-end of the IMS, the framework used for the front-end is Vite React. Inside this folder also contains the WebSocket Server that will be used for Real-Time Data Updates on the front-end of all instances of an account.

- To run the front end simply execute the commands below on separate terminals
For Vite React
```
npm run dev
```

For the WebSocket Server
```
"node socket.js" to run the websocket server 
or
"nodemon socket.js" to run the websocket server while being able to apply changes made to the file
```
