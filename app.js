//app.js
var QQMapWX = require('./qqmap-wx-jssdk1.0/qqmap-wx-jssdk.js')
let {
  requestUrls
} = require("./assets/request/config.js")
let Api = require("./assets/request/api.js");
let Req = require("./assets/request/Req.js");
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
        init: true
      }
      wx.setStorageSync('guide', guide)
    }
    this.globalData.guide = guide
  },

  requestUrls: requestUrls[env], // 给页面js用的
  socketUrls: requestUrls['SocketProd'],
  Api,
  get: Req.fetch,
  post: (url, data, option = {}) => {
    option.method = "post";
    return Req.fetch(url, data, option);
  },
  isLogin: false,
  userInfo: null,
  groupInfo: null,
  globalData: {
    guide: {}
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
      wx.navigateTo({
        url: '/pages/init/index/index'
      });
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