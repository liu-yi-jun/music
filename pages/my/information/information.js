// pages/my/information/information.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
const socket = require('../../../assets/request/socket')
const authorize = require('../../../assets/tool/authorize')
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
      this.system.loadData().then(() => {
        this.isIsNew()
      })
    } else {
      this.setData({
        isHome: true
      })
      app.initLogin().then(() => {
        if (app.userInfo) {
          socket.initSocketEvent()
          this.getInform()
          setTimeout(() => {
            this.system.loadData().then(() => {
              this.isIsNew()
            })
          }, 1000)
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
        this.checkIsNew(res)
      })
    })

  },
  checkIsNew(list) {
    let flag = false
    list.forEach(item => {
      if (item.isNew) {
        flag = true
        return
      }
    })
    if (flag) {
      this.data.barList[0].isNew = true
      this.setData({
        barList: this.data.barList
      })
      return
    } else {
      this.data.barList[0].isNew = false
      this.setData({
        barList: this.data.barList
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
      setTimeout(() => {
        let system = this.selectComponent('#system')
        system.refresh().then(() => {
          this.setData({
            triggered: false,
          })
          this._freshing = false
        })
      }, 1000)
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
    } else if (actIndex === 1) {
      this.system.loadData()
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
        this.checkIsNew(this.data.informs)
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
  //切换btn 
  switchBtn(e) {
    let actIndex = e.detail.actIndex
    if (actIndex === this.data.actIndex) return
    if (actIndex == 1) {
      if (this.data.barList[1].isNew) {
        let systemMsg = wx.getStorageSync('systemMsg')
        systemMsg.forEach(item => {
          if (item.message.jsonDate.isNew) item.message.jsonDate.isNew = 0
        })
        this.data.barList[1].isNew = false
        this.setData({
          barList: this.data.barList
        })
        wx.setStorageSync('systemMsg', systemMsg)
      }
    }
    this.setData({
      actIndex
    })
  },
})