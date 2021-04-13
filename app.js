const express = require('express');
const bodyParser = require('body-parser');
var qString   = require('querystring');
var connection  = require('./db');
var app      = express();
server = require('http').createServer(app),
io = require('socket.io').listen(server);

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//send data using socket io
io.on('connection', (client) => {
	connection.query("select * from table_name ", function(err,results){
		if(err) throw err;
		io.emit('datastrame', results);
	});
    console.log("Socket connected.")
})

//handle MQTT
var mqttHandler = require('./mqtt_handler');
//run mqtt
var mqttClient = new mqttHandler();
mqttClient.connect();


//handle restful api
app.get('/',(req, res) => {
    connection.query("select * from table_name",function(err,results){
        if(err) throw err;
        res.send(JSON.stringify({"status": 200, "error": false, "data": results}));
    });
})

app.get('/:id',(req, res) => {
    connection.query("select * from table_name where ?",{ id : req.params.id },function(err,results){
        if(err) throw err;
        res.send(JSON.stringify({"status": 200, "error": false, "data": results}));
    });
});

app.post('/add',(req, res) => {
    var data=req.body //or data={name_parameter:req.body.name_parameter,name_parameter:req.body.name_parameter, name_parameter:req.body.name_parameter, n}
    connection.query("insert into table_name set ?", data,function(err,results){
        if(err) throw err;
        res.send(JSON.stringify({"status": 201, "error": false, "data": data}));
    });
})

app.put('/:id',(req, res) => {
    var data=req.body
    connection.query("update table_name set ? where ?",[ data, {id : req.params.id } ], function(err,results){
        if(err) throw err;
        res.send(JSON.stringify({"status": 200, "error": false, "response": "data has been updated"}));
    });
});

app.delete('/:id',(req, res) => {
    connection.query("delete from table_name where ?",{id : req.params.id },function(err,results){
      if(err) throw err;
        res.send(JSON.stringify({"status": 200, "error": false, "response": "data has been deleted"}));
    });
});


//HTTP handle IOT
app.post('/send',(req, res) => {	
	var data=req.body //or data={name_parameter:req.body.name_parameter,name_parameter:req.body.name_parameter, name_parameter:req.body.name_parameter, n}
	connection.query("insert into table_name set ?",data, function(err,results){
	if(err) throw err;
		connection.query("select * from table_name", function(err,results){
			if(err) throw err;
			io.emit('datastrame', results);
		});
		res.send(JSON.stringify({"status": 200, "error": false, "response": "Data created via http"}));
	});
})


server.listen(3000, function () {
    console.log('App listening on port 3000');
});