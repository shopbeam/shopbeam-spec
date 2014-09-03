var S = require('string');

var fillableTypes = [
  'text',
  'textarea',
  'select',
  'checkbox',
  'email',
  'tel',
  'number'
];

module.exports = function fillFields(data, callback) {
  var self = this;
  this.executeAsync(function(done){
    var fields = Array.prototype.slice.call(document.querySelectorAll('input, select, textarea'));
    fields = fields.filter(function(element) {
        return !!element.getAttribute('name');
      }).map(function(element) {
        return {
          name: element.getAttribute('name'),
          type: (element.getAttribute('type') || element.tagName).toLowerCase()
        };
      });
    done(fields);
  }, function(err, res){
    if (err) {
      callback(err);
      return;
    }
    var fields = res.value;
    fields.forEach(function(field){
      if (fillableTypes.indexOf(field.type) < 0){
        return;
      }
      var camelName = S(field.name).camelize();
      var fieldValue = data[camelName];
      if (typeof fieldValue === 'undefined' && fieldValue !== null) {
        return;
      }
      var method = field.type === 'select' ? 'selectValue' : 'setValue';
      if (field.type === 'checkbox') {
        method = 'selectValue';
        if (typeof fieldValue === 'boolean' || typeof fieldValue === 'number') {
          fieldValue = fieldValue ? 'on' : 'off';
        }
      } else {
        fieldValue = fieldValue.toString();
      }
      self = self.scrollIntoView('[name=\"'+field.name+'\"]');
      self = self[method]('[name=\"'+field.name+'\"]', fieldValue);
    });
    self.call(callback);
  });
};
