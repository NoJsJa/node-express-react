const Permission = {
  check: function () {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve({
          code: 200
        });
      }, 1e3)
    });
  }
};

module.exports = Permission;
