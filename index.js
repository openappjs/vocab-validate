var Validator = require('z-schema');
var traverse = require('traverse');
var extend = require('xtend');
var debug = require('debug')('vocab-validate');

module.exports = vocabValidate;

function vocabValidate (vocab) {

  var validator = new Validator();
  var schemas = [vocab];

  // traverse over each node in vocab
  traverse(vocab).forEach(function () {
    // if non-circular dep,
    if (
      this.path[this.level - 2] === "dependencies" &&
      (!this.circular)
    ) {
      // add dep as remote reference
      // TODO handle vocab deps in a non-flat way
      debug("adding vocab dep", this.node);
      schemas.push(this.node);
    }
  });

  if (!validator.validateSchema(schemas)) {
    var err = new Error("invalid schemas");
    err.schemas = schemas;
    err.errors = validator.getLastErrors();
    debug("invalid schemas", err);
    throw err;
  }

  debug("creating validate fn", vocab);

  function validate (data, cb) {
    if (typeof cb === "function") {
      // async
      debug("async validate", data, schemas[0]);
      return validator.validate(data, schemas[0], cb);
    } else {
      // sync
      debug("sync validate", data, schemas[0]);
      var valid = validator.validate(data, schemas[0]);
      if (valid) {
        return valid;
      } else {
        return validator.getLastErrors();
      }
    }
  }

  return validate;
}
