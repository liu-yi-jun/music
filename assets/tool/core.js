let app = getApp()
let timeoutLike = null
let timeoutStore = null
let timeoutFollow = null
let interval = 300
let timeoutObj = {}
function operateLike(src,data) {
  return new Promise((resolve, reject) => {
    clearTimeout(timeoutLike);
    timeoutLike = setTimeout(() => {
      app.post(src, data, {
        loading:false
      }).then(res=>resolve(res)).catch(err=>reject(err))
    }, interval);
  })
}
function operateStore(src,data) {
  return new Promise((resolve, reject) => {
    clearTimeout(timeoutStore);
    timeoutStore = setTimeout(() => {
      app.post(src, data, {
        loading:false
      }).then(res=>resolve(res)).catch(err=>reject(err))
    }, interval);
  })
}
function operateFollow(src,data) {
  return new Promise((resolve, reject) => {
    clearTimeout(timeoutFollow);
    timeoutFollow = setTimeout(() => {
      app.post(src, data, {
        loading:false
      }).then(res=>resolve(res)).catch(err=>reject(err))
    }, interval);
  })
}
function operateMultiple(src,data,index) {
  return new Promise((resolve, reject) => {
    clearTimeout(timeoutObj[index]);
    timeoutObj[index] = setTimeout(() => {
      app.post(src, data, {
        loading:false
      }).then(res=>resolve(res)).catch(err=>reject(err))
    }, interval);
  })
}
module.exports = {
  operateLike: operateLike,
  operateStore:operateStore,
  operateFollow:operateFollow,
  operateMultiple:operateMultiple
}