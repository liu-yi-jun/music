//app.js
var QQMapWX = require('./qqmap-wx-jssdk1.0/qqmap-wx-jssdk.js')
let {
  requestUrls,
  InfoId
} = require("./assets/request/config.js")
let Api = require("./assets/request/api.js");
let Req = require("./assets/request/Req.js");
// let socket = require('./assets/request/socket')
let env = "Dev";
App.requestUrls = requestUrls[env]; // 公共文件用的
App.getToken = function getToken(code) {
  return new Promise((resolve, reject) => {
    Req.fetch(Api.getToken, {
      code
    }).then(res => {
      wx.setStorageSync('wx-token', res)
      resolve()
    }).catch(err => reject(err))
  })
}
App({
  onLaunch: function () {
    let guide = wx.getStorageSync('guide')
    if (!guide) {
      guide = {
        home: true,
        square: true,
        union: true,
        init: true,
        puchCard: true
      }
      wx.setStorageSync('guide', guide)
    }
    this.globalData.guide = guide
    // wx.loadFontFace({
    //   family: 'NotoSansHans-Bold', //设置一个font-family使用的名字 中文或英文
    //   global: true,//是否全局生效
    //   source: 'url("https://www.shengruo.top/font/NotoSansHans-Bold.ttf")', //字体资源的地址
    //   success: function(e){
    //     console.log('字体调用成功')
    //   },
    //   fail: function (e) {
    //     console.log('字体调用失败')
    //   },
    // })

  },
  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          App.getToken(res.code).then(() => {
            this.getServerUserInfo().then(() => {
              resolve()
            })
          })
        },
        fail: err => reject(err)
      })
    })
  },
  initLogin() {
    return new Promise((resolve, reject) => {
      let token = wx.getStorageSync('wx-token')
      if (token) {
        wx.checkSession({
          success: () => {
            this.getServerUserInfo().then(() => {
              resolve()
            })
          },
          fail: () => {
            this.login().then(() => {
              resolve()
            })
          }
        })
      } else {
        this.login().then(() => {
          resolve()
        })
      }
    })
  },
  getServerUserInfo() {
    return new Promise((resolve, reject) => {
      this.get(this.Api.getServerUserInfo, {}, {
        loading: false
      }).then(res => {
        if (res.userInfo) {
          // 有用户信息，存入app
          this.userInfo = res.userInfo
          this.globalData.codePass = true
          // socket.initSocketEvent()
        } else {
          // 没有用户信息等待用户授权
        }
        resolve()
      })
    })
  },
  requestUrls: requestUrls[env], // 给页面js用的
  socketUrls: requestUrls['SocketProd'],
  qiniuUrl: requestUrls['Qiniu'].baseUrl,
  InfoId: InfoId,
  Api,
  get: Req.fetch,
  post: (url, data, option = {}) => {
    option.method = "post";
    return Req.fetch(url, data, option);
  },
  isLogin: false,
  userInfo: null,
  groupInfo: null,
  signInInfo: null,
  globalData: {
    guide: {},
    codePass: false
  },
  switchData: {},
  cbObj: {},
  msgQueue: {},
  // 回退
  handlerGobackClick: function (delta) {
    const pages = getCurrentPages();
    console.log(pages, delta)
    if (pages.length >= 2) {
      wx.navigateBack({
        delta: 1
      });
    } else {
      wx.reLaunch({
        url: '/pages/home/home'
      })
    }
  },
  getNotice(that, userId) {
    Req.fetch(Api.getNotice, {
      userId
    }, {
      loading: false
    }).then(res => {
      console.log(res)
      if (res.length) {
        that.getTabBar().setData({
          showTabBarRedDot: true
        })
      } else {
        that.getTabBar().setData({
          showTabBarRedDot: false
        })
      }
    })
  },
  onMsg(msgName, cb) {
    if (!this.msgQueue[msgName]) {
      this.msgQueue[msgName] = []
    }
    this.msgQueue[msgName].push(cb)
    return this.msgQueue[msgName].length - 1
  },
  offMsg(msgName, index) {
    this.msgQueue[msgName].splice(index, 1)
  },
  clearMsg(msgName) {
    this.msgQueue[msgName] = null
  },
  // 消息进栈出栈
  onMessage(key, cb) {
    this.cbObj[key] = cb
  },
  offMessage(key) {
    this.cbObj[key] = null
  },
  // 腾讯经纬转换成位置
  // 实例化API核心类
  wxMap: new QQMapWX({
    key: 'UA7BZ-XTO3O-7HBWX-SYZXN-YLTOZ-QCFOP'
  })
})