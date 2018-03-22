// https://github.com/ducin-public/mock-rest-api/blob/master/generate.js

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const jsf = require('json-schema-faker');

const readFileAsync = promisify(fs.readFile);
function readJSONPromise(filename){
    return readFileAsync(filename)
        .then(data => JSON.parse(data));
};

const writeFileAsync = promisify(fs.writeFile);
function writeJSONPromise(filename, json){
    return writeFileAsync(filename, JSON.stringify(json, null, 2));
}

function appendIds(collection){
    var id = 0;
    collection.forEach(item => item.id = ++id);
    return collection;
}

var arrayGen = count => Array(count).join().split(',').map(x => undefined)
var generateCollection = (schema, count) => arrayGen(count).map(x => jsf(schema))

var filePromises = [
    'api/profiles/profile.schema.json',
].map(file => readJSONPromise(file))

// in case single file read fails
filePromises.forEach(p => p.catch(errInfo => console.error("Failed to read file: ", errInfo)));

Promise.all(filePromises)
.then(([profiles]) => {
    return {
        profiles: generateCollection(profiles, 500),
    };
})
.then(result => {
    const outputFile = path.join(__dirname, 'db.json');
    writeJSONPromise(outputFile, result);
    return result;
})
.then(() => console.info("File saved successfully."))
.catch((err) => console.error("DB files save failed:", err));
