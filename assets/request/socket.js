let io = require('../tool/weapp.socket.io')
let common = require('../../assets/tool/common')
let app = getApp()


// console.log('loginloginloginlogin',login);

// console.log('socketsocket',socket);

function initSocketEvent(isLogin = true) {
  if (app.isLogin) return
  const socket = (app.socket = io(app.socketUrls.baseUrl))
  app.isLogin = true
  socket.on('connect', () => {
    console.log('连接成功')
    if (isLogin) {
      let user = {
        userId: app.userInfo.id,
      }
      socket.emit("login", user);
    }
    // socket.emit("getmessage");
  })

  socket.on("receiveMessage", (msgName, res) => {
    console.log(msgName, res);
    app.msgQueue[msgName].forEach(cb => {
      cb((res.data))
    })
  })
  app.onMsg('pageRefresh', (data) => {
    data.forEach((item) => {
      item = JSON.parse(item)
      app.PageRefresh.homePageRefresh && app.PageRefresh.homePageRefresh()
      common.Tip(item.control.title).then(() => {
        // app.switchData[item.control.proper.name] = item.control.proper.value
      })
    })
  })
  app.onMsg('systemMsg', (data) => {
    let systemMsg = wx.getStorageSync('systemMsg')
    if (!systemMsg) {
      systemMsg = []
    }
    data.forEach((item) => {
      item = JSON.parse(item)
      systemMsg.unshift({
        from: item.from,
        to: item.to,
        message: item.message
      })
      app.post(app.Api.sendSystemMsg, {
        messageId: item.message.id,
        msgContent: item,
        userId: app.userInfo.id
      }).then(() => {})
    });
    wx.setStorageSync('systemMsg', systemMsg)
    setTimeout(() => {
      (app.TabBar.homeTabBar && app.TabBar.homeTabBar.setIsNew()) || (app.TabBar.toolTabBar && app.TabBar.toolTabBar.setIsNew()) || (app.TabBar.squareTabBar && app.TabBar.squareTabBar.setIsNew())
    }, 1000);
  })
  app.onMsg('updateSystemMsg', (data) => {
    let systemMsg = wx.getStorageSync('systemMsg')
    let obj = data[0]
    obj = JSON.parse(obj)
    let flag = false
    systemMsg.forEach((item, index) => {
      if (obj.message.msgId === item.message.id) {
        flag = true
        systemMsg.splice(index, 1)
        app.post(app.Api.deleteSystemMsg, {
          messageId: item.message.id,
          userId: app.userInfo.id
        }).then(() => {})
        return
      }
    })
    if (flag) {
      wx.setStorageSync('systemMsg', systemMsg)
    }

  })
  // 之前的socket，不删除
  // socket.on("message", (from, to, message) => {
  //   console.log('okok')
  //   for (let key in app.cbObj) {
  //     app.cbObj[key] && app.cbObj[key](from, to, message)
  //   }
  // })
  // socket.on("pageRefresh", (items) => {
  //   console.log('pageRefresh', items)
  //   items.forEach((item) => {
  //     item = JSON.parse(item)
  //     common.Tip(item.control.title).then(() => {
  //       app.switchData[item.control.proper.name] = item.control.proper.value
  //     })
  //   })
  //   socket.removeAllListeners('pageRefresh');
  // })
  // socket.on("systemMsg", (items) => {
  //   console.log('systemMsg', items)
  //   let systemMsg = wx.getStorageSync('systemMsg')
  //   if (!systemMsg) {
  //     systemMsg = []
  //   }
  //   items.forEach((item) => {
  //     item = JSON.parse(item)
  //     systemMsg.unshift({
  //       from: item.from,
  //       to: item.to,
  //       message: item.message
  //     })
  //   })
  //   wx.setStorage({
  //     data: systemMsg,
  //     key: 'systemMsg',
  //   })
  // })

  // app.onMessage('messageMain', (from, to, message) => {
  //   let threas = wx.getStorageSync('threas')
  //   console.log('收到', threas)
  //   if (!threas) {
  //     threas = {}
  //   }
  //   if (!threas[from.userId]) {
  //     threas[from.userId] = {
  //       userId: from.userId,
  //       avatarUrl: from.avatarUrl,
  //       nickName: from.nickName,
  //       newNum: 0,
  //       lastMessage: '',
  //       messages: []
  //     }
  //   }
  //   threas[from.userId].newNum++
  //   threas[from.userId].lastMessage = message
  //   threas[from.userId].messages.push({
  //     fromId: from.userId,
  //     toId: to.userId,
  //     message
  //   })
  //   wx.setStorage({
  //     data: threas,
  //     key: 'threas',
  //   })
  // })
  // router.get('/agreeApply', async (req, res, next) => {
  //   let {
  //     userId
  //   } = req.body
  //   try {
  //     let modifys = {
  //         groupDuty: 2,
  //       },
  //       conditions = {
  //         id: userId
  //       }
  //     let updateResult = await db.update('users', modifys, conditions)
  //     res.json(util.success(updateResult))
  //   } catch (err) {
  //     next(err)
  //   }
  // })
}

module.exports = {
  initSocketEvent: initSocketEvent,
}