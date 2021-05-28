// pages/home/welcome/welcome.js

let app = getApp()
const common = require('../../../assets/tool/common')
const tool = require('../../../assets/tool/tool')
const authorize = require('../../../assets/tool/authorize')
let socket = require('../../../assets/request/socket')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupInfo: null,
    applyShow: false,
    applyContent: '',
    codeCheck: '',
    msgAuthorizationShow: false,
    requestId: [app.InfoId.examine]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let groupId, scene
    if (options.scene) {
      scene = decodeURIComponent(options.scene);
      groupId = scene.split("=")[1]
    } else {
      groupId = options.groupId
    }

    this.simpleGroupInfo(groupId)
    this.initLogin()
  },
  simpleGroupInfo(groupId) {
    app.get(app.Api.simpleGroupInfo, {
      groupId
    }).then(res => {
      app.groupInfo = res
      this.setData({
        groupInfo: res
      })
      console.log(res);
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  into() {
    if (app.userInfo) {

      console.log('进入');
      if (app.switchData.isSwitchGroup) {
        app.switchData.isSwitchGroup = false
        this.getServerUserInfo().then(res => {
          this.yesJoin()
        })
      } else {
        this.yesJoin()
      }

    } else {
      this.setData({
        dialogShow: true
      })
    }

  },
  joinGroup(groupInfo) {
    // 加入
    return new Promise((resolve, reject) => {
      app.post(app.Api.joinGroup, {
        groupId: groupInfo.id,
        groupName: groupInfo.groupName,
        userId: app.userInfo.id,
        examine: groupInfo.examine
      }).then(res => {
        app.userInfo = res.userInfo
        if (app.groupInfo) {
          app.groupInfo.myGrouList = res.myGrouList
        } else {
          app.groupInfo = {}
          app.groupInfo.myGrouList = res.myGrouList
        }
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  async yesJoin() {
    let groupInfo = this.data.groupInfo
    let flag = false
    let groupDuty
    if (this.myGrouList) {
      this.myGrouList.forEach(item => {
        if (item.groupId === groupInfo.id && item.groupDuty !== -1) {
          groupDuty = item.groupDuty
          return flag = true
        }
      })
    }
    if (flag) {
      // 已经在此小组的
      app.post(app.Api.switchGroup, {
        groupId: groupInfo.id,
        groupName: groupInfo.groupname,
        groupDuty,
        userId: app.userInfo.id
      }).then((res) => {
        wx.reLaunch({
          url: '/pages/home/home'
        })
      })
    } else {
      // 未加入
      if (groupInfo.examine) {
        // 需要审核
        common.showLoading()
        authorize.newSubscription(this.data.requestId, {
          cancelText: '继续申请'
        }).then((res) => {
          wx.hideLoading()
          if (res.type === 1) {
            this.setData({
              msgAuthorizationShow: true
            })
          } else if (res.type === -1) {
            if (!res.result.confirm) {
              this.setData({
                applyShow: true
              })
            }
          } else if (res.type === 0) {
            this.setData({
              applyShow: true
            })
          }
        })
      } else {
        // 直接进入
        this.joinGroup(groupInfo).then(res => {
          common.Tip(`恭喜您成功加入${groupInfo.groupName}`, '提示', '确认').then(res => {
            wx.reLaunch({
              url: '/pages/home/home'
            })
          })
        }).catch(err => reject(err))
      }
    }
  },
  completeMsgAuthorization() {
    this.setData({
      msgAuthorizationShow: false,
      applyShow: true
    })
  },
  cancelApply() {
    this.setData({
      applyShow: false
    })
  },
  inputApply(e) {
    let applyContent = e.detail.value
    this.setData({
      applyContent
    })
  },
  apply() {
    let applyContent = this.data.applyContent
    let groupInfo = app.groupInfo
    if (!applyContent) {
      common.Tip('请输入内容')
      return
    }
    this.joinGroup(groupInfo).then(res => {
      let from = {
          userId: app.userInfo.id,
          nickName: app.userInfo.nickName
        },
        to = {
          userIdList: res.userIdList
        },
        message = {
          type: 1,
          jsonDate: {
            groupId: groupInfo.id,
            groupName: groupInfo.groupName,
            applyContent,
            isNew: 1,
            status: 0
          }
        }
      app.post(app.Api.sendSubscribeInfo, {
        userIdList: res.userIdList,
        template_id: app.InfoId.joinGroup,
        data: {
          "thing1": {
            "value": tool.cutstr(groupInfo.groupName, 16)
          },
          "name2": {
            "value": tool.cutstr(app.userInfo.nickName, 6).replace(/[\d]+/g, '*')
          },
          "thing6": {
            "value": tool.cutstr(applyContent, 16)
          },
        },

      })
      app.socket.emit("sendSystemMsg", from, to, message);
      app.switchData.isSwitchGroup = true
      this.setData({
        applyShow: false
      })
      // authorize.isSubscription().then(res => {
      //   if (res.mainSwitch && (!res.itemSettings || !res.itemSettings[app.InfoId.examine])) {
      //     common.Tip('接下来将授权"审核结果"通知。授权时请勾选“总是保持以上选择,不再询问”，后续将第一时间通知到您', '申请信息已发送').then(res => {
      //       if (res.confirm) {
      //         authorize.alwaysSubscription([app.InfoId.examine]).then(res => {})
      //       }
      //     })
      //   } else {
      //     common.Tip('确保您已开启相应的通知权限，“审核结果”将会第一时间通知到您', '申请信息已发送').then(res => {
      //       if (res.confirm) {
      //         authorize.alwaysSubscription([app.InfoId.examine]).then(res => {})
      //       }
      //     })
      //   }
      // })
    })
  },
  initLogin() {
    let token = wx.getStorageSync('wx-token')
    if (token) {
      wx.checkSession({
        success: () => {
          this.getServerUserInfo()
        },
        fail: () => {
          this.login()
        }
      })
    } else {
      this.login()
    }
  },
  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          App.getToken(res.code).then(() => {
            this.getServerUserInfo()
            resolve()
          })
        },
        fail: err => reject(err)
      })
    })
  },
  getServerUserInfo() {
    return new Promise((resolve, reject) => {
      app.get(app.Api.simpleGetServerUserInfo, {}, {
        loading: false
      }).then(res => {
        if (res.userInfo) {
          // 有用户信息，存入app
          app.userInfo = res.userInfo
          this.myGrouList = res.myGrouList
          socket.initSocketEvent()
          console.log(app.userInfo);
          resolve()
        } else {
          this.setData({
            codeCheck: 'groupId=' + this.data.groupInfo.id
          })
          resolve()
          // 没有用户信息等待用户授权
        }

      })
    })

  },
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
  handlerGobackClick: app.handlerGobackClick,
})