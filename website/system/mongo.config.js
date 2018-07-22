const mongoConfig = {

    cookieSecret: 'infinity',
    db: 'infinity',
    host: '127.0.0.1',
    port: 27017,
    user: "infinity",
    password: "123456",
    options: {
      auto_reconnect: true,
      poolSize: 10,
      promiseLibrary: global.Promise
    },
    connectionString: "mongodb://127.0.0.1:27017/infinity"
};

module.exports = mongoConfig;
