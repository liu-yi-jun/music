// pages/tool/musicScorePost/musicScorePost.js
const common = require('../../../assets/tool/common')
const upload = require('../../../assets/request/upload')
import WxValidate from '../../../assets/tool/WxValidate'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
    tempImgPaths: [],
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
  videoSheet() {
    wx.showActionSheet({
      itemList: ['添加网络链接', '从手机选择视频'],
      success: res => {
        console.log(res)
        if (res.tapIndex === 1) {
          this.chooseVideo()
        } else if (res.tapIndex === 0) {
          this.setData({
            linkDialogShow:true
          })
        }
      }
    })
  },
  chooseVideo() {
    common.chooseVideo().then(res => {
      this.setData({
        tempVideoPath: res.tempFilePath,
        linkUrl:''
      })
    })
  },
  // 进行校验
  validate(params) {
    let {
      tempImgPaths,
      tempVideoPath,
      linkUrl
    } = this.data
    return new Promise((resolve, reject) => {
      if (!tempImgPaths.length) reject('请添加曲谱资料')
      if (!this.WxValidate.checkForm(params)) {
        console.log(this.WxValidate.errorList)
        const error = this.WxValidate.errorList[0].msg
        return reject(error)
      }
      params.author = '词曲:' + params.author
      params.source = '来源/编配：' + params.source
      return resolve({
        ...params,
        tapPicLink: tempImgPaths,
        tapVideoLink: tempVideoPath || linkUrl
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
    // 上传视频
    uploadVideo(tempImgParh) {
      return new Promise((resolve, reject) => {
        // app.userInfo.id
        let option = {
            userId: app.userInfo.id,
            type: 'video',
            module: 'tap'
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
            module: 'tap'
          },
          conf = {
            loading: false,
            toast: false
          }
        upload.uploadManyImg(app.Api.uploadImg, tempImgParhs, option, conf).then(res => resolve(res)).catch(err => reject(err))
      })
    },
  // 提交表单
  async formSubmit(e) {
    console.log('form发生了submit事件，携带的数据为：', e.detail.value)
    let params = e.detail.value
    let {
      tempImgPaths,
      tempVideoPath,
      linkUrl
    } = this.data
    try {
      params = await this.validate(params)
      common.showLoading('发布中')
      if (tempImgPaths.length ) params.tapPicLink = await this.uploadImg(tempImgPaths)
      if (tempVideoPath && !linkUrl) params.tapVideoLink = await this.uploadVideo(tempVideoPath)

      let result = await this.issueTap(params)
      if (result.affectedRows) {
        common.Toast('已发布')
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      }
    } catch (err) {
      console.log(err)
      common.Tip(err)
      wx.hideLoading()
    }
  },
  toDelete(e) {
    let type = e.currentTarget.dataset.type
    if (type === "image") {
      this.setData({
        tempImgPaths: [],
        isData: false
      })
    } else if (type === "video") {
      this.setData({
        tempVideoPath: '',
        linkUrl:''
      })
    }
  }
})