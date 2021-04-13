var mysql=require('mysql');
 var connection=mysql.createConnection({
   host:'localhost',
   user:'root',
   password:'',
   database:'database_name'
 });
connection.connect(function(error){
   if(!!error){
     console.log(error);
   }else{
     console.log('MYSQL Connected');
   }
 });  
module.exports = connection; 