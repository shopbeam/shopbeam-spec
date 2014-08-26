module.exports = function() {

  this.Given(/^I visit "([^"]*)"$/, function (url, callback) {
    this.visit(url, callback);
  });

};
