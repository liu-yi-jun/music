// pages/square/band/application/application.js
const app = getApp()
const tool = require('../../../../assets/tool/tool.js')
const common = require('../../../../assets/tool/common')
const upload = require('../../../../assets/request/upload.js')
import WxValidate from '../../../../assets/tool/WxValidate'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    isShowPopup: false,
    userInfo: {},
    recruits: [],
    tempFilePath: '',
    dialogShow: false,
    gender: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let recruits = options.recruits
    this.bandId = parseInt(options.bandId)
    this.userId = parseInt(options.userId)
    recruits = tool.arraySplit(tool.reduction(JSON.parse(recruits)), 3)
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    this.initValidate()
    this.setData({
      userInfo: app.userInfo,
      gender: app.userInfo.gender,
      recruits
    })
  },
  changeWoman() {
    this.setData({
      gender: 2
    })
  },
  changeman() {
    this.setData({
      gender: 1
    })
  },
  //验证规则函数
  initValidate() {
    const rules = {
      userName: {
        required: true,
      },
      contact: {
        required: true,
      }
    }
    const messages = {
      userName: {
        required: '请输入姓名',
      },
      contact: {
        required: '请输入联系方式'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  // 进行校验
  validate(params) {
    let {
      tempFilePath,
      userInfo,
      recruits
    } = this.data
    return new Promise((resolve, reject) => {
      if (!this.WxValidate.checkForm(params)) {
        console.log(this.WxValidate.errorList)
        const error = this.WxValidate.errorList[0].msg
        return reject(error)
      }

      let perform = []
      recruits.forEach(recruit => {
        recruit.forEach(item => {
          if (item.exist) {
            perform.push(item)
          }
        })
      })
      if (!perform.length) return reject('请选择你想表演的形式')
      resolve({
        ...params,
        videoUrl: tempFilePath,
        bandId: this.bandId,
        gender: this.data.gender,
        issueId: this.userId,
        joinId: userInfo.id,
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        perform
      })
    })
  },
  // 参加band
  joinBand(data) {
    return new Promise((resolve, reject) => {
      console.log(data)
      app.post(app.Api.joinBand, data, {
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
          module: 'system'
        },
        conf = {
          loading: false,
          toast: false
        }
      upload.uploadFile(app.Api.uploadImg, tempImgParh, option, conf).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  // 提交表单
  async formSubmit(e) {
    console.log('form发生了submit事件，携带的数据为：', e.detail.value)
    let params = e.detail.value
    let {
      tempFilePath
    } = this.data
    try {
      params = await this.validate(params)
      var regName = /^[\u4e00-\u9fa5]{2,10}$/;
      if (!regName.test(params.userName)) {
        return common.Tip('请正确输入您的姓名')
      }
      common.showLoading('创建中')
      if (tempFilePath) params.videoUrl = await this.uploadVideo(tempFilePath)
      const result = await this.joinBand(params)
      console.log(result)
      let from = {
          userId: params.joinId,
          nickName: params.nickName,
          avatarUrl: params.avatarUrl,

        },
        to = {
          userIdList: [{
            userId: params.issueId
          }]
        },
        message = {
          id: new Date().getTime(),
          type: 3,
          jsonDate: {
            gender: params.gender,
            userName: params.userName,
            videoUrl: params.videoUrl,
            bandId: params.bandId,
            perform: params.perform,
            contact: params.contact,
            remark: params.remark,
            isNew: 1
          }
        }
      app.post(app.Api.sendSubscribeInfo, {
        otherId: params.issueId,
        template_id: app.InfoId.band,
        page: `pages/my/information/information?actIndex=1`,
        data: {
          "name1": {
            "value": tool.cutstr(params.userName, 6).replace(/[\d]+/g, '*')
          },
          "thing5": {
            "value": tool.cutstr(params.userName, 16)
          },
        }
      })
      app.post(app.Api.sendFinalSystemMsg, {
        from,
        to,
        message
      }).then(() => {})
      // app.socket.emit("sendSystemMsg", from, to, message);

      wx.hideLoading()
      common.Tip('申请已发送，等待审核').then(() => {
        wx.navigateBack()
      })

    } catch (err) {
      common.Tip(err)
      wx.hideLoading()
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
  showPopup() {
    this.setData({
      isShowPopup: true
    })
  },
  hidePopup(e) {
    console.log(e)
    let myMark = e.mark.myMark
    if (!myMark) {
      this.setData({
        isShowPopup: false
      })
    }
  },
  upload() {
    common.chooseVideo().then((res) => {
      this.setData({
        tempFilePath: res.tempFilePath
      })
    })
  },
  select(e) {
    let {
      i,
      j
    } = e.currentTarget.dataset
    let recruits = this.data.recruits
    recruits[i][j].exist = recruits[i][j].exist ? false : true
    this.setData({
      recruits
    })
  },
  popupVideo() {
    this.setData({
      dialogShow: true
    })
  },
  cancelPopup(e) {
    let popup = e.mark.popup
    if (popup != 'true') {
      this.setData({
        dialogShow: false
      })
    }
  }
})