// pages/init/index/index.js
const app = getApp()
const common = require('../../../assets/tool/common')
let Api = app.Api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 控制搜索列表
    listIsShow: false,
    groups: [],
    dialogShow: false,
    initGuide: false,
    leftGuide: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 登录操作，如果用户存在返回信息，如果不存返回openid
    this.initLogin()
    // this.login()
  },
  cancel() {
    this.setData({
      dialogShow: false
    })
  },
  initLogin() {
    let token = wx.getStorageSync('wx-token')
    if (token) {
      this.getServerUserInfo()
      this.getAllGroup()
    } else {
      wx.login({
        success: res => {
          if (res.code) {
            App.getToken(res.code).then(() => {
              this.getServerUserInfo()
              this.getAllGroup()
            })
          }
        }
      })
    }
  },
  getServerUserInfo() {
    app.get(Api.getServerUserInfo).then(res => {
      if (res.userInfo) {
        // 有用户信息，存入app
        app.userInfo = res.userInfo
        // 判断用户是否已有小组再进行跳转
        let groupId = app.userInfo.groupId
        if (groupId) {
          this.goHome()
        } else {
          // this.getAllGroup()
        }
      } else {
        // 没有用户信息等待用户授权
        this.setData({
          dialogShow: true
        })
        // this.getAllGroup()
      }

    })
  },

  // login() {
  //   let openid = wx.getStorageSync('openid')
  //   if (openid) {
  //     //  用openid获取用户信息
  //     this.getUserInfo('openid', openid)
  //   } else {
  //     //  用code获取用户信息
  //     wx.login({
  //       success: res => {
  //         if (res.code) {
  //           this.getUserInfo('code', res.code)
  //         }
  //       }
  //     })
  //   }
  // },
  // getUserInfo(param, value) {
  //   app.get(Api.login, {
  //     [param]: value
  //   }).then(res => {
  //     // 存入openid,下次请求可以直接用openid请求
  //     wx.setStorageSync('openid', res.openid)
  //     if (res.userInfo) {
  //       // 有用户信息，存入app
  //       app.userInfo = res.userInfo
  //       // 判断用户是否已有小组再进行跳转
  //       let groupId = app.userInfo.groupId
  //       if (groupId) {
  //         this.goHome()
  //       } else {
  //         this.getAllGroup()
  //       }
  //     } else {
  //       // 没有用户信息等待用户授权
  //       this.setData({
  //         dialogShow: true
  //       })
  //       this.getAllGroup()
  //     }

  //   })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  confirm(event) {
    if (!app.userInfo) {
      return this.setData({
        dialogShow: true
      })
    }
    let value = event.detail.value
    this.goSearchGroup(value)
  },
  goSearchGroup(value) {
    wx.navigateTo({
      url: `/pages/init/searchGroup/searchGroup?groupName=${value}`,
    })
  },
  // 展开小组
  unfold() {
    this.setData({
      listIsShow: !this.data.listIsShow
    })
  },
  // 获取所有小组
  getAllGroup() {
    app.get(Api.getAllGroup, {}, {
      loading: false
    }).then(res => {
      this.setData({
        groups: res,
      })
    })
  },
  //获取用户点击的是允许还是拒绝
  handleGetUserInfo(data) {
    if (data.detail.rawData) {
      // 用户点击确定
      if (!app.userInfo) {
        // 没有用户信息，进行注册
        app.post(Api.register, {
          // openid: wx.getStorageSync('openid'),
          userInfo: data.detail.userInfo
        }, {
          loading: false
        }).then(res => {
          // 将返回的数据存储到app
          console.log(res)
          app.userInfo = res.userInfo
          this.setData({
            initGuide: app.globalData.guide.init,
          })
        })
      }
      this.setData({
        dialogShow: false
      })
    }
  },

  goOther(event) {
    if (!app.userInfo) {
      return this.setData({
        dialogShow: true
      })
    }
    let id = event.target.dataset.id
    wx.navigateTo({
      url: `/pages/home/otherHome/otherHome?showGroupId=${id}`,
    })
  },
  goHome() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },
  goGroupSettlement() {
    if (!app.userInfo) {
      return this.setData({
        dialogShow: true
      })
    }
    wx.navigateTo({
      url: '/pages/init/groupSettlement/groupSettlement',
    })
  },
  click() {
    this.setData({
      leftGuide: false,
      listIsShow: true
    }, () => {
      setTimeout(() => {
        let guide = wx.getStorageSync('guide')
        guide.init = false
        wx.setStorageSync('guide', guide)
        app.globalData.guide.init = false
        this.setData({
          initGuide: false,
        }, () => {
          setTimeout(() => {
            this.setData({
              listIsShow: false
            })
          }, 1000)
        })
      }, 1000)
    })
  }
})