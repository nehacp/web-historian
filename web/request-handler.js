var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var helpers = require('./http-helpers.js');



const actions = {
  'GET': function (req, res) {
    const path = helpers.getPath(req.url);
    if (path === '/' || path.startsWith('/public')) {
      helpers.serveAssets(path, req, res);
    } else {
      let domain = path.slice(1);
      archive.isUrlArchived(domain, (isArchived) => {
        helpers.processData(isArchived, domain, res, 404);
      });
    }

  },

  'POST': function (req, res) {
    helpers.collectData(req, (data) => {
      archive.isUrlArchived(data, function (isArchived) {
        helpers.processData(isArchived, data, res, 302);
      });
    });
  }
};

exports.actions = actions;

exports.handleRequest = function (req, res) {
  actions[req.method] ? actions[req.method](req, res) : helpers.handleResponse(res, 404);
};
