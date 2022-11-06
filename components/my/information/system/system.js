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
    // refresh() {
    //   return new Promise((resolve, reject) => {
    //     this.data.msgList = []
    //     this.data.pageSize = 5
    //     this.data.pageIndex = 1
    //     this.loadData().then(() => {
    //       resolve()
    //     })
    //   })

    // },
    // getSystemMsg() {
    //   return new Promise(async (resolve, reject) => {
    //     app.get(app.Api.getSystemMsg, {
    //       userId: app.userInfo.id
    //     }).then((res) => {
    //       resolve(res)
    //     }).catch(err => {
    //       reject(err)
    //     })
    //   })
    // },
    // loadData() {
    //   return new Promise(async (resolve, reject) => {
    //     let systemMsg = wx.getStorageSync('systemMsg')
    //     this.systemMsg = systemMsg
    //     if (!systemMsg.length) {
    //       // 请求数据库缓存
    //       let sqlSystemMsg = await this.getSystemMsg()
    //       systemMsg = sqlSystemMsg
    //       wx.setStorageSync('systemMsg', systemMsg)
    //     }
    //     let {
    //       pageSize,
    //       pageIndex
    //     } = this.data
    //     systemMsg = systemMsg.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
    //     systemMsg.forEach(item => {
    //       console.log(item);
    //       this.data.msgList.push(item)
    //     })
    //     this.setData({
    //       msgList: this.data.msgList
    //     })
    //     // this.data.msgList.forEach(item => {
    //     //   if (item.message.jsonDate.isNew) item.message.jsonDate.isNew = 0
    //     // })
    //     // wx.setStorageSync('systemMsg', this.systemMsg)
    //     this.data.pageIndex++
    //     resolve()
    //   })
    // },
    agreeApply(e) {
      this.triggerEvent('agreeApply', {
        e
      })
    },
    refuseApply(e) {
      this.triggerEvent('refuseApply', {
        e
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