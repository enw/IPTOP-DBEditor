
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , employee = require('./routes/employee')
  , http = require('http')
  , path = require('path');

var app = express();

// basic authentication
app.use(express.basicAuth('frogny', 'frogny'));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
//app.get('/users', user.list);
// just use GET for all during development.  eventually maybe support HTTP verbs...
app.get('/employee/:id', employee.get);
app.get('/employees', employee.list);
app.get('/deleteEmployee/:id', employee.delete);
app.post('/upsertEmployee', employee.upsert);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
