var util = require('util');
var Element = require('page-object-pattern').Element;

function Products(world){
  Element.call(this, world);
}

util.inherits(Products, Element);

Products.prototype.showDetailsByDescription = function(description, callback) {
  this.browser
  .timeoutsAsyncScript(5000)
  .executeAsync(function(textToSearch, done){
    var productIFrame;
    function findIFrame() {
      return Array.prototype.filter.call(document.querySelectorAll('iframe[id^=shopbeam-widget]'), function(iframe){
        var doc = iframe.contentWindow.document;
        var element = doc.body;
        var text = (element.textContent || element.innerText || '').replace(/\s+/g, ' ');
        return text.indexOf(textToSearch) > 0;
      })[0];
    }
    var interval = setInterval(function(){
      productIFrame = findIFrame();
      if (productIFrame) {
        clearInterval(interval);
        var doc = productIFrame.contentWindow.document;
        doc.querySelector('.widget-content').click();
        done();
      }
    }, 100);
  }, description, function(err, result) {
    if (err) {
      callback(err);
      return;
    }
    callback();
  });
};

module.exports = Products;
