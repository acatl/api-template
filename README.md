# api-template

Define and build your project's api with mocked data. 

## What is this?

**api-template** is a lightweight api generator, it uses 
[mustache.js](https://npmjs.org/package/mustache) and 
[datafixture.js](https://github.com/acatl/datafixture.js) to build from simple 
hardcoded server responses up to complex dynamically generated api results.

It gives you enough control to:

* map a path to a source
* set the reponse's http headers (optional)
* define the response of different types:
    * hardcoded (static)
    * templated response (mustache + json)
    * dynamic templated response (mustache + json + datafixture)

## Getting Started

### Dependencies

* [NodeJS](http://nodejs.org/)
* [Express](http://expressjs.com/)
* [mustache.js](https://npmjs.org/package/mustache)
* [datafixture.js](https://npmjs.org/package/datafixture.js)

### Install

```bash
npm install api-template --save-dev
```

## How it works

You will need to create a json file with your API's definition. The file will
need to have the following structure: 

```json
{
    "version": "0.1.0",
    "api": {
        "/api/home": {
            "header": {
                "Content-Type": "application/json"
            },
            "response": "./api/home.json"
        },
        "/api/section": {
            "header": {
                "Content-Type": "application/json"
            },
            "response": {
                "data": "./api/section.json",
                "template": "./api/section.template"
            }
        }
    }
}
```
### api hash

`api` : collection of api path definitions

the `api` collection exppects a hash of objects, each `key` is the actual path 
that **expressjs** will match against each service created.

### path definition

```json
"/api/home": {
    "header": {
        "Content-Type": "application/json"
    },
    "response": "./api/home.json"
}
```

#### path's definition key

`"/api/home"` -> will be accesed at `http://localhost:3000/api/home`

#### header definition

```json
"header": {
    "Content-Type": "application/json"
},
```

This is **optional**, if defined, its a hash of header settings, the object will get
passed directly to express's `response.set()` method, more info at:
[http://expressjs.com/api.html#res.set](http://expressjs.com/api.html#res.set).


#### response definition

The response object where the magic happens, it can be defined in multiple ways:

**1 - most simple:** 

This will tell `api-template` to respond with the content of the file being 
mapped to. Currenty only supports text based files.

```json
"response": "./api/home.json"
``` 

**2 - rendered teamplte with json source:** 

Response will be the result of the content of `"data"` json file passed into 
`mustache.render()`.

```json
"response": {
    "data": "./api/book.json",
    "template": "./api/book.template"
}
```

**3 - rendered teamplte with dynamic json source:** 

Same process as with option 2, the difference is that the json source will now be 
passed through [datafixture.js](https://github.com/acatl/datafixture.js). This 
is done by setting the flag `"dynamic"` to `true`:

```json
"response": {
    "data": "./api/books.json",
    "template": "./api/books.template",
    "dynamic": true
}
```

## url routing and query paramters

Because we are using ExpressJS we can generate dynamic routes. 

Some examples:
* `/home` => http://localhost:3000/home
* `/book/:bookId` => http://localhost:3000/book/99921-58-10-7
* `/author/:authorId/books/new` => http://localhost:3000/author/darek/books/new

ExpressJS passes a request object for each service, this one has all information 
passed into the url, including route variables and query variables. This object
is passed into the JSON Object that is passed into a template, when template is 
defined. Giving you full access to it to be used in any way you want on the template.

Example of its implementation:

route definition:

```json
"/api/isbn/:isbn": {
    "header": {
        "Content-Type": "application/json"
    },
    "response": {
        "data": "./api/isbn.json",
        "template": "./api/isbn.template",
        "dynamic": true
    }
}
```

file: ./api/isbn.template
```json
{
    "book": {
        "isbn": "{{request.params.isbn}}",
        "title": "{{book.title}}"
    }
}
```

Making a call to `http://localhost:3000/api/isbn/SOME-ISBN-NUMBER` its output 
could look like:

```json
{
    "book": {
        "isbn": "SOME-ISBN-NUMBER",
        "title": "vitae dignissim"
    }
}
```

## Next Steps:

- complete RESTful support.
- support for nested sources, this will allow each service to share JSON results






























