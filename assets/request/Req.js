/**
 * 网络请求的公共方法
 *    1.基本请求
 *    2.为了后续获取数据方便，promise处理：fetch  axios基于promise
 *    3.对获取数据的状态处理：loadding toast
 *    4.对请求头的处理！！！机型、大小、系统、屏幕
 */
let system = wx.getSystemInfoSync();

const clientInfo = {
  "clientType": "mp",
  "appnm": "iwen",
  "model": system.model,
  "os": system.system,
  "screen": system.screenWidth + "*" + system.screenHeight,
  "version": App.version,
  "chennel": "miniprogram"
}
console.log(App)

module.exports = {
  fetch: (url, data = {}, option = {}) => {
    let {
      loading = ['加载中...'], toast = false, method = 'get'
    } = option;
    return new Promise((resolve, reject) => {
      if (loading.length) {
        wx.showLoading({
          title: loading[0],
          mask: true
        })
      }

      let env = App.requestUrls.baseUrl;
      
      wx.request({
        url: env + url,
        data,
        method,
        header: {
          "clientInfo": JSON.stringify(clientInfo)
        },
        success: function (res) {
          console.log(env + url, res)
          let result = res.data; // { code:0,data:"",message:"" }
          result.code == 0 ? resolve(result.data) : reject(result.message)
          if (toast.length) {
            wx.showToast({
              mask: true,
              title: result.message || toast[0],
              icon: "none"
            })
          } else {
            if (loading) wx.hideLoading();
          }
        },
        fail: function (e) {
          console.log('req失败', e)
          let msg = e.errMsg;
          console.log(msg)
          // 自己测试出来
          if (msg == "request:fail timeout") {
            msg = '请求超时，请稍后重试';
          }
          // 注意这里有空格
          if (msg == "request:fail ") {
            msg = '服务器维护中，请稍后重试';
          }
          wx.showToast({
            mask: true,
            title: msg,
            icon: "none"
          })
          reject(e);
        }
      })
    })

  }
}