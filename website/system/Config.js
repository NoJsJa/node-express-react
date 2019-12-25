exports.commonApiConfig = () => {
  if (isEnvDev) {
    return  '10.0.7.36/nodes'
  } else {
    return  '10.0.7.34/nodes'
  }
}

exports.hyhiveApiConfig = () => {
  if (isEnvDev) {
    return  '10.0.7.36/nodes'
  } else {
    return  '10.0.7.34/nodes'
  }
}

exports.infinityApiConfig = () => {
  if (isEnvDev) {
    return  '10.0.7.36/nodes'
  } else {
    return  '10.0.7.34/nodes'
  }
}
