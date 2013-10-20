(function() {
    "use strict";
    var express = require("express");
    var path = require("path");
    var http = require("http");
    var api = require("../api-template");

    var app = express();

    app.configure(function() {
        app.set("port", process.env.PORT || 3000);
        app.use(express.logger("dev"));
        app.use(express.bodyParser());
        console.log(__dirname);
        return app.use(express["static"](path.join(__dirname, "/public")));
    });

    api.register(app,'./api-example/api.json');


    http.createServer(app).listen(app.get('port'), function() {
        return console.log("Express server listening on port " + app.get('port'));
    });

}).call(this);