const { dnsParser } = ModuleLoader('utils', 'Utils');

exports.commonApiConfig = async (headers) => {
  if (isEnvDev) {
    return {
      host: `http://10.0.7.73`,
    };
  } else {
    return {
      host: `http://${await dnsParser(headers.host).split(':')[0]}`,
    };
  }
}

exports.hyhiveApiConfig = (headers) => {
  if (isEnvDev) {
    return {
      host: 'http://10.0.7.177',
    };
  } else {
    return {
      host: `http://${headers.host.split(':')[0]}`,
    }
  }
};

exports.infinityApiConfig = (headers) => {
  if (isEnvDev) {
    return {
      host: 'http://10.0.7.76',
      "access-token": 'X7yABwjE20sUJLefATUFqU0iUs8mJPqEJo6iRnV63mI=',
    };
  } else {
    return {
      host: `http://${headers.host.split(':')[0]}`,
      "access-token": 'X7yABwjE20sUJLefATUFqU0iUs8mJPqEJo6iRnV63mI=',
    };
  }
};

exports.hmsApiConfig = (headers) => {
  if (isEnvDev) {
    return {
      host: 'http://10.0.7.142',
      // "access-token": 'ZGEyMGI0NmYtNGU1Ni00ZWVlLTgyZWMtYWRmODQ1NWVlNDI0',
    };
  } else {
    return {
      host: `http://${headers.host.split(':')[0]}`,
      // "access-token": 'ZGEyMGI0NmYtNGU1Ni00ZWVlLTgyZWMtYWRmODQ1NWVlNDI0',
    };
  }
};

exports.apiPort = () => {
  return {
    node_list: '9531',
    node_hms: '9527',
    node_statistical: apiPort().node_statistical,
  };
};
