// pages/my/information/information.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
const socket = require('../../../assets/request/socket')
const authorize = require('../../../assets/tool/authorize')
const common = require('../../../assets/tool/common')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    top: 0,
    qiniuUrl: app.qiniuUrl,
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    informPaging: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false
    },
    systemPaging: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false
    },
    informs: [],
    systems: [],
    userMessage: {},
    intoView: '',
    triggered: false,
    barList: [{
        name: '通知',
        isNew: false
      },
      {
        name: '系统',
        isNew: false
      }
    ],
    actIndex: 0,
    isHome: false,
    readStatus: [false, false]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    this.system = this.selectComponent('#system')
    if (options.actIndex !== undefined) {
      this.setData({
        actIndex: parseInt(options.actIndex)
      })
    }
    if (app.userInfo) {
      this.getInform()
      this.getSystem()
      // this.system.loadData().then(() => {
      //   this.isIsNew()
      // })
    } else {
      this.setData({
        isHome: true
      })
      app.initLogin().then(() => {
        if (app.userInfo) {
          socket.initSocketEvent()
          this.getInform()
          this.getSystem()
          // setTimeout(() => {
          //   this.system.loadData().then(() => {
          //     this.isIsNew()
          //   })
          // }, 1000)
        } else {
          wx.reLaunch({
            url: '/pages/home/home',
          })
        }
      })
    }

    // this.getSystem()
    // // 获取消息数据
    // this.getThreas()
    // this.WhachMessage()
  },
  isIsNew() {
    let systemMsg = wx.getStorageSync('systemMsg')
    if (systemMsg) {
      systemMsg.forEach(item => {
        if (item.message.jsonDate.isNew) {
          this.data.barList[1].isNew = true
          this.setData({
            barList: this.data.barList
          })
          return
        }
      })
    }
  },
  // 监听数据，更新视图
  WhachMessage() {
    app.onMessage('userMessage', (from, to, message) => {
      let userMessage = this.data.userMessage
      if (!userMessage[from.userId]) {
        userMessage[from.userId] = {
          userId: from.userId,
          avatarUrl: from.avatarUrl,
          nickName: from.nickName,
          lastMessage: '',
          newNum: 0
        }
      }
      console.log('userMessage', from.userId, userMessage)
      userMessage[from.userId].lastMessage = tool.cutstr(message, 20)
      userMessage[from.userId].newNum++
      this.setData({
        userMessage
      })
    })
  },
  // 获取消息数据
  getThreas() {
    let threas = wx.getStorageSync('threas')
    let userMessage = {}
    for (let key in threas) {
      userMessage[key] = {
        userId: threas[key].userId,
        avatarUrl: threas[key].avatarUrl,
        nickName: threas[key].nickName,
        lastMessage: tool.cutstr(threas[key].lastMessage, 20),
        newNum: threas[key].newNum
      }
    }
    this.setData({
      userMessage
    })
  },
  getSystem() {
    let systemPaging = this.data.systemPaging
    return new Promise((resolve, reject) => {
      app.get(app.Api.getSystem, {
        userId: app.userInfo.id,
        ...systemPaging
      }).then(res => {
        if (res.length < systemPaging.pageSize) {
          this.setData({
            'systemPaging.isNotData': true
          })
        }
        this.setData({
          systems: this.data.systems.concat(res),
          'systemPaging.pageIndex': systemPaging.pageIndex + 1
        })
        resolve(res)
        this.checkIsNew(res, 1)
      })
    })
  },
  getInform() {
    let informPaging = this.data.informPaging
    return new Promise((resolve, reject) => {
      app.get(app.Api.getInform, {
        userId: app.userInfo.id,
        ...informPaging
      }).then(res => {

        if (res.length < informPaging.pageSize) {
          this.setData({
            'informPaging.isNotData': true
          })
        }
        this.setData({
          informs: this.data.informs.concat(res),
          'informPaging.pageIndex': informPaging.pageIndex + 1
        })
        resolve(res)
        this.checkIsNew(res, 0)
      })
    })

  },
  refuseApply(data) {
    let e = data.detail.e
    let index = e.currentTarget.dataset.index
    let systems = this.data.systems
    let id = e.currentTarget.dataset.id
    let msgId = e.currentTarget.dataset.msgid
    let section = systems[index]
    app.post(app.Api.refuseApply, {
      userId: section.userId,
      groupId: section.jsonDate.groupId,
      groupName: section.jsonDate.groupName,
      myUserId: app.userInfo.id,
      id,
      msgId
    }).then((res) => {
      console.log(res);
      section.jsonDate.isNew = false
      section.isNew = 0
      if (res.affectedRows) {
        section.status = 2
        this.setData({
          systems
        })
        res.userIdList.forEach((item, index) => {
          if (item.userId == app.userInfo.id) {
            res.userIdList.splice(index, 1)
            return
          }
        })
        // 发送给其他管理员
        let from = {
            userId: app.userInfo.id,
          },
          to = {
            userIdList: res.userIdList
          },
          message = {
            id: new Date().getTime(),
            type: 2,
            jsonDate: {
              nickName: app.userInfo.nickName,
              groupId: section.jsonDate.groupId,
              groupName: section.jsonDate.groupName,
              applyNickName: section.jsonDate.nickName,
              isNew: 1,
              agree: false
            }
          }
        app.post(app.Api.sendSubscribeInfo, {
          userIdList: res.userIdList,
          template_id: app.InfoId.examine,
          data: {
            "thing3": {
              "value": `申请加入“${section.jsonDate.groupName}”小组`
            },
            "phrase1": {
              "value": "未通过"
            },
            "name7": {
              "value": tool.cutstr(app.userInfo.nickName, 6).replace(/[\d]+/g, '*')
            },
            "thing2": {
              "value": '无'
            }
          }
        })
        app.post(app.Api.sendFinalSystemMsg, {
          from,
          to,
          message
        }).then(() => {})

        // 发送给用户
        let control = {
          title: `很抱歉，您未能通过"${section.jsonDate.groupName}"小组的审核`,
          proper: {
            name: 'isSwitchGroup',
            value: res.isControl
          }
        }
        to = {
          userId: section.userId
        }
        app.post(app.Api.sendSubscribeInfo, {
          otherId: section.userId,
          template_id: app.InfoId.examine,
          data: {
            "thing3": {
              "value": `申请加入“${section.jsonDate.groupName}”小组`
            },
            "phrase1": {
              "value": "未通过"
            },
            "name7": {
              "value": tool.cutstr(app.userInfo.nickName, 6).replace(/[\d]+/g, '*')
            },
            "2": {
              "value": '无'
            }
          }
        })
        app.socket.emit("sendPageRefresh", from, to, control);
      } else {
        common.Tip('申请状态已过期').then(() => {
          section.status = -1
          this.setData({
            systems
          })
        })
      }
      this.setData({
        systems:this.data.systems
      },()=>{
        this.checkIsNew(this.data.systems, 1)
      })
    })
  },
  agreeApply(data) {
    let e = data.detail.e
    let index = e.currentTarget.dataset.index
    let id = e.currentTarget.dataset.id
    let msgId = e.currentTarget.dataset.msgid
    let systems = this.data.systems
    let section = systems[index]
    app.post(app.Api.agreeApply, {
      userId: section.userId,
      groupId: section.jsonDate.groupId,
      groupName: section.jsonDate.groupName,
      myUserId: app.userInfo.id,
      id,
      msgId
    }).then((res) => {
      section.jsonDate.isNew = false
      section.isNew = 0
      if (res.affectedRows) {
        section.status = 1
        this.setData({
          systems
        })
        res.userIdList.forEach((item, index) => {
          if (item.userId == app.userInfo.id) {
            res.userIdList.splice(index, 1)
            return
          }
        })
        // 通知管理员
        let from = {
            userId: app.userInfo.id,
          },

          to = {
            userIdList: res.userIdList
          },
          message = {
            id: new Date().getTime(),
            type: 2,
            jsonDate: {
              nickName: app.userInfo.nickName,
              groupId: section.jsonDate.groupId,
              groupName: section.jsonDate.groupName,
              applyNickName: section.jsonDate.nickName,
              isNew: 1,
              agree: true
            }
          }
        app.post(app.Api.sendSubscribeInfo, {
          userIdList: res.userIdList,
          template_id: app.InfoId.examine,
          data: {
            "thing3": {
              "value": `申请加入“${section.jsonDate.groupName}”小组`
            },
            "phrase1": {
              "value": "通过"
            },
            "name7": {
              "value": tool.cutstr(app.userInfo.nickName, 6).replace(/[\d]+/g, '*')
            },
            "thing2": {
              "value": '无'
            }
          }
        })
        app.post(app.Api.sendFinalSystemMsg, {
          from,
          to,
          message
        }).then(() => {})

        // 通知对方
        let control = {
          title: `恭喜您，成为"${section.jsonDate.groupName}"小组成员`,
          proper: {
            name: 'isSwitchGroup',
            value: res.isControl
          }
        }
        to = {
          userId: section.userId
        }
        app.post(app.Api.sendSubscribeInfo, {
          otherId: section.userId,
          template_id: app.InfoId.examine,
          data: {
            "thing3": {
              "value": `申请加入“${section.jsonDate.groupName}”小组`
            },
            "phrase1": {
              "value": "通过"
            },
            "name7": {
              "value": tool.cutstr(app.userInfo.nickName, 6).replace(/[\d]+/g, '*')
            },
            "thing2": {
              "value": '无'
            }
          }
        })
        app.socket.emit("sendPageRefresh", from, to, control);

      } else {
        common.Tip('申请状态已过期').then(() => {
          section.status = -1
          this.setData({
            systems
          })
        })
      }
      this.setData({
        systems:this.data.systems
      },()=>{
        this.checkIsNew(this.data.systems, 1)
      })
    })
  },
  checkIsNew(list, index) {
    let flag = false
    list.forEach(item => {
      if (item.isNew) {
        flag = true
        return
      }
    })
    if (flag) {
      this.data.barList[index].isNew = true
      this.data.readStatus[index] = true
      this.setData({
        barList: this.data.barList,
        readStatus: this.data.readStatus
      })

      return
    } else {
      this.data.barList[index].isNew = false
      this.data.readStatus[index] = false
      this.setData({
        barList: this.data.barList,
        readStatus: this.data.readStatus
      })
      return
    }
  },
  onRefresh() {
    let actIndex = this.data.actIndex
    if (this._freshing) return
    this._freshing = true

    if (actIndex === 0) {
      this.data.informPaging.isNotData = false
      this.data.informPaging.pageIndex = 1
      this.data.informs = []
      this.getInform().then(() => {
        this.setData({
          triggered: false,
        })
        this._freshing = false
      })
    } else if (actIndex === 1) {
      this.data.systemPaging.isNotData = false
      this.data.systemPaging.pageIndex = 1
      this.data.systems = []
      this.cancelSystemNew().then(() => {
        this.getSystem().then(() => {
          this.setData({
            triggered: false,
          })
          this._freshing = false
        })
      })

    } else {
      this.setData({
        triggered: false,
      })
      this._freshing = false
    }

  },
  scrolltolower() {
    let {
      informPaging,
      systemPaging,
      actIndex
    } = this.data
    if (actIndex === 0 && !informPaging.isNotData) {
      this.getInform()
    } else if (actIndex === 1 && !systemPaging.isNotData) {

      this.getSystem()
      // this.system.loadData()
    }
  },
  updateNew(e) {
    let index = e.detail.index
    let detail = this.data.informs[index]
    app.post(app.Api.modifyInform, {
      id: detail.id
    }).then((res) => {
      detail.isNew = 0
      this.setData({
        informs: this.data.informs
      }, () => {
        this.checkIsNew(this.data.informs, 0)
      })
    })
  },
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
    app.offMessage('userMessage')
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
  // 取消
  cancelSystemNew() {
    return new Promise((resolve, reject) => {
      app.post(app.Api.cancelSystemNew, {
        userId: app.userInfo.id
      }).then(() => {
        resolve()
      })
    })

  },
  //切换btn 
  switchBtn(e) {
    let actIndex = e.detail.actIndex
    if (actIndex === this.data.actIndex) return
    this.setData({
      actIndex
    })
  },
  readAll(e) {
    let read = e.currentTarget.dataset.read
    console.log(read);
    if (read == 'inform') {
      app.post(app.Api.readAllInform, {
        userId: app.userInfo.id
      }).then(res => {
        this.data.informs.forEach(item => {
          if (item.isNew) {
            item.isNew = false
          }
        })
        this.checkIsNew(this.data.informs, 0)
        this.setData({
          informs: this.data.informs
        })
      })
    } else if (read == 'system') {
      app.post(app.Api.cancelSystemNew, {
        userId: app.userInfo.id
      }).then(() => {
        this.data.systems.forEach(item => {
          if (item.isNew) {
            item.isNew = false
          }
        })
        this.checkIsNew(this.data.systems, 1)
        this.setData({
          systems: this.data.systems
        })
      })

      // app.post(app.Api.readAllSystem, {
      //   loading: false
      // }).then(res => {

      // })
    }
  }
})