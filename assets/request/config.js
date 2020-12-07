const requestUrls = {
  Dev:{
    baseUrl:"http://localhost:3000"
    // baseUrl:"http://eigene.cn:3000"
    // baseUrl:"http://eigene.free.idcfengye.com"
  },
  Test:{
    baseUrl:"http://test.iwenwiki.com"
  },
  Prod:{
    baseUrl:"http://iwenwiki.com"
  },
  SocketProd: {
      baseUrl:"http://localhost:8000/",
      // baseUrl:"http://www.eigene.cn:8000/"
  }
}
module.exports = {
  requestUrls: requestUrls
}