// pages/init/groupSettlement/groupSettlement.js
const common = require('../../../assets/tool/common.js')
const upload = require('../../../assets/request/upload.js')
import WxValidate from '../../../assets/tool/WxValidate'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    tempFilePaths: [],
    form: {
      groupName: '',
      introduce: '',
      privates: false,
      examine: true
    }
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
      groupName: {
        required: true,
        minlength: 4,
        maxlength: 12
      },
    }
    const messages = {
      groupName: {
        required: '请填写小组名称',
        minlength: '小组名称不少于4个字符',
        maxlength: '小组名称不大于12个字符'
      },
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
  onShow: function () {},

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

  // 选择图片
  chooseGroupLogo() {
    common.chooseImage(1).then(res => {
      this.setData({
        tempFilePaths: res.tempFilePaths
      })
    })
  },
  // 预览图片
  previewImage() {
    common.previewImage(this.data.tempFilePaths)
  },
  // 删除图片
  deleteImg() {
    common.vibrateShort().then(() => {
      common.Tip('删除图片', '提示', '确定', true).then(res => {
        if (res.confirm) {
          this.setData({
            tempFilePaths: []
          })
        }
      })
    })
  },
  // 上传图片
  uploadImg(tempImgParhs) {
    return new Promise((resolve, reject) => {
      let option = {
          userId: app.userInfo.id,
          type: 'image',
          module: 'groups'
        },
        conf = {
          loading: false,
          toast: false
        }
      upload.uploadManyImg(app.Api.uploadImg, tempImgParhs, option, conf).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  // 进行校验
  validate(params) {
    return new Promise((resolve, reject) => {
      let tempFilePaths = this.data.tempFilePaths
      if (!tempFilePaths.length) return reject('请添加小组logo')
      if (!this.WxValidate.checkForm(params)) {
        console.log(this.WxValidate.errorList)
        const error = this.WxValidate.errorList[0].msg
        return reject(error)
      }
      resolve(params)
    })
  },
  // 创建小组
  createGroup(data) {
    return new Promise((resolve, reject) => {
      console.log(data)
      app.post(app.Api.createGroup, data, {
        loading: false
      }).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  // 去首页
  goHome() {
    wx.switchTab({
      url: "/pages/home/home"
    })
  },
  // 提交表单
  async formSubmit(e) {
    console.log('form发生了submit事件，携带的数据为：', e.detail.value)
    let params = e.detail.value
    try {
      params = await this.validate(params)
      common.showLoading('创建中')
      const imgUrls = await this.uploadImg(this.data.tempFilePaths)
      const result = await this.createGroup({
        ...params,
        userId: app.userInfo.id,
        groupLogo: imgUrls[0]
      })
      app.userInfo = result
      console.log(result)
      common.Toast('创建成功')
      this.goHome()
    } catch (err) {
      common.Tip(err)
      wx.hideLoading()
    }
  },

})