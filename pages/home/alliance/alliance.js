// pages/home/alliance/alliance.js
const app = getApp()
const common = require('../../../assets/tool/common.js')
const tool = require('../../../assets/tool/tool.js')
const authorize = require('../../../assets/tool/authorize')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    qiniuUrl: app.qiniuUrl,
    groups: [],
    groupName: '',
    groupPaging: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false,
      minID: 0,
    },
    tempValue: '',
    triggered: false,
    dialogShow: false,
    msgAuthorizationShow: false,
    requestId: [app.InfoId.examine],
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
    return new Promise((resolve, reject) => {
      app.get(app.Api.pagingGetGroup, {
        groupName,
        ...groupPaging,
        minID: groupPaging.minID
      }, {
        loading: false
      }).then((res) => {
        if (res.length < groupPaging.pageSize) {
          groupPaging.isNotData = true
        }
        groupPaging.minID = res.length ? res[res.length - 1].id : 0
        this.setData({
          groups: this.data.groups.concat(this.isJoinGroup(res)),
          // 'groupPaging.pageIndex': groupPaging.pageIndex + 1
        })
        resolve()
      })
    })

  },
  searchInput(event) {
    this.setData({
      tempValue: event.detail.value,
    })
  },
  confirm(event) {
    this.data.groupPaging.minID = 0
    this.data.groupPaging.pageIndex = 1
    this.data.groupPaging.isNotData = false
    this.data.groups = []
    this.setData({
      groupName: event.detail.value ? event.detail.value : this.data.tempValue,
    }, () => this.pagingGetGroup(this.data.groupName))
  },
  // 是否加入过该小组
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
  //显示授权
  showAuthorDialog(e) {
    this.setData({
      dialogShow: e.detail.dialogShow
    })
  },
  // 显示是否确定加入该小组的弹出框
  showJoin(e) {
    this.groupInfo = this.data.groups[e.detail.index]
    this.setData({
      joinShow: e.detail.joinShow
    })
  },
  // 是否确定加入该小组，no
  noJoin() {
    this.setData({
      joinShow: false
    })
  },
  // 是否加入该小组，yes
  async yesJoin() {
    let groupInfo = this.groupInfo
    if (groupInfo.examine) {
      common.showLoading()
      authorize.newSubscription(this.data.requestId, {
        cancelText: '继续申请'
      }).then((res) => {
        wx.hideLoading()
        if (res.type === 1) {
          this.setData({
            msgAuthorizationShow: true
          })
        } else if (res.type === -1) {
          if (!res.result.confirm) {
            this.setData({
              applyShow: true,
              joinShow: false
            })
          }
        } else if (res.type === 0) {
          this.setData({
            applyShow: true,
            joinShow: false
          })
        }
      })
    } else {
      this.setData({
        joinShow: false
      })
      this.joinGroup(groupInfo).then(res => {
        app.switchData.isSwitchGroup = true
        groupInfo.isJoin = 1 //通过
        groupInfo.groupDuty = 2 //组员
        this.setData({
          groups: this.data.groups
        })
        common.Tip(`恭喜您成功加入${groupInfo.groupName}`, '提示', '确认', true).then(res => {
          if (res.confirm) {
            wx.navigateBack({
              delta: 2,
            })
          }
        })
      })
    }
  },
  // 完成消息授权
  completeMsgAuthorization() {
    this.setData({
      applyShow: true,
      joinShow: false,
      msgAuthorizationShow: false
    })
  },
  // 小组申请输入
  inputApply(e) {
    let applyContent = e.detail.value
    this.setData({
      applyContent
    })
  },
  // 取消小组申请
  cancelApply() {
    this.setData({
      applyShow: false
    })
  },
  // 小组申请
  apply() {
    let applyContent = this.data.applyContent
    if (!applyContent) {
      common.Tip('请输入内容')
      return
    }
    this.applyJoinGrop()
  },
  // 发送申请
  applyJoinGrop() {
    let applyContent = this.data.applyContent
    let groupInfo = this.groupInfo
    this.joinGroup(groupInfo).then(res => {
      groupInfo.isJoin = -1 //审核中
      groupInfo.groupDuty = -1 //审核中
      let from = {
          userId: app.userInfo.id,
          nickName: app.userInfo.nickName
        },
        to = {
          userIdList: res.userIdList
        },
        message = {
          type: 1,
          jsonDate: {
            groupId: groupInfo.id,
            groupName: groupInfo.groupName,
            applyContent,
            isNew: 1,
            status: 0
          }
        }
      app.post(app.Api.sendSubscribeInfo, {
        userIdList: res.userIdList,
        template_id: app.InfoId.joinGroup,
        page: `pages/my/information/information?actIndex=1`,
        data: {
          "thing1": {
            "value": tool.cutstr(groupInfo.groupName, 16)
          },
          "name2": {
            "value": tool.cutstr(app.userInfo.nickName, 6).replace(/[\d]+/g, '*')
          },
          "thing6": {
            "value": tool.cutstr(applyContent, 16)
          },
        },
      })
      app.socket.emit("sendSystemMsg", from, to, message);
      app.switchData.isSwitchGroup = true
      this.setData({
        groups: this.data.groups,
        applyShow: false
      })
    })
  },
  // 加入小组
  joinGroup(groupInfo) {
    // 加入
    return new Promise((resolve, reject) => {
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
        resolve(res)
      }).catch(err => reject(err))
    })

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
  onRefresh() {
    if (this._freshing) return
    this._freshing = true
    this.data.groupPaging.minID = 0
    this.data.groupPaging.pageIndex = 1
    this.data.groupPaging.isNotData = false
    this.data.groups = []
    this.pagingGetGroup(this.data.groupName).then(() => {
      this._freshing = false
      this.setData({
        triggered: false
      })
    })
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