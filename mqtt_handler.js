const mqtt = require('mqtt');
var connection  = require('./db');

class MqttHandler {
  constructor() {
    this.mqttClient = null;
    this.host = 'mqtt://192.168.0.1'; // ip address broker
    this.username = null; // mqtt credentials if these are needed to connect
    this.password = null;
  }
  
  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.host, { username: this.username, password: this.password });

    // Mqtt error calback
    this.mqttClient.on('error', (err) => {
      console.log(err);
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on('connect', () => {
      console.log('MQTT Connected');
    });

    // mqtt subscriptions Topic
    this.mqttClient.subscribe('topic_name', {qos: 0});

    // When a message arrives, console.log it
    this.mqttClient.on('message', function (topic, message) {
		var data=JSON.parse(message.toString())
		//or data={name_parameter:data.name_parameter,name_parameter:data.name_parameter, name_parameter:data.name_parameter, n}
		connection.query("insert into table_name set ?",data, function(err,results){
			if(err) throw err;
			connection.query("select * from parkir ", function(err,results){
				if(err) throw err;
				io.emit('datastrame', results);
			});
			console.log('Data created via mqtt');
		});
    });

    this.mqttClient.on('close', () => {
      console.log('MQTT Disconnected');
    });
  }
}

module.exports = MqttHandler;
