// pages/my/editData/editData.js
const common = require('../../../assets/tool/common')
const upload = require('../../../assets/request/upload')
const app = getApp()
import WxValidate from '../../../assets/tool/WxValidate'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    tempFilePaths: [],
    array: ['无','白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'],
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setUserInfo()
    this.initValidate()
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: Number(e.detail.value) 
    })
  },
  //验证规则函数
  initValidate() {
    const rules = {
      nickName: {
        required: true,
        // minlength: 4,
        maxlength: 10
      },
    }
    const messages = {
      nickName: {
        required: '请填写昵称',
        // minlength: '昵称不少于4个字符',
        maxlength: '昵称不大于10个字符'
      },
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  // 设置用户信息
  setUserInfo() {
    let array = this.data.array
    array.forEach((item, index) => {
      if (item === app.userInfo.constellation) {
        this.setData({
          index
        })
      }
    })
    this.setData({
      userInfo: app.userInfo,
      tempFilePaths: [app.userInfo.avatarUrl]
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
  changeWoman() {
    this.data.userInfo.gender = 2
    this.setData({
      userInfo: this.data.userInfo
    })
  },
  changeman() {
    this.data.userInfo.gender = 1
    this.setData({
      userInfo: this.data.userInfo
    })
  },
  // 预览图片
  previewImage() {
    common.previewImage(this.data.tempFilePaths)
  },
  chooseAvatar() {
    common.chooseImage(1).then(res => {
      this.setData({
        tempFilePaths: res.tempFilePaths
      })
    })
  },
  // 上传图片
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
  // 修改用户数据
  updateUserInfo(data) {
    return new Promise((resolve, reject) => {
      console.log(data)
      app.post(app.Api.updateUserInfo, data, {
        loading: false
      }).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  async formSubmit(e) {
    console.log('form发生了submit事件，携带的数据为：', e.detail.value)
    let params = e.detail.value
    let array = this.data.array
    if (params.age === '') {
      params.age = null
    } else {
      params.age = Number(params.age)
    }
    if (params.constellation === 0) {
      params.constellation = null
    }else {
      params.constellation = array[params.constellation]
    }
    console.log(params)
    try {
      params = await this.validate(params)
      common.showLoading('修改中')
      let imgUrls = []
      if (this.data.userInfo.avatarUrl !== this.data.tempFilePaths[0]) {
        imgUrls = await this.uploadImg(this.data.tempFilePaths)
      }
      console.log(imgUrls)
      const result = await this.updateUserInfo({
        ...params,
        userId: app.userInfo.id,
        avatarUrl: imgUrls[0] ? imgUrls[0] : app.userInfo.avatarUrl,
        gender: this.data.userInfo.gender
      })
      app.userInfo = result
      console.log(result)
      console.log(common)
      common.Toast('修改成功',1500,'success')
      setTimeout(()=> {
        wx.navigateBack()
      },1500)
    } catch (err) {
      console.log(err)
      common.Tip(err)
      wx.hideLoading()
    }
  },
  // 进行校验
  validate(params) {
    return new Promise((resolve, reject) => {
      if (!this.WxValidate.checkForm(params)) {
        console.log(this.WxValidate.errorList)
        const error = this.WxValidate.errorList[0].msg
        return reject(error)
      }
      resolve(params)
    })
  },

})