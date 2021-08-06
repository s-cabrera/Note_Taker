// Dependencies
const express = require('express');
const path = require('path');

//Reading and Writing variables/ imports for db.json
const fs = require('fs');

const PORT = process.env.PORT | 3000;
const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//Getting the index.html page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

//Getting the notes.html page
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));

//Read the data from the db.json
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if(err){throw err}
        let newData = JSON.parse(data);
        console.log(newData);
        newData.forEach((element, id) => {
            element.id = id + 1;
        });
        console.log(newData);
        return res.send(newData);
    });
});

// Write the data to the db.json file
app.post('/api/notes', (req, res) => {
    console.log(req.body);
    fs.readFile('./db/db.json', 'UTF-8', (err, data) => {
       if(err)throw err;
       let jsonData;
       (data != undefined) ? jsonData = JSON.parse(data) : jsonData = Array(0);

       let userData = {
          title: `${req.body.title}`,
          text: `${req.body.text}`
       };

       jsonData.push(userData);

       fs.writeFile('./db/db.json', JSON.stringify(jsonData, null, 2), (err, data) => {
            if(err)throw err;
             console.log('Note saved');
             console.log(data);
            userData.id = jsonData.length;
            console.log(`userData ${userData}`);
            return res.send(userData);
        });
        
    })
});

app.delete('/api/notes/:id/', (req, res) => {
    const id = req.params.id;
    console.log(id);
    fs.readFile('./db/db.json', 'UTF-8', (err, data) => {
        if(err)throw err;
        
        let jsonData = JSON.parse(data);
        jsonData.splice(id - 1, 1);
        fs.writeFile('./db/db.json', JSON.stringify(jsonData, null, 2), (err, data) => {
            if(err)throw err;
             console.log('Note deleted');
             console.log(data);
            
        });

        jsonData.forEach((element, id) => {
            element.id = id + 1;
        });
        return res.send(jsonData);
        
    })
});

// Listener
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
