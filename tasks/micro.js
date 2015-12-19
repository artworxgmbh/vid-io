module.exports = {
  dist: {
    src: '<%= uglify.dist.dest %>',
    options: {
      limit: 2048, // default is 5KB
      gzip: true
    }
  }
};
