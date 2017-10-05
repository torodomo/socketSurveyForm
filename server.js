// Load the express module (Where do you think this comes from?)
var express = require("express");
var path = require("path");
var session = require("express-session");
// invoke var express and store the resulting application in var app
var app = express();

// for css static files like css
app.use(express.static(__dirname +'/public'));
// for socket static
app.use(express.static(path.join(__dirname, "./static")));
// for session key
app.use(session({secret: 'jfeohfoelfw'}));

// Setup ejs templating and define the views folder.
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// require body-parser
var bodyParser = require('body-parser');
// use it!
app.use(bodyParser.urlencoded({extended: true}));

// root route
app.get('/', function (req, res){
    console.log("HI")
    res.render('index.ejs');
});

app.post('/submit', function (req, res){
    console.log("POST DATA \n\n", req.body)
    req.session.data = req.body;
    res.redirect('/');
})

var server = app.listen(8000, function() {
    console.log("listening on port 8000");
});
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    console.log("Client/socket is connected!");
    console.log("Client/socket id is: ", socket.id);
    // all the server socket code goes in here
    socket.on( "button_clicked", function (data){
        console.log(data);
        var rand = Math.floor(Math.random() * 1000) + 1;
        socket.emit( 'server_response', {server: data.client, rand: rand});
    })
})