
function Component(){
  this._children = [];
}

Component.prototype.component = function(name, selector){
  var ComponentType = require('../page-objects/components/' + name);
  var child = new ComponentType();
  child.parent = this;
  if (selector) {
    child.childSelector = selector;
  }
  this._children.push(child);
  return child;
};

Component.prototype.setBrowser = function(browser){
  this.browser = browser;
  this._children.forEach(function(child){
    child.setBrowser(browser);
  });
};

module.exports = Component;
