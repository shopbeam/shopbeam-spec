
module.exports = function scrollIntoView(selector, callback) {
  var self = this;
  this.element(selector, function(err, res){
    if (err) {
      return callback(err);
    }
    self
      .timeoutsAsyncScript(3000)
      .executeAsync(function(elementSelector, done){
        var element = document.querySelector(elementSelector);
        if (element) {
          if (element.scrollIntoViewIfNeeded) {
            element.scrollIntoViewIfNeeded();
          }
          if (element.scrollIntoView) {
            element.scrollIntoView();
          }
        }
        done();
    }, selector, function(err, res) {
      if (err) {
        return callback(err);
      }
      callback();
    });
  });
};
