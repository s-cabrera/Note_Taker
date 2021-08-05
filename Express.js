// Dependencies
const express = require('express');
const path = require('path');
//var uniqid = require('uniqid');
const jsonfile = require('jsonfile')

//Reading and Writing variables/ imports for db.json
const fs = require('fs');
//const { Buffer } = require('buffer');

const app = express();
const PORT = process.env.PORT | 3001;


// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//Getting the index.html page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

//Getting the notes.html page
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));

//app.delete('api/notes/:id', (req, res) => {});

//Read the data from the db.json
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if(err){throw err}
        let newData = JSON.parse(data);
        console.log(newData);
        return res.send(data);
    });
});

// Write the data to the db.json file
app.post('/api/notes', (req, res) => {
    
    console.log(req.body);
    // let loadedData = JSON.parse(req.body);
    // console.log(loadedData);

    let data = "\n[\n" + "\t{" + `\t\t"title": "${req.body.title}",\n` + 
        `\t\t"text": "${req.body.text}"\n` + "\t}\n" + "]\n";

    fs.appendFile('./db/db.json', data, (err, data) => {
        if(err)throw err;
        console.log('Note saved');
        console.log(data);
        //return res.send(data);
    });

    fs.readFile('./db/db.json', (err, data) => {
        if(err){throw err}
        console.log(JSON.parse(data));
        // return res.send(data);
    });

    //uniqid.process()
});

// Listener
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
