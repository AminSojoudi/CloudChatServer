var http = require("http");
var url = require("url");
var fs = require("fs");
var querystring = require("querystring");
var server;

server = http.createServer(function (req,res)
    {
        var path = url.parse(req.url).pathname;                
            
        switch(path)
        {
            case '/' :
                fs.readFile(__dirname + '/chatclient.html' ,'utf8', function(err , data){
                    if(err) return send404(res);
                    res.writeHead(200 , {'content-type' : 'text/html'});
                   // console.log();
                    data = data.replace("NEWUSER" , querystring.parse(url.parse(req.url).query).name);
                    res.write(data , 'utf8');
                    res.end();
                });
                break;
                
            default :
                    send404(res) ; 
                break;      
        }
    
    
    
    });

send404 = function(res)
{
    res.writeHead(404);
    res.write("404");
    res.end();
};

server.listen(8080);
console.log("Server Started");

var io = require('socket.io').listen(server);

io.sockets.on( 'connection' , function(socket){
    console.log("connection " + socket.id + " accepted.!");
    
    socket.on('disconnect' , function(){
        console.log("connection " + socket.id + " terminated.!");
    });
    
    socket.on('message' , function(message){
        io.sockets.emit('chat' , socket.id , message);
    });
});



