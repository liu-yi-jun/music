// pages/home/myGroup/myGroup.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    followGroupPaging: {
      pageSize: 10,
      pageIndex: 1,
      isNotData: false,
    },
    joinGroupPaging: {
      pageSize: 10,
      pageIndex: 1,
      isNotData: false,
    },
    settleGroupPaging: {
      pageSize: 10,
      pageIndex: 1,
      isNotData: false,
    },
    followGroups: [],
    settleGroup: [],
    joinGroup: [],
    groupName: '',
    barList: [{
        name: '加入的小组',
      },
      {
        name: '入驻的小组'
      },
      {
        name: '关注的小组'
      },
    ],
    actIndex: 0,
    triggered: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    if (app.userInfo) {
      this.getSettleGroup()
      this.getJoinGroup()
      this.pagingGetFollowGroup(this.data.groupName)
    }
  },
  getSettleGroup() {
    let settleGroupPaging = this.data.settleGroupPaging
    return new Promise((resolve, reject) => {
      app.get(app.Api.pagingGetSettleGroup, {
        userId: app.userInfo.id,
        ...settleGroupPaging
      }, {
        loading: false
      }).then(res => {
        if (res.length < settleGroupPaging.pageSize) {
          this.setData({
            'settleGroupPaging.isNotData': true
          })
        }
        this.setData({
          settleGroup: this.data.settleGroup.concat(this.isJoinGroup(res)),
          'settleGroupPaging.pageIndex': settleGroupPaging.pageIndex + 1
        })
        resolve()
      })
    })
  },
  getJoinGroup() {
    let joinGroupPaging = this.data.joinGroupPaging
    return new Promise((resolve, reject) => {
      app.get(app.Api.pagingGetJoinGroup, {
        userId: app.userInfo.id,
        ...joinGroupPaging
      }, {
        loading: false
      }).then(res => {
        if (res.length < joinGroupPaging.pageSize) {
          this.setData({
            'joinGroupPaging.isNotData': true
          })
        }
        this.setData({
          joinGroup: this.data.joinGroup.concat(this.isJoinGroup(res)),
          'joinGroupPaging.pageIndex': joinGroupPaging.pageIndex + 1
        })
        resolve()
      })
    })
  },
  // 获取所有关注的小组
  pagingGetFollowGroup(groupName) {
    let followGroupPaging = this.data.followGroupPaging
    return new Promise((resolve, reject) => {
      app.get(app.Api.pagingGetFollowGroup, {
        groupName,
        userId: app.userInfo.id,
        ...followGroupPaging
      }, {
        loading: false
      }).then(res => {
        if (res.length < followGroupPaging.pageSize) {
          this.setData({
            'followGroupPaging.isNotData': true
          })
        }
        this.setData({
          followGroups: this.data.followGroups.concat(this.isJoinGroup(res)),
          'followGroupPaging.pageIndex': followGroupPaging.pageIndex + 1
        })
        resolve()
      })
    })
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
    if (!this.data.joinGroupPaging.isNotData && this.data.actIndex === 0) {
      this.getJoinGroup()
    } else if (!this.data.settleGroupPaging.isNotData && this.data.actIndex === 1) {
      this.getSettleGroup()
    } else if (!this.data.followGroupPaging.isNotData && this.data.actIndex === 2) {
      this.pagingGetFollowGroup(this.data.groupName)
    }
  },
  onRefresh() {
    if (this._freshing) return
    this._freshing = true
    if (this.data.actIndex === 0) {
      this.setData({
        'joinGroupPaging.pageIndex': 1,
        'joinGroupPaging.isNotData': false,
        joinGroup: []
      }, () => {
        this.getJoinGroup().then(() => {
          this._freshing = false
          this.setData({
            triggered: false
          })
        })
      })
    } else if (this.data.actIndex === 1) {
      this.setData({
        'settleGroupPaging.pageIndex': 1,
        'settleGroupPaging.isNotData': false,
        settleGroup: []
      }, () => {
        this.getSettleGroup().then(() => {
          this._freshing = false
          this.setData({
            triggered: false
          })
        })
      })
    } else if (this.data.actIndex === 2) {
      this.setData({
        'followGroupPaging.pageIndex': 1,
        'followGroupPaging.isNotData': false,
        followGroups: []
      }, () => {
        this.pagingGetFollowGroup(this.data.groupName).then(() => {
          this._freshing = false
          this.setData({
            triggered: false
          })
        })
      })
    }

  },
  switchBtn(e) {
    let actIndex = e.detail.actIndex
    if (this.data.actIndex === actIndex) {
      return
    }
    this.setData({
      actIndex
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

})