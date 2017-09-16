var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var parseUrl = require('url');
// require more modules/folders here!

exports.getPath = function(url) {
  const parsedUrl = parseUrl.parse(url, true);
  return parsedUrl.pathname;
};

exports.handleRequest = function (req, res) {
  const {method, url} = req;
  const pathName = exports.getPath(url);
  if ( method === 'GET' && (pathName === '/' || pathName.startsWith('/public')) ) {
    var destination = (pathName === '/') ? '/index.html' : '/styles.css';
    fs.readFile(path.join(archive.paths.siteAssets, destination), function(err, data) {
      if ( err ) {
        console.error(err);
      } else {
        res.end(data.toString());
      }
    });
  } else {
    res.end(archive.paths.list);
  }
};
