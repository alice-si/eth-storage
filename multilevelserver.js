var multilevel = require('multilevel');
var net = require('net');
var level = require('level');
var settings = require('./test/settings.js');

var db = level(settings.dbPath);

net.createServer(function (con) {
    con.pipe(multilevel.server(db)).pipe(con);
}).listen(3000);