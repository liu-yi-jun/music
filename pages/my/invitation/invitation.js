// pages/my/invitation/invitation.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
const core = require('../../../assets/tool/core')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    personal: {},
    dynamicsPaging: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false
    },
    alliancePagin: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false
    },
    dynamics: [],
    alliances: [],
    userId: 0,
    otherId: 0,
    isFollow: false,
    barList: [{
        name: '动态',
      },
      {
        name: '发布'
      },
    ],
    actIndex: 0,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    let otherId = parseInt(options.userId)
    tool.navExcludeHeight(this)
    this.getPersonalInvitation(otherId)
    this.getDynamics(otherId)
    this.getPersonalAlliance(otherId)
    this.setData({
      otherId: otherId,
      userId: app.userInfo.id
    })
  },
  getPersonalAlliance(id) {
    let alliancePagin = this.data.alliancePagin
    app.get(app.Api.personalAlliance, {
      ...alliancePagin,
      userId: id
    }).then(res => {
      if (res.length < alliancePagin.pageSize) {
        this.setData({
          'alliancePagin.isNotData': true
        })
      }
      this.setData({
        alliances: this.data.alliances.concat(res),
        'alliancePagin.pageIndex': alliancePagin.pageIndex + 1
      })
    })
  },
  getDynamics(id) {
    let dynamicsPaging = this.data.dynamicsPaging
    app.get(app.Api.getDynamics, {
      ...dynamicsPaging,
      otherId: id,
      userId:app.userInfo.id
    }).then(res => {
      if (res.length < dynamicsPaging.pageSize) {
        this.setData({
          'dynamicsPaging.isNotData': true
        })
      }
      this.setData({
        dynamics: this.data.dynamics.concat(res),
        'dynamicsPaging.pageIndex': dynamicsPaging.pageIndex + 1
      })
    })
  },
  onReachBottom() {
    let {
      dynamicsPaging,
      alliancePagin,
      actIndex
    } = this.data
    if (actIndex === 0 && !dynamicsPaging.isNotData) {
      this.getDynamics()
    } else if (actIndex === 1 && !alliancePagin.isNotData) {
      this.getPersonalAlliance()
    }
  },
  getPersonalInvitation(id) {
    app.get(app.Api.personalInvitatio, {
      id,
      userId: app.userInfo.id
    }).then(res => {
      this.setData({
        personal: res[0]
      })
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
  onShareAppMessage: function (e) {
    let index = e.target.dataset.index
    let dynamics = this.data.dynamics
    setTimeout(() => {
      app.post(app.Api.share, {
        table: dynamics[index].tableName,
        id: dynamics[index].id
      }, {
        loading: false
      }).then(res => {
        dynamics[index].share++
        this.setData({
          dynamics
        })
      })
    }, 3000)

  },
  goOtherHome(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/home/otherHome/otherHome?showGroupId=${id}`,
    })
  },
  followUser() {
    let personal = this.data.personal
    this.setData({
      'personal.isFollow': !personal.isFollow,
      'personal.fans': !personal.isFollow ? personal.fans + 1 : personal.fans - 1
    }, () => {
      core.operateFollow(app.Api.followUser, {
        operate: this.data.personal.isFollow,
        relation: {
          userId: app.userInfo.id,
          otherId: this.data.personal.id,
        }
      })
    })
  },
  handlerGobackClick: app.handlerGobackClick,
  goFansFollow(e) {
    const flag = e.currentTarget.dataset.flag;
    let otherId = this.data.otherId
    wx.navigateTo({
      url: `../fansFollow/fansFollow?flag=${flag}&otherId=${otherId}`,
    })
  },
  goPrivateLetter() {
    let personal = this.data.personal
    let to = {
      userId: personal.id,
      nickName: personal.nickName,
      avatarUrl: personal.avatarUrl
    }
    to = JSON.stringify(to)
    wx.navigateTo({
      url: `/pages/my/privateLetter/privateLetter?to=${to}`,
    })
  },
  //切换btn 
  switchBtn(e) {
    let actIndex = e.detail.actIndex
    if (actIndex === this.data.actIndex) return
    this.setData({
      actIndex
    })
  },
  completeLike(commenetBarData) {
    const dynamicList = this.selectComponent('#dynamicList');
    dynamicList.completeLike(commenetBarData)

  },
  completeStore(commenetBarData) {
    const dynamicList = this.selectComponent('#dynamicList');
    dynamicList.completeStore(commenetBarData)
  },
})