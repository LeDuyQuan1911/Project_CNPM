const path = require('path');
const express = require('express');
const configViewEngine = (app) => {
    //config ejs
    app.set('view engine', 'ejs');
    app.set('views', "../src" + '/views'); // Set the views directory
    // app.use(express.static('public'));
    app.use(express.static(path.join("./src" , 'public'))); // Set the static files directory
}

module.exports = configViewEngine;