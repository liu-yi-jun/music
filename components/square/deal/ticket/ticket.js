// components/square/deal/ticket/ticket.js
const app = getApp()
const core = require('../../../../assets/tool/core')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tickets: {
      type: Array,
      value: []
    },
    isShowAdd: {
      type: Boolean,
      value:true
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
    goTicketIssue() {
      wx.navigateTo({
        url: '/pages/square/deal/ticketIssue/ticketIssue',
      })
    },
    switchTicketStore(e) {
      let index = e.currentTarget.dataset.index
      let tickets = this.data.tickets
      tickets[index].isStore = !this.data.tickets[index].isStore
      this.setData({
        tickets
      }, () => {
        core.operateMultiple(app.Api.followTicket, {
          operate: tickets[index].isStore,
          relation: {
            userId: app.userInfo.id,
            ticketId: tickets[index].id,
          }
        }, index)
      })
    },
    goPersonal(e) {
      let userId = e.currentTarget.dataset.userid
      wx.navigateTo({
        url: `/pages/my/invitation/invitation?userId=${userId}`,
      })
    },
  }
})