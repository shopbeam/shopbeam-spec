
module.exports = function switchToFrame(selector, callback) {
  var self = this;
  this.element(selector, function(err, res){
    if (err) {
      return callback(err);
    }
    self.frame(res.value, callback);
  });
};
