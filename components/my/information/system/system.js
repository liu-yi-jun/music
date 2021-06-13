// components/my/information/system/system.js
const common = require('../../../../assets/tool/common.js')
const tool = require('../../../../assets/tool/tool')
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    systems: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
    msgList: [],
    pageSize: 5,
    pageIndex: 1,
  },

  /**
   * 组件的方法列表
   */
  lifetimes: {
    attached: function () {
      // this.loadData()
    },
  },
  methods: {
    refresh() {
      return new Promise((resolve, reject) => {
        this.data.msgList = []
        this.data.pageSize = 5
        this.data.pageIndex = 1
        this.loadData().then(() => {
          resolve()
        })
      })

    },
    getSystemMsg() {
      return new Promise(async (resolve, reject) => {
        app.get(app.Api.getSystemMsg, {
          userId: app.userInfo.id
        }).then((res) => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    loadData() {
      return new Promise(async (resolve, reject) => {
        let systemMsg = wx.getStorageSync('systemMsg')
        this.systemMsg = systemMsg
        if (!systemMsg.length) {
          // 请求数据库缓存
          let sqlSystemMsg = await this.getSystemMsg()
          systemMsg = sqlSystemMsg
          wx.setStorageSync('systemMsg', systemMsg)
        }
        let {
          pageSize,
          pageIndex
        } = this.data
        systemMsg = systemMsg.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
        systemMsg.forEach(item => {
          console.log(item);
          this.data.msgList.push(item)
        })
        this.setData({
          msgList: this.data.msgList
        })
        // this.data.msgList.forEach(item => {
        //   if (item.message.jsonDate.isNew) item.message.jsonDate.isNew = 0
        // })
        // wx.setStorageSync('systemMsg', this.systemMsg)
        this.data.pageIndex++
        resolve()
      })
    },
    agreeApply(e) {
      let index = e.currentTarget.dataset.index
      let msgId = e.currentTarget.dataset.id
      let msgList = this.data.msgList
      let section = msgList[index]
      app.post(app.Api.agreeApply, {
        userId: section.from.userId,
        groupId: section.message.jsonDate.groupId,
        groupName: section.message.jsonDate.groupName,
        myUserId: app.userInfo.id,
        msgId
      }).then((res) => {
        section.message.jsonDate.isNew = false
        if (res.affectedRows) {
          section.message.jsonDate.status = 1
          this.setData({
            msgList
          })
          wx.setStorageSync('systemMsg', this.systemMsg)
          // 通知管理员
          let from = {
              userId: app.userInfo.id,
              nickName: app.userInfo.nickName
            },
            to = {
              userIdList: res.userIdList
            },
            message = {
              id: new Date().getTime(),
              type: 2,
              jsonDate: {
                groupId: section.message.jsonDate.groupId,
                groupName: section.message.jsonDate.groupName,
                applyNickName: section.from.nickName,
                isNew: 1,
                agree: true
              }
            }
          app.post(app.Api.sendSubscribeInfo, {
            userIdList: res.userIdList,
            template_id: app.InfoId.examine,
            data: {
              "thing3": {
                "value": `申请加入“${section.message.jsonDate.groupName}”小组`
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
          app.socket.emit("sendSystemMsg", from, to, message);

          // 发送更新消息
          from = {
            userId: app.userInfo.id,
          }
          let updateUserIdList = JSON.parse(JSON.stringify(res.userIdList))
          updateUserIdList.forEach((item, index) => {
            if (item.userId === app.userInfo.id) {
              updateUserIdList.splice(index, 1)
              return
            }
          })
          to = {
            userIdList: updateUserIdList
          }
          message = {
            msgId,
            type: -1,
          }
          app.socket.emit("updateSystemMsg", from, to, message);

          // 通知对方
          let control = {
            title: `恭喜您，成为"${section.message.jsonDate.groupName}"小组成员`,
            proper: {
              name: 'isSwitchGroup',
              value: res.isControl
            }
          }
          to = {
            userId: section.from.userId
          }
          app.post(app.Api.sendSubscribeInfo, {
            otherId: section.from.userId,
            template_id: app.InfoId.examine,
            data: {
              "thing3": {
                "value": `申请加入“${section.message.jsonDate.groupName}”小组`
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
            section.message.jsonDate.status = -1
            this.setData({
              msgList
            })
            wx.setStorageSync('systemMsg', this.systemMsg)
          })
        }
      })
    },
    refuseApply(e) {
      let index = e.currentTarget.dataset.index
      let msgList = this.data.msgList
      let msgId = e.currentTarget.dataset.id
      let section = msgList[index]
      app.post(app.Api.refuseApply, {
        userId: section.from.userId,
        groupId: section.message.jsonDate.groupId,
        groupName: section.message.jsonDate.groupName,
        myUserId: app.userInfo.id,
        msgId
      }).then((res) => {
        console.log(res);
        section.message.jsonDate.isNew = false
        if (res.affectedRows) {
          section.message.jsonDate.status = 2
          this.setData({
            msgList
          })
          wx.setStorageSync('systemMsg', this.systemMsg)
          // 发送给其他管理员
          let from = {
              userId: app.userInfo.id,
              nickName: app.userInfo.nickName
            },
            to = {
              userIdList: res.userIdList
            },
            message = {
              id: new Date().getTime(),
              type: 2,
              jsonDate: {
                groupId: section.message.jsonDate.groupId,
                groupName: section.message.jsonDate.groupName,
                applyNickName: section.from.nickName,
                isNew: 1,
                agree: false
              }
            }
          app.post(app.Api.sendSubscribeInfo, {
            userIdList: res.userIdList,
            template_id: app.InfoId.examine,
            data: {
              "thing3": {
                "value": `申请加入“${section.message.jsonDate.groupName}”小组`
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
          app.socket.emit("sendSystemMsg", from, to, message);


          // 发送更新消息
          from = {
            userId: app.userInfo.id,
          }
          let updateUserIdList = JSON.parse(JSON.stringify(res.userIdList))
          updateUserIdList.forEach((item, index) => {
            if (item.userId === app.userInfo.id) {
              updateUserIdList.splice(index, 1)
              return
            }
          })
          to = {
            userIdList: updateUserIdList
          }
          message = {
            msgId,
            type: -1,
          }
          app.socket.emit("updateSystemMsg", from, to, message);
          
          // 发送给用户
          let control = {
            title: `很抱歉，您未能通过"${section.message.jsonDate.groupName}"小组的审核`,
            proper: {
              name: 'isSwitchGroup',
              value: res.isControl
            }
          }
          to = {
            userId: section.from.userId
          }
          app.post(app.Api.sendSubscribeInfo, {
            otherId: section.from.userId,
            template_id: app.InfoId.examine,
            data: {
              "thing3": {
                "value": `申请加入“${section.message.jsonDate.groupName}”小组`
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
            section.message.jsonDate.status = -1
            this.setData({
              msgList
            })
            wx.setStorageSync('systemMsg', this.systemMsg)
          })
        }
      })
    },
    goPersonal(e) {
      let userId = e.currentTarget.dataset.userid
      wx.navigateTo({
        url: `/pages/my/invitation/invitation?userId=${userId}`,
      })
    },
  },
})