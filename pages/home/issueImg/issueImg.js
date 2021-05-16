// pages/home/issueImg/issueImg.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
const authorize = require('../../../assets/tool/authorize.js')
const common = require('../../../assets/tool/common.js')
const upload = require('../../../assets/request/upload')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
    // 剩余能够上传多少张图片
    restCount: 9,
    // 存放图片的数组
    tempFilePaths: [],
    // 附近位置,
    index: 0,
    mks: [],
    msgAuthorizationShow: false,
    requestId: [app.InfoId.like, app.InfoId.content, app.InfoId.reply]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tempFilePaths = JSON.parse(options.tempFilePaths)
    this.setData({
      tempFilePaths,
      restCount: this.data.restCount - tempFilePaths.length
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
  addImg() {
    const restCount = this.data.restCount
    common.chooseImage(restCount).then(res => {
      //如果直接arrA.push(arrB); 则arrB只会作为了arrA的一个元素，并且是修改原数组
      const tempFilePaths = this.data.tempFilePaths.concat(res.tempFilePaths)
      this.setData({
        tempFilePaths,
        restCount: restCount - res.tempFilePaths.length
      })
    })
  },
  previewImage(ev) {
    //查看对应的图片
    const id = ev.target.dataset.id;
    common.previewImage([this.data.tempFilePaths[id]])
  },
  toDelete(ev) {
    const id = ev.target.dataset.id;
    // 删除数组中对应index的元素，会改变原数组,修改的是tempFilePaths里面的元素,tempFilePaths本身引用没有改变，页面没有监听到
    // const tempFilePath = this.data.tempFilePaths.splice(index, 1);
    //过滤生成一个新的数组
    const tempFilePaths = this.data.tempFilePaths.filter((item, index) => {
      return index != id
    })
    this.setData({
      restCount: this.data.restCount + 1,
      tempFilePaths
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
      let tempFilePaths = this.data.tempFilePaths
      if (!tempFilePaths.length || !describe) return reject('要添加一些描述和图片哦')
      if (mks.length) {
        location = mks[this.data.index].title
      }
      return resolve({
        introduce: describe,
        pictureUrls: tempFilePaths,
        location,
        groupName: app.userInfo.groupName,
        mold: 0
      })
    })
  },
  // 上传图片
  uploadImg(tempImgParhs) {
    return new Promise((resolve, reject) => {
      // app.userInfo.id
      let option = {
          userId: app.userInfo.id,
          type: 'image',
          module: 'groupdynamics'
        },
        conf = {
          loading: false,
          toast: false
        }
      upload.uploadManyImg(app.Api.uploadImg, tempImgParhs, option, conf).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  // 以图片发布
  pictureIssue(data) {
    return new Promise((resolve, reject) => {
      console.log(data)
      app.post(app.Api.pictureIssue, data, {
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
    if (params.pictureUrls.length) {
      params.pictureUrls = await this.uploadImg(params.pictureUrls)
    }
    const result = await this.pictureIssue({
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