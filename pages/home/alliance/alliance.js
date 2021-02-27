// pages/home/alliance/alliance.js
const app = getApp()
const common = require('../../../assets/tool/common.js')
const tool = require('../../../assets/tool/tool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    groups: [],
    groupName: '',
    groupPaging: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false,
    },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    // this.pagingGetFollowGroup(this.data.groupName)
    this.pagingGetGroup(this.data.groupName)
  },
  pagingGetGroup(groupName) {
    let groupPaging = this.data.groupPaging
    app.get(app.Api.pagingGetGroup, {
      groupName,
      ...groupPaging
    }).then((res) => {
      if (res.length < groupPaging.pageSize) {
        this.setData({
          'groupPaging.isNotData': true
        })
      }
      this.setData({
        groups: this.data.groups.concat(this.isJoinGroup(res)),
        'groupPaging.pageIndex': groupPaging.pageIndex + 1
      })
    })
  },
  confirm(event) {
    this.setData({
      groups: [],
      groupName: event.detail.value,
      'groupPaging.isNotData': false,
      'groupPaging.pageIndex': 1
    }, () => this.pagingGetGroup(this.data.groupName))
  },
  isJoinGroup(groups) {
    if (groups.length === 0 || !app.groupInfo) {
      return groups
    }
    app.groupInfo.myGrouList.forEach((item, index) => {
      groups.forEach(group => {
        if (group.id == item.groupId) {
          group.groupDuty = item.groupDuty
          if (item.groupDuty === -1) {
            group.isJoin = -1
          } else {
            group.isJoin = 1
          }
          return
        }
      })
    })
    return groups
  },
  scrolltolower() {
    if (!this.data.groupPaging.isNotData) {
      this.pagingGetGroup(this.data.groupName)
    }
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

  messagePass: {
    'systemMsg': []
  },

  leaveDate: {},

  send() {
    socket.on('getLeaveDate', () => {
      if (leaveDate[socket.user.userId]) {
        for (key in messagePass) {
          let p = Promise.resolve()
          leaveDate[socket.user.userId][key].forEach(async element => {
            p = p.then(() => time()).then(() => {
              io.to(socket.user.roomId).emit(key, element.from, element.to, element.message);
              return
            }).catch(err => reject(err))
          });
          leaveDate[socket.user.userId][key] = []
        }
      }
    })
  },

  text() {
    socket.on('applyJoin', (from, to, message) => {
      if (users[to.userId]) {
        let user = users[to.userId]
        socket.broadcast.to(user.roomId).emit('systemMsg', from, to, message);
      } else {
        if (!leaveDate[to.userId]) {
          leaveDate[to.userId] = messagePass
        }
        leaveDate[to.userId]['systemMsg'].push({
          from,
          to,
          message
        })
        console.log('leaveDate', leaveDate)
        console.log('离线了')
      }
    });
  }
})