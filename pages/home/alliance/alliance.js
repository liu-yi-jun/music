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
    dialogShow: false,
    // 控制弹出框
    joinShow: false,
    applyShow: false,
    applyContent: ''
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
    if (groups.length === 0) {
      return groups
    }
    app.groupInfo.myGrouList.forEach((item, index) => {
      groups.forEach(group => {
        console.log(group.id, item.groupId);
        if (group.id == item.groupId) {
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
  goOtherHome(event) {
    console.log('eventevent', event)
    if (app.userInfo) {
      let id = event.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/home/otherHome/otherHome?showGroupId=${id}`,
      })
    } else {
      this.setData({
        dialogShow: true
      })
    }
  },
  joinGroup(groupInfo) {
    // 加入
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
      groupInfo.isJoin = 1
      this.setData({
        groups: this.data.groups
      })
    }).catch(err => err)
  },
  showJoin(e) {
    let index = e.currentTarget.dataset.index
    let groupInfo = this.data.groups[index]
    this.groupInfo = groupInfo
    if (app.userInfo) {
      if (app.groupInfo) {
        if (app.groupInfo.myGrouList.length >= 5) {
          wx.showModal({
            title: '提示',
            content: '最多只允许加入5个小组哦~',
            showCancel: false
          })
        } else {
          this.setData({
            joinShow: true
          })
        }
      } else {
        // app.switchData.isSwitchGroup = true
        // this.joinGroup(groupInfo)
        this.setData({
          joinShow: true
        })
      }
    } else {
      this.setData({
        dialogShow: true
      })
    }
  },
  yesJoin() {
    let groupInfo = this.groupInfo

    if (groupInfo.examine) {
      this.setData({
        applyShow: true,
        joinShow: false
      })
    } else {
      this.setData({
        joinShow: false
      })
      app.switchData.isSwitchGroup = true
      this.joinGroup(groupInfo)
    }
  },
  noJoin() {
    this.setData({
      joinShow: false
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
    let groupInfo = this.groupInfo
    if (!applyContent) {
      common.Tip('请输入内容')
      return
    }
    let from = {
        userId: app.userInfo.id,
        nickName: app.userInfo.nickName
      },
      to = {
        userId: groupInfo.userId
      },
      message = {
        type: 1,
        jsonDate: {
          groupId: groupInfo.id,
          groupName: groupInfo.groupName,
          applyContent,
          status: 0
        }
      }
      app.post(app.Api.joinGroup, {
        groupId: groupInfo.id,
        groupName: groupInfo.groupName,
        userId: app.userInfo.id,
        examine: groupInfo.examine
      }).then(res => {
        if (app.groupInfo) {
          app.groupInfo.myGrouList = res.myGrouList
        } else {
          app.groupInfo = {}
          app.groupInfo.myGrouList = res.myGrouList
        }
        groupInfo.isJoin = -1
        app.socket.emit("applyJoin", from, to, message);
        this.setData({
          groups: this.data.groups
        })
      }).catch(err => err)
  },
  messagePass : {
    'systemMsg': []
  },

  leaveDate : {
  },

  send(){
    socket.on('getLeaveDate', () => {
      if (leaveDate[socket.user.userId]) {
        for(key in messagePass) {
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