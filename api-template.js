/*
 * api-template
 *
 * Copyright 2013, Acatl Pacheco
 * Licensed under the MIT License.
 *
*/
(function() {
    "use strict";
    var fs = require("fs");
    var mustache = require("mustache");
    var datafixture = require("datafixture.js");

    var extractData = function(tempalte){
        var separator = "--";
        var tokens = [];
        if(tempalte.indexOf(separator)===0) {
            tokens = tempalte.split(separator);
            console.dir(tokens);
            return tokens[2];
        }
        return tempalte;
    };

    var buildResponse = function(pathSignature, path, request) {
        var header = path.header || {};
        var responseDefinition = path.response || {};
        var sourceStreamPath;
        var sourceStream;
        var template;
        var output = "";
        var data = null;
        var step = "building response";

        request = request || {};
        try {
            
            if (typeof responseDefinition === "string") {
                sourceStreamPath = responseDefinition;
            } else {
                sourceStreamPath = responseDefinition.data;
            }

            step = "read template [" + responseDefinition.template +"]";
            if (responseDefinition.template) {
                template = extractData(fs.readFileSync(responseDefinition.template, "utf-8"));
            }

            step = "read source [" + sourceStreamPath +"]";
            sourceStream = extractData(fs.readFileSync(sourceStreamPath, "utf-8"));
            
            if (responseDefinition.dynamic === true) {
                step = "parsing JSON source [" + sourceStreamPath +"]";
                data = JSON.parse(sourceStream);
                step = "transforming source data";
                output = data = sourceStream = datafixture.generate(data);
            }

            if (template) {
                data.request = request;
                step = "mustache render [" + responseDefinition.template +"]";
                output = mustache.render(template, data || JSON.parse(sourceStream));
            } else {
                output = sourceStream;
            }
        } catch(error) {
            output = {
                step: step,
                error: error.message
            };
            console.error("API [ERROR] STEP:", step, " MESSAGE:", error.message);
        }

        return {
            header: header,
            output: output
        };
    };

    var registerPath = function(app, pathSignature, path) {
        console.info("API:register path:", pathSignature);

        app.get(pathSignature, function(request, response) {
            var responseObject = buildResponse(pathSignature, path, request);
            response.set(responseObject.header);
            response.send(responseObject.output);
        });
    };

    exports.register = function(app, apiPath) {
        var apiStream = fs.readFileSync(apiPath, "utf-8");
        var api = {};
        var pathKey, paths, pathDefinition;
        try {
            api = JSON.parse(apiStream);
        } catch (error) {
            console.error("[" + apiPath + "] not valid JSON");
            process.exit(1);
        }

        paths = api.api;
        for (pathKey in paths) {
            pathDefinition = paths[pathKey];
            registerPath(app, pathKey, pathDefinition);
        }
    };

}).call(this);