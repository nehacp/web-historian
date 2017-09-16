var fs = require('fs');
var path = require('path');
var _ = require('underscore');

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),
};

// exports.assets = {
//   '/styles.css': `${exports.paths.siteAssets}/styles.css`,
//   '/loading.html': `${exports.paths.siteAssets}/loading.html`,
//   '/': `${exports.paths.siteAssets}/index.html`
// };

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, function(err, text) {
    if (err) {
      console.error(err);
    } else {
      var textByLine = text.toString().split('\n');
      callback(textByLine);
    }
  });
};

exports.isUrlInList = function(url, callback) {
  fs.readFile(exports.paths.list, function(err, text) {
    if (err) {
      console.error(err);
    } else {
      var exists = text.toString().includes(url);
      callback(exists);
    }
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url, (err) => {
    if (err) { throw err; }
    callback();
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(exports.paths.archivedSites, (err, files) => {
    callback(files.some(file => file === url));
  });
};

exports.downloadUrls = function(urls) {
  urls.forEach( (url) => {
    fs.appendFile(`${exports.paths.archivedSites}/${url}`, '', (err) => {
      if (err) { throw err; }
    });
  });
};
