// pages/my/my.js
let app = getApp()
const common = require('../../assets/tool/common')
const upload = require('../../assets/request/upload')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 控制右下角三角show
    tabBarBtnShow: false,
    userInfo: {},
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
    barList: [{
        name: '动态',
      },
      {
        name: '发布'
      },
    ],
    actIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDynamics(app.userInfo.id)
    this.getPersonalAlliance(app.userInfo.id)
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
      userId: id
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
  // 设置用户信息
  setUserInfo() {
    this.setData({
      userInfo: app.userInfo
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      })
      // app.getNotice(this, app.userInfo.id)
    }
    if (app.userInfo) {
      this.setUserInfo()
    } else {
      this.setData({
        dialogShow: true
      })
    }
  },
  handleGetUserInfo() {
    this.setUserInfo()
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
  // 控制bar栏
  tap() {
    this.setData({
      tabBarBtnShow: true
    })
    this.getTabBar().setData({
      show: false
    })
  },

  goEditData() {
    wx.navigateTo({
      url: '/pages/my/editData/editData',
    })
  },
  gofollowMass(e) {
    wx.navigateTo({
      url: `/pages/my/followMass/followMass`,
    })
  },
  goInvitation() {
    let userId = app.userInfo.id
    wx.navigateTo({
      url: `/pages/my/invitation/invitation?userId=${userId}`,
    })
  },
  goStore() {
    wx.navigateTo({
      url: '/pages/my/store/store',
    })
  },
  goInformation() {
    wx.navigateTo({
      url: '/pages/my/information/information',
    })
  },
  goFans(e) {
    let otherId = app.userInfo.id
    wx.navigateTo({
      url: `/pages/my/fans/fans?otherId=${otherId}`,
    })
  },

  previewImage() {
    common.previewImage([app.userInfo.avatarUrl])
  },
  async changeImg(e) {
    let Mymark = e.mark.Mymark
    if (Mymark) return
    try {
      let {
        tempFilePaths
      } = await common.chooseImage(1)
      common.showLoading('更换中')
      let bgWalls = await this.uploadImg(tempFilePaths)
      let result = await this.changeBgWall(bgWalls[0])
      console.log(tempFilePaths, bgWalls, result)
      app.userInfo.bgWall = bgWalls[0]
      this.setData({
        userInfo: app.userInfo
      })
      common.Toast('更换成功')
    } catch (err) {
      common.Toast(err)
      wx.hideLoading()
    }
  },
  uploadImg(tempImgParhs) {
    return new Promise((resolve, reject) => {
      let option = {
          userId: app.userInfo.id,
          type: 'image',
          module: 'users'
        },
        conf = {
          loading: false,
          toast: false
        }
      upload.uploadManyImg(app.Api.uploadImg, tempImgParhs, option, conf).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  changeBgWall(bgWall) {
    return new Promise((resolve, reject) => {
      let userId = app.userInfo.id
      app.post(app.Api.changeBgWall, {
        userId,
        bgWall
      }, {
        loading: false
      }).then(res => resolve(res)).catch(err => reject(err))
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
})