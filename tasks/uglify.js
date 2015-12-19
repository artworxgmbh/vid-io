module.exports = {
  options: {
    banner: '<%= banner %>',
    compress: {
      drop_console: true
    }
  },
  dist: {
    src: '<%= concat.dist.dest %>',
    dest: 'dist/<%= pkg.name.replace(/.js$/, "") %>.min.js'
  }
};
