var jsonschema = require('jsonschema');


exports.validateConfData = function validateConfData(confData) {
  var schema = {
    type: 'object',
    properties: {
      images: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            src: {
              type: 'string'
            },
            pos: {
              type: 'array',
              items: {
                type: 'number',
                minimum: 0
              }
            },
            size: {
              type: 'array',
              items: {
                type: 'number',
                minimum: 0
              }
            },
            dest: {
              type: 'string'
            }
          },
          required: ['src', 'pos', 'size', 'dest']
        }
      }
    },
    required: ['images']
  };
  var validated = jsonschema.validate(confData, schema);
  if (validated.errors.length > 0) {
    throw new Error(validated.errors.map(function(err) {
      return err.message;
    }).join(', '));
  }
};
