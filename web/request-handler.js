var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var parseUrl = require('url');
var helpers = require('./http-helpers.js');
// require more modules/folders here!

exports.getPath = function(url) {
  const parsedUrl = parseUrl.parse(url, true);
  //console.log(parsedUrl);
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
  } else if ( method === 'GET' ) {
    let file = pathName.slice(1);
    archive.isUrlArchived(file, (isArchived) => {
      if ( isArchived ) {
        fs.readFile(path.join(archive.paths.archivedSites, pathName), function(err, data) {
          if ( err ) {
            console.error(err);
          } else {
            res.end(data.toString());
          }
        });
      } else {
        res.writeHead(404, helpers.headers);
        res.end();
      }
    });
  } else {
    res.end(archive.paths.list);
  }
};
