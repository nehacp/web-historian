var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var parseUrl = require('url');


exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};


//original assets function
// exports.serveAssets = function(res, asset, callback) {
//   // Write some code here that helps serve up your static files!
//   // (Static files are things like html (yours or archived from others...),
//   // css, or anything that doesn't change often.)
// };


// As you progress, keep thinking about what helper functions you can put here!

exports.serveAssets = function(path, req, res) {
  //console.log('PATH!!!!', path);
  let endpoint = (path === '/') ? `${archive.paths.siteAssets}/index.html` : path;
  //const endpoint = `${archive.paths.siteAssets + destination}`;
  fs.readFile(endpoint, function(err, data) {
    if (err) {
      console.error(err);
    } else {
      res.end(data.toString());
    }
  });
};

exports.getPath = function(url) {
  const parsedUrl = parseUrl.parse(url, true);
  return parsedUrl.pathname;
};

exports.collectData = function (request, callback) { 
  let data = '';
  request.on('data', (chunk) => {
    data += chunk;
  }).on('end', () => {
    data = `${data.toString().slice(4)}\n`;
    callback(data);
  });
};

exports.processData = function (isArchived, data, response, statusCode) {
  if (isArchived) {
    fs.readFile(`${archive.paths.archivedSites}/${data}`, function(err, contents) {
      err ? console.error(err) : exports.handleResponse(response, 200, contents.toString());
    });
  } else {
    archive.addUrlToList (data, () => {});
    exports.handleResponse(response, statusCode);
  }
};

exports.handleResponse = function (response, statusCode, data) {
  response.writeHead(statusCode, exports.headers);
  response.end(data);
};

