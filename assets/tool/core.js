let app = getApp()
let timeoutLike = null
let timeoutStore = null
let timeoutFollow = null
let interval = 300
let timeoutObj = {}

const common = require('../../assets/tool/common')

function operateLike(src, data) {
  return new Promise((resolve, reject) => {
    clearTimeout(timeoutLike);
    timeoutLike = setTimeout(() => {
      app.post(src, data, {
        loading: false
      }).then(res => resolve(res)).catch(err => reject(err))
    }, interval);
  })
}

function operateStore(src, data) {
  return new Promise((resolve, reject) => {
    clearTimeout(timeoutStore);
    timeoutStore = setTimeout(() => {
      app.post(src, data, {
        loading: false
      }).then(res => resolve(res)).catch(err => reject(err))
    }, interval);
  })
}

function operateFollow(src, data) {
  return new Promise((resolve, reject) => {
    clearTimeout(timeoutFollow);
    timeoutFollow = setTimeout(() => {
      app.post(src, data, {
        loading: false
      }).then(res => resolve(res)).catch(err => reject(err))
    }, interval);
  })
}

function operateMultiple(src, data, index) {
  return new Promise((resolve, reject) => {
    clearTimeout(timeoutObj[index]);
    timeoutObj[index] = setTimeout(() => {
      app.post(src, data, {
        loading: false
      }).then(res => resolve(res)).catch(err => reject(err))
    }, interval);
  })
}

function handleReport(data) {
  //  举报人 userId  表名themName  文章idthenId, 
  common.showLoading('举报中...')
  app.post(app.Api.report, {
   ...data
  }, {
    loadining: false
  }).then(() => {
    common.Tip('举报消息已发送至本平台，工作人员将进行审核')
  })
}
module.exports = {
  operateLike: operateLike,
  operateStore: operateStore,
  operateFollow: operateFollow,
  operateMultiple: operateMultiple,
  handleReport: handleReport
}