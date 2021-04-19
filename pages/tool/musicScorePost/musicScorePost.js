// pages/tool/musicScorePost/musicScorePost.js
const common = require('../../../assets/tool/common')
import WxValidate from '../../../assets/tool/WxValidate'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
    tempImgPaths: [],
    tempVideoPath: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initValidate()
  },
  //验证规则函数
  initValidate() {
    const rules = {
      tapTitle: {
        required: true
      },
      author: {
        required: true
      },
      source: {
        required: true
      }
    }
    const messages = {
      tapTitle: {
        required: '请填写歌曲名称',
      },
      author: {
        required: '请填写词曲作者'
      },
      source: {
        required: '请填写编配/来源'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
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
    common.chooseImage(6, {
      isCompress: false
    }).then(res => {
      console.log(res.tempFilePaths)
      this.setData({
        tempImgPaths: res.tempFilePaths,
        isData: true
      })
    })
  },
  chooseVideo() {
    common.chooseVideo().then(res => {
      this.setData({
        tempVideoPath: res.tempFilePath,
        isVideo: true
      })
    })
  },
  // 进行校验
  validate(params) {
    let {
      tempImgPaths,
      tempVideoPath
    } = this.data
    return new Promise((resolve, reject) => {
      if (!tempImgPaths.length) reject('请添加曲谱资料')
      if (!this.WxValidate.checkForm(params)) {
        console.log(this.WxValidate.errorList)
        const error = this.WxValidate.errorList[0].msg
        return reject(error)
      }

      return resolve({
      ...params, 
      tapPicLink: tempImgPaths,
      tapVideoLink: tempVideoPath
      })
    })
  },

  issueTap(data) {
    return new Promise((resolve, reject) => {
      app.post(app.Api.issueTap, data, {
        loading: false
      }).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  saveTeam(data) {
    return new Promise((resolve, reject) => {
      app.post(app.Api.saveTeam, data, {
        loading: false
      }).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  // 提交表单
  async formSubmit(e) {
    console.log('form发生了submit事件，携带的数据为：', e.detail.value)
    let params = e.detail.value
    try {
      params = await this.validate(params)
        common.showLoading('发布中')
        let result = await this.issueTap(params)
        if (result.affectedRows) {
          common.Toast('已发布')
          setTimeout(()=> {
            wx.navigateBack()
          },1500)
        }
    } catch (err) {
      console.log(err)
      common.Tip(err)
      wx.hideLoading()
    }
  },
})