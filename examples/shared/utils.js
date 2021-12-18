function log(object) {
  console.log(JSON.stringify(object, undefined, 2));
}

module.exports = { log };
