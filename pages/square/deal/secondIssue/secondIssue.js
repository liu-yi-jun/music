// pages/square/deal/secondIssue/secondIssue.js
const app = getApp()
const tool = require('../../../../assets/tool/tool.js')
const common = require('../../../../assets/tool/common')
const upload = require('../../../../assets/request/upload')
const authorize = require('../../../../assets/tool/authorize.js')
import WxValidate from '../../../../assets/tool/WxValidate'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    avatarUrl: '',
    nickName: '',
    tempImagePaths: [],
    tempVideoPath: '',
    // 附近位置,
    index: 0,
    mks: [],
    dialogShow: true,
    money: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    this.getUserInfo()
    this.initValidate()
  },
  //验证规则函数
  initValidate() {
    const rules = {
      brand: {
        required: true,
      },
      newOld: {
        required: true,
      },
      contact: {
        required: true,
      }
    }
    const messages = {
      brand: {
        required: '请输入品牌·型号',
      },
      newOld: {
        required: '请输入新旧程度',
      },
      contact: {
        required: '请输入联系方式',
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  getUserInfo() {
    let {
      avatarUrl,
      nickName
    } = app.userInfo
    this.setData({
      avatarUrl,
      nickName
    })
  },
  inputMoney(data) {
    this.setData({
      money: data.detail.money
    })
  },
  chooseImage(data) {
    this.setData({
      tempImagePaths: data.detail.tempImagePaths,
      tempVideoPath: ''
    })
  },
  chooseVideo(data) {
    this.setData({
      tempVideoPath: data.detail.tempVideoPath,
      tempImagePaths: []
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
  bindtopicPickerChange(e) {
    this.setData({
      topicIndex: e.detail.value
    })
  },
  previewImage(ev) {
    //查看对应的图片
    const id = ev.target.dataset.id;
    common.previewImage([this.data.tempImagePaths[id]])
  },
  // 进行校验
  validate(params) {
    let {
      tempVideoPath,
      tempImagePaths,
      mks,
      money
    } = this.data
    let location = ''
    return new Promise((resolve, reject) => {
      if (!this.WxValidate.checkForm(params)) {
        console.log(this.WxValidate.errorList)
        const error = this.WxValidate.errorList[0].msg
        return reject(error)
      }
      if (!tempImagePaths.length) return reject('需要添加商品图片哦')
      if (!money) return reject('请添加商品金额')
      if (mks.length) {
        location = mks[this.data.index].title
      }
      return resolve({
        userId: app.userInfo.id,
        nickName: app.userInfo.nickName,
        avatarUrl: app.userInfo.avatarUrl,
        pictureUrls: tempImagePaths || [],
        videoUrl: tempVideoPath || '',
        location,
        price: money,
        ...params
      })
    })
  },

  // 提交表单
  async formSubmit(e) {
    let params = e.detail.value
    let {
      tempVideoPath,
      tempImagePaths
    } = this.data
    try {
      params = await this.validate(params)
      common.showLoading('发布中')
      if (tempVideoPath) params.videoUrl = await this.uploadVideo(tempVideoPath)
      if (tempImagePaths.length) params.pictureUrls = await this.uploadImg(tempImagePaths)
      const result = await this.secondIssue(params)
      console.log(result)
      if (result.affectedRows) {
        this.godeal()
      }
      common.Toast('已发布')
    } catch (err) {
      console.log(err)
      common.Tip(err)
      wx.hideLoading()
    }
  },
  godeal() {
    app.secondIssueBack = true
    wx.navigateBack()
  },
  // 上传视频
  uploadVideo(tempImgParh) {
    return new Promise((resolve, reject) => {
      // app.userInfo.id
      let option = {
          userId: app.userInfo.id,
          type: 'video',
          module: 'second'
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
          module: 'second'
        },
        conf = {
          loading: false,
          toast: false
        }
      upload.uploadManyImg(app.Api.uploadImg, tempImgParhs, option, conf).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  // 添加二手乐器
  secondIssue(data) {
    return new Promise((resolve, reject) => {
      console.log(data)
      app.post(app.Api.secondIssue, data, {
        loading: false
      }).then(res => resolve(res)).catch(err => reject(err))
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
  handlerGobackClick: app.handlerGobackClick
})