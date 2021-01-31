// components/common/authorization/authorization.js
let io = require('../../../assets/tool/weapp.socket.io')
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dialogShow: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancel() {
      this.setData({
        dialogShow: false
      })
    },
    //获取用户点击的是允许还是拒绝
    handleGetUserInfo(data) {
      if (data.detail.rawData) {
        if (!app.userInfo) {
          app.post(app.Api.register, {
            userInfo: data.detail.userInfo
          },{
            loading: false
          }).then(res => {
            app.userInfo = res.userInfo
            this.initSocketEvent()
            this.setData({
              dialogShow: false
            })
            this.triggerEvent('handleGetUserInfo', data)
          })
        }
      }
     
    },
      // 初始化通讯
  initSocketEvent() {
    const socket = (app.socket = io(app.socketUrls.baseUrl))
    this.socket = socket
    socket.on('connect', () => {
      console.log('连接成功')
      let user = {
        userId: app.userInfo.id,
      }
      socket.emit("login", user);
      socket.emit("getmessage");
    })
    socket.on("message", (from, to, message) => {
      console.log('okok')
      for (let key in app.cbObj) {
        app.cbObj[key] && app.cbObj[key](from, to, message)
      }
    })
    app.onMessage('messageMain', (from, to, message) => {
      let threas = wx.getStorageSync('threas')
      console.log('收到', threas)
      if (!threas) {
        threas = {}
      }
      if (!threas[from.userId]) {
        threas[from.userId] = {
          userId: from.userId,
          avatarUrl: from.avatarUrl,
          nickName: from.nickName,
          newNum: 0,
          lastMessage: '',
          messages: []
        }
      }
      threas[from.userId].newNum++
      threas[from.userId].lastMessage = message
      threas[from.userId].messages.push({
        fromId: from.userId,
        toId: to.userId,
        message
      })
      wx.setStorage({
        data: threas,
        key: 'threas',
      })
    })


  },
  }
})