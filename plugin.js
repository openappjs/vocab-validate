var vocabValidate = require('./');

module.exports = function vocabValidatePlugin (options) {
  return function (vocab) {
    vocab.validate = vocabValidate(
      vocab.schema,
      options
    );
  };
};
