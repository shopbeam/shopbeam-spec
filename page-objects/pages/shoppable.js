var util = require('util');
var Page = require('../../util/page');

function Shoppable(){
  Page.call(this);
  this.products = this.component('products');
  this.productDetails = this.component('product-details');
  this.cart = this.component('cart');
}

util.inherits(Shoppable, Page);

module.exports = Shoppable;
