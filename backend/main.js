const express = require('express');
const cors = require('cors');
const fs = require('fs');
const mongoose = require('mongoose');
const uri = 'mongodb+srv://elem:v4qbxHuh@grades.pbevejl.mongodb.net/?retryWrites=true&w=majority&appName=grades';

mongoose.connect(uri)
.then(() => console.log('Connected to MongoDB Atlas!'))
.catch((err) => console.error('Error connecting to MongoDB Atlas:', err));

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', async (req, res) => {
    fs.readFile('data/grades.json', 'utf8', (err, data) =>{
        if(err){
            console.log(err);
        }
        data = JSON.parse(data);
        res.status(200).json(data);
    });
});

app.get('/:name', async (req, res) => {
    fs.readFile('data/grades.json', 'utf8', (err, data) =>{
        if(err){
            console.log(err);
        }
        data = JSON.parse(data).grades.find(grade => grade.name === req.params.name);
        res.status(200).json(data);
    });
});

// app.get('/:')

app.post('/', (req, res) => {
    fs.readFile('data/grades.json', 'utf8', (err, data) =>{
        if(err){
            console.log(err);
        }
        data = JSON.parse(data);
        data.grades.push(req.body);
        fs.writeFile('data/grades.json', JSON.stringify(data), (err) =>{
            if(err){
                console.log(err);
            }
            res.status(201).json(data).redirect('/');
        });
    });
});

app.delete('/:name', (req, res) => {
    fs.readFile('data/grades.json', 'utf8', (err, data) =>{
        if(err){
            console.log(err);
        }
        data = JSON.parse(data);
        data.grades = data.grades.filter(grade => grade.name !== req.params.name);
        fs.writeFile('data/grades.json', JSON.stringify(data), (err) =>{
            if(err){
                console.log(err);
            }
            res.status(200).json(data).redirect('/');
        });
    });
});
app.listen(3001, () => {
    console.log('Server is listening on port 3000');
});