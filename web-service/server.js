/*
    server.js
    main server script for our task list web service
*/
var port = 8080;

//load all modules we need
//expresss web server framework
var express = require('express');

//sqlite library
var sqlite = require('sqlite3');

//create new express app
var app = express();

//body parser library
var bodyParser = require('body-parser');

//tell express to serve static files from the /static subdirectory
app.use(express.static(__dirname + '/static'));

//tell express to parse post body data as json
app.use(bodyParser.json());

app.get('/api/tasks', function(req, res, next){
    var sql = 'select rowid,title,done,createdOn from tasks where done != 1';
    db.all(sql, function(err, rows){
        if(err) {
            return next(err);
        }

        res.json(rows);
    });
});

//when someone posts to /api/tasks...
app.post('/api/tasks', function(req, res, next){
    var newTask ={
        title: req.body.title,
        done: false,
        createdOn: new Date()
    };
    var sql = 'insert into tasks(title,done,createdOn) values(?,?,?)';
    db.run(sql, [newTask.title, newTask.done, newTask.createdOn], function(err){
        if(err){
            return next(err);
        }

        res.status(201).json(newTask);
    });
});

//create database
var db = new sqlite.Database(__dirname + '/data/tasks.db', function(err){
    if(err){
        throw err;
    }

    var sql = 'create table if not exists ' +
        'tasks(title string, done int, createdOn, datetime)';
    db.run(sql, function(err){
        if(err){
            throw err;
        }
    });

    //start the server
    app.listen(port, function(){
        console.log('server is listening on http://localhost:' + port);
    });


});

