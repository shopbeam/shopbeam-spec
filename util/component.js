var S = require('string');

function Component(world) {
  this._children = [];
  this.setWorld(world);
  this.updateSel();
}

Component.prototype.component = function(name){
  var child = name ? this.world.pageManager.component(name) :
    new Component();
  child.parent = this;
  child.updateSel();
  this._children.push(child);
  return child;
};

Component.prototype.at = function(selector){
  this._selector = selector;
  this.updateSel();
  return this;
};

Component.prototype.getAbsoluteSelector = function(){
  var selector = [];
  if (this.parent) {
    selector.push(this.parent.getAbsoluteSelector());
  }
  if (this._selector) {
    selector.push(this._selector);
  }
  return selector.join(' ').trim();
};

Component.prototype.updateSel = function(){
  /*
    // allow this type of syntax:
    var page = this.page('cart');
    this.browser.click(page.checkoutButton.s));
  */
  if (!this._selector) {
    this.s = '#' + S('component' + this.constructor.name).dasherize();
    return;
  }
  this.s = this.getAbsoluteSelector();
  this._children.forEach(function(child){
    child.updateSel();
  });
};

Component.prototype.setWorld = function(world){
  this.world = world;
  this.browser = this.world.browser;
  this.config = this.world.config;
  this._children.forEach(function(child){
    child.setWorld(world);
  });
};

module.exports = Component;
