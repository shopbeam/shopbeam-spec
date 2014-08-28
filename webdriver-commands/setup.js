var requireDir = require('require-dir');
var S = require('string');
var commands = requireDir('.');

module.exports = function setupWebDriverCommands(browser) {
  Object.keys(commands).forEach(function(name){
    if (name === 'setup') {
      return;
    }
    var camelName = S(name).camelize();
    browser.addCommand(camelName, commands[name]);
  });
};
