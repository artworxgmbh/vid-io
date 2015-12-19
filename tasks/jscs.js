module.exports = {
  options: {
    config: '.jscs.json'
  },
  lib: [
    //'lib/**/*.js' <-- till "validateIndentation" works with comments
  ],
  test: ['test/spec/{,*/}*.js'],
  gruntfile: ['Gruntfile.js', 'tasks/{,*/}*.js']
};
