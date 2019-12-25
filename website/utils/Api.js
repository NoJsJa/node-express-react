const serviceUrl = () => {
  console.log(process.env.API_ROOT)
  console.log(process.prod.API_ROOT)
};

global.serviceUrl = serviceUrl();
exports.serviceUrl = serviceUrl();