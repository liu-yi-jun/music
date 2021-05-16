// pages/home/puchCard/issuePuchCard/issuePuchCard.js
const app = getApp()
const tool = require('../../../../assets/tool/tool.js')
const common = require('../../../../assets/tool/common')
const upload = require('../../../../assets/request/upload')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
    tempDataPaths: [],
    tempVideoPath: '',
    isData: false,
    // 控制连接弹窗
    linkDialogShow: false,
    // 链接路径
    linkUrl: '',
    // 标注视频链接类型
    isVid: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
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
  previewImage() {
    common.previewImage(this.data.tempDataPaths)
  },
  chooseData() {
    common.chooseImage(1, {
      isCompress: false
    }).then(res => {
      console.log(res.tempFilePaths)
      this.setData({
        tempDataPaths: res.tempFilePaths,
        isData: true
      })
    })
  },
  // 完成输入链接
  completeInput(e) {
    let {
      linkUrl,
      isVid
    } = e.detail
    console.log('完成', e.detail);
    this.setData({
      linkUrl,
      tempVideoPath: '',
      isVid,
      linkDialogShow: false
    })
  },
  videoSheet() {
    wx.showActionSheet({
      itemList: ['添加网络链接', '从手机选择视频'],
      success: res => {
        console.log(res)
        if (res.tapIndex === 1) {
          this.chooseVideo()
        } else if (res.tapIndex === 0) {
          this.setData({
            linkDialogShow: true
          })
        }
      }
    })
  },
  chooseVideo() {
    common.chooseVideo().then(res => {
      this.setData({
        tempVideoPath: res.tempFilePath,
        linkUrl: ''
      })
    })
  },
  // 上传视频
  uploadVideo(tempImgParh) {
    return new Promise((resolve, reject) => {
      // app.userInfo.id
      let option = {
          userId: app.userInfo.id,
          type: 'video',
          module: 'groupcard'
        },
        conf = {
          loading: false,
          toast: false
        }
      upload.uploadFile(app.Api.uploadImg, tempImgParh, option, conf).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  // 上传图片
  uploadImg(tempImgParhs) {
    return new Promise((resolve, reject) => {
      // app.userInfo.id
      let option = {
          userId: app.userInfo.id,
          type: 'image',
          module: 'groupcard'
        },
        conf = {
          loading: false,
          toast: false
        }
      upload.uploadManyImg(app.Api.uploadImg, tempImgParhs, option, conf).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  async issue() {
    try {
      let linkUrl = this.data.linkUrl
      let params = await this.validate()
      common.showLoading('创建中')
      if (params.datumUrls.length) {
        params.datumUrls = await this.uploadImg(params.datumUrls)
      }
      if (params.videoUrl && !linkUrl) {
        params.videoUrl = await this.uploadVideo(params.videoUrl)
      }
      const result = await this.issueGroupCard(params)
      console.log(result)
      this.goPuchCard()
      common.Toast('创建成功')
    } catch (err) {
      console.log(err)
      common.Tip(err)
      wx.hideLoading()
    }
  },
  goPuchCard() {
    app.issuePuchCardBack = true
    wx.navigateBack()
  },
  // 发布打卡
  issueGroupCard(data) {
    return new Promise((resolve, reject) => {
      app.post(app.Api.issueGroupCard, data, {
        loading: false
      }).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  // 进行校验
  validate() {
    return new Promise((resolve, reject) => {
      let tempDataPaths = this.data.tempDataPaths
      let tempVideoPath = this.data.tempVideoPath
      let linkUrl = this.data.linkUrl
      if (!tempDataPaths.length && !tempVideoPath && !linkUrl) return reject('请添加资料或者视频')
      resolve({
        datumUrls: tempDataPaths,
        videoUrl: tempVideoPath || linkUrl,
        adminId: app.userInfo.id,
        groupId: app.userInfo.groupId
      })
    })
  },
})