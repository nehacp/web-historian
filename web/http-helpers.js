var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var parseUrl = require('url');
var handler = require('./request-handler.js');


exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html',
};


//original assets function
// exports.serveAssets = function(res, asset, callback) {
//   // Write some code here that helps serve up your static files!
//   // (Static files are things like html (yours or archived from others...),
//   // css, or anything that doesn't change often.)
// };


// As you progress, keep thinking about what helper functions you can put here!

exports.serveAssets = function(path, req, res, statusCode = 200) {
  debugger;
  if (path === '/') {
    path = `${archive.paths.siteAssets}/index.html`;
  // } else if (path.includes('loading')) {
  //   path = archive.paths.siteAssetDir + path;
  } else {
    path = archive.paths.siteAssetDir + path;
  }
//  let link = path.match(/index.html|loading.html|styles.css/)[0];
  // console.log('link',link[0]);
  // console.log('link', link);
  fs.readFile(path, function(err, data) {
    if (err) {
      console.error(err);
    } else {
      headers = exports.headers;
      if (path.match(/css/) !== null) {
        headers['Content-Type'] = 'text/css';
      } else {
        headers['Content-Type'] = 'text/html';
        //headers['Location'] ='http://127.0.0.1:8080/'+ link;
      //  const { url } = req;
      }
      exports.handleResponse(headers, res, statusCode, data);
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

exports.processData = function (isArchived, data, req, response, foundCode, notFound) {
  const { headers } = exports.headers;
  //headers.Location = 'http://127.0.0.1' + data;
  if (isArchived) {
    fs.readFile(`${archive.paths.archivedSites}/${data}`, function(err, contents) {
      if (err) {
        console.error(err);
      } else {
        exports.handleResponse(headers, response, foundCode, contents.toString());
      }
    });
  } else {
    if (foundCode === 200) {
      exports.handleResponse(headers, response, notFound);
    } else {
      archive.addUrlToList (data, () => {});
      exports.serveAssets('/public/loading.html', req, response, notFound);
    }
  }
};

exports.handleResponse = function (headers, response, statusCode, data) {
  response.writeHead(statusCode, headers);
  response.end(data);
};
