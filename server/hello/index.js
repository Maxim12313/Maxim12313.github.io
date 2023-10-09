const express = require('express');           // use the express library
const app = express();                        // create an express application called app
//const port = 9013;                            // THIS SHOULD BE YOUR ASSIGNED PORT NUMBER

function hello_handler(request, response) {   // a function to handle hello requests
    response.send('Hello, World!');
}

app.get('/hello', hello_handler);             // when we get a request for /hello, call the hello_handler function

app.listen(port);                             // listen for requests on your port number