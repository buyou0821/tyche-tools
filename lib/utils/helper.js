function resolve(moduleName) {
  return require.resolve(moduleName);
}

module.exports = {
  resolve,
};
