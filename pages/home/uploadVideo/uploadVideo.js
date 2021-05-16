// pages/home/uploadVideo/uploadVideo.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
const authorize = require('../../../assets/tool/authorize.js')
const common = require('../../../assets/tool/common')
const upload = require('../../../assets/request/upload')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    // 附近位置,
    index: 0,
    mks: [],
    tempFilePath: '',
    msgAuthorizationShow: false,
    requestId: [app.InfoId.like, app.InfoId.content, app.InfoId.reply]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tempFilePath = JSON.parse(options.tempFilePath)
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    this.setData({
      tempFilePath: tempFilePath
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
  // 选择视频
  chooseVideo() {
    common.chooseVideo().then(res => {
      this.setData({
        tempFilePath: res.tempFilePath
      })
    })
  },
  // 删除视频
  deletevideo() {
    common.vibrateShort().then(() => {
      common.Tip('删除视频', '提示', '确定', true).then(res => {
        if (res.confirm) {
          this.setData({
            tempFilePath: ""
          })
        }
      })
    })
  },
  // 获取定位
  getLocation() {
    authorize.getLocation(data => {
      if (data.err) return
      if (data.success) {
        const location = {
          latitude: data.latitude,
          longitude: data.longitude
        }
        tool.reverseGeocoder(location).then(data => {
          console.log(data)
          this.setData({
            mks: data.mks
          }, () => {
            wx.hideLoading()
          })
        }).catch(err => console.log(err))
      } else if (data.warning) {
        //用户拒绝位置信息授权
        console.log(data)
      }
    })
  },
  // 弹起位置选择
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  // 进行校验
  validate(params) {
    let describe = params.describe
    let mks = this.data.mks
    let location = ''
    return new Promise((resolve, reject) => {
      let tempFilePath = this.data.tempFilePath
      if (!tempFilePath || !describe) return reject('要添加视频和描述哦')
      if (mks.length) {
        location = mks[this.data.index].title
      }
      // app.userInfo.avatarUrl ||  app.userInfo.nickName
      return resolve({
        introduce: describe,
        videoUrl: tempFilePath,
        location,
        groupName: app.userInfo.groupName,
        mold: 1
      })
    })
  },
  // 上传视频
  uploadVideo(tempImgParh) {
    return new Promise((resolve, reject) => {
      // app.userInfo.id
      let option = {
          userId:  app.userInfo.id,
          type: 'video',
          module: 'groupdynamics'
        },
        conf = {
          loading: false,
          toast: false
        }
      upload.uploadFile(app.Api.uploadImg, tempImgParh, option, conf).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  // 以视频发布
  videoIssue(data) {
    return new Promise((resolve, reject) => {
      console.log(data)
      app.post(app.Api.videoIssue, data, {
        loading: false
      }).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  // 提交表单
  async formSubmit(e) {
    console.log('form发生了submit事件，携带的数据为：', e.detail.value)
    let params = e.detail.value
    console.log(params)
    try {
      params = await this.validate(params)
      let subscriptionsSetting = await authorize.isSubscription()
      if (!subscriptionsSetting.itemSettings) {
        this.params = params
        // 未勾选总是
        this.setData({
          msgAuthorizationShow: true
        })
      } else {
        this.submitTeam(params)
      }
    } catch (err) {
      console.log(err)
      common.Tip(err)
      wx.hideLoading()
    }
  },
  completeMsgAuthorization() {
    this.submitTeam(this.params)
  },
  async submitTeam(params) {
    common.showLoading('发布中')
    params.videoUrl = await this.uploadVideo(params.videoUrl)
    const result = await this.videoIssue({
      ...params,
      userId: app.userInfo.id,
      groupId: app.userInfo.groupId
    })
    common.Toast('已发布')
    this.goHome()
  },
  goHome() {
    app.switchData.refresh = true
    wx.navigateBack()
  },
})
