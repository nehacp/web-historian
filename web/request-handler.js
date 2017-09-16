var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var helpers = require('./http-helpers.js');



const actions = {
  'GET': function (req, res) {
    const path = helpers.getPath(req.url);
  //  debugger;
    if (path === '/' || path.startsWith('/public') || path.includes('loading')) {
      helpers.serveAssets(path, req, res);
    } else {
      let domain = path.slice(1);
      archive.isUrlArchived(domain, (isArchived) => {
        helpers.processData(isArchived, domain, req, res, 200, 404);
      });
    }

  },

  'POST': function (req, res) {
    helpers.collectData(req, (data) => {
      archive.isUrlArchived(data, function (isArchived) {
        helpers.processData(isArchived, data, req, res, 302, 302);
      });
    });
  }
};

exports.actions = actions;

exports.handleRequest = function (req, res) {
  actions[req.method] ? actions[req.method](req, res) : helpers.handleResponse(res, 404);
};
