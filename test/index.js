var test = require('tape');

var vocabValidate;

test("require module", function (t) {
  vocabValidate = require('../');
  t.equal(typeof vocabValidate, 'function');
  t.end();
});

test("simple Thing object vocab", function (t) {
  var vocab = {
    id: "Thing",
    type: "object",
    properties: {
      name: {
        type: "string",
      },
      description: {
        type: "string",
      },
    },
  };

  var goodData = [{
    name: "pencil",
  }];
  
  var badData = [{
    name: 1,
  }];

  var validate = vocabValidate(vocab);
  check(t, validate, goodData, badData);
  t.end();
});

test("single-dep Person object vocab", function (t) {
  var vocab = {
    id: "Person",
    type: "object",
    properties: {
      things: {
        type: "array",
        item: {
          $ref: "Thing",
        },
      },
    },
    dependencies: {
      "Thing": {
        id: "Thing",
        type: "object",
        properties: {
          name: {
            type: "string",
          },
        },
      },
    },
  };

  var goodData = [{
    things: [{
      name: "pencil",
    }],
  }];
  
  var badData = [{
    things: {
      name: "pencil",
    },
  }];

  var validate = vocabValidate(vocab);
  check(t, validate, goodData, badData);
  t.end();
});

function check (t, validate, goodData, badData) {
  t.ok(validate);
  goodData.forEach(function (data) {
    var validation = validate(data);
    t.equal(validation, true);
  });
  badData.forEach(function (data) {
    var validation = validate(data);
    t.notEqual(validation, true);
    t.equal(Array.isArray(validation), true);
  });
}
