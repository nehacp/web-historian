// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers.js');
var helper = require('../web/http-helpers.js');


var checkIfArchived = function () {

  archive.readListOfUrls(list => {
    list.forEach(site => {
      archive.isUrlArchived(site, (exists) => {
        if (!exists) {
          helper.downloadSite2(site);
        }
      });
    });
  });
};

checkIfArchived();
