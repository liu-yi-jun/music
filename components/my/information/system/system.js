// components/my/information/system/system.js
const common = require('../../../../assets/tool/common.js')

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
    msgList: [],
    pageSize: 5,
    pageIndex: 1,
  },

  /**
   * 组件的方法列表
   */
  lifetimes: {
    attached: function () {
      this.loadData()
    },
  },
  methods: {
    loadData() {
      return new Promise((resolve, reject) => {
        let systemMsg = wx.getStorageSync('systemMsg')
        this.systemMsg = systemMsg
        let {
          pageSize,
          pageIndex
        } = this.data
        systemMsg = systemMsg.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
        systemMsg.forEach(item => {
          this.data.msgList.unshift(item)
        })
        this.setData({
          msgList: this.data.msgList
        })
        this.data.msgList.forEach(item=> {
          if(item.message.jsonDate.isNew)  item.message.jsonDate.isNew = 0
        })
        wx.setStorageSync('systemMsg', this.systemMsg)
        this.data.pageIndex++
        resolve()
      })

    },
    agreeApply(e) {
      let index = e.currentTarget.dataset.index
      let msgList = this.data.msgList
      let section = msgList[index]
      app.post(app.Api.agreeApply, {
        userId: section.from.userId,
        groupId: section.message.jsonDate.groupId,
        groupName: section.message.jsonDate.groupName
      }).then((res) => {
        if (res.affectedRows) {
          section.message.jsonDate.status = 1
          this.setData({
            msgList
          })
          wx.setStorageSync('systemMsg', this.systemMsg)
          let from = {
              userId: app.userInfo.id,
              nickName: app.userInfo.nickName
            },
            to = {
              userIdList: res.userIdList
            },
            message = {
              type: 2,
              jsonDate: {
                groupId: section.message.jsonDate.groupId,
                groupName: section.message.jsonDate.groupName,
                applyNickName: section.from.nickName,
                isNew: 1,
                agree: true
              }
            }
          app.socket.emit("sendSystemMsg", from, to, message);
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
      let section = msgList[index]
      app.post(app.Api.refuseApply, {
        userId: section.from.userId,
        groupId: section.message.jsonDate.groupId,
        groupName: section.message.jsonDate.groupName
      }).then((res) => {
        console.log(res);
        if (res.affectedRows) {
          section.message.jsonDate.status = 2
          this.setData({
            msgList
          })
          wx.setStorageSync('systemMsg', this.systemMsg)
          let from = {
              userId: app.userInfo.id,
              nickName: app.userInfo.nickName
            },
            to = {
              userIdList: res.userIdList
            },
            message = {
              type: 2,
              jsonDate: {
                groupId: section.message.jsonDate.groupId,
                groupName: section.message.jsonDate.groupName,
                applyNickName: section.from.nickName,
                isNew: 1,
                agree: false
              }
            }
          app.socket.emit("sendSystemMsg", from, to, message);
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