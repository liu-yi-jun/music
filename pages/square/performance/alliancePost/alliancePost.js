// pages/square/performance/alliancePost/alliancePost.js
const app = getApp()
const tool = require('../../../../assets/tool/tool.js')
const common = require('../../../../assets/tool/common')
const authorize = require('../../../../assets/tool/authorize.js')
import WxValidate from '../../../../assets/tool/WxValidate'
const upload = require('../../../../assets/request/upload')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    date: '',
    time: '',
    first: true,
    keyBoardHeight: '0px',
    id: '',
    // 录音时长
    duration: 0,
    // 总录音时长
    recordTime: 60,
    // 录音长度
    voiceBar: {
      minWidth: 130,
      maxWidth: 400,
    },
    soundWidth: 0,
    tempImagePaths: [],
    tempRecordPath: '',
    tempVideoPath: '',
    isPlay: false,
    // 控制连接弹窗
    linkDialogShow: false,
    // 链接路径
    linkUrl: '',
    // 标注视频链接类型
    isVid: false,
    startTime: tool.format(Date.now()),
    msgAuthorizationShow: false,
    requestId: [app.InfoId.like, app.InfoId.content, app.InfoId.reply]
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
  // 处理声音条的宽度
  initSoundWidth(duration) {
    const recordTime = this.data.recordTime
    const {
      minWidth,
      maxWidth
    } = this.data.voiceBar
    const changeRange = maxWidth - minWidth
    let soundWidth = duration * changeRange / recordTime + minWidth
    soundWidth >= maxWidth ? soundWidth = maxWidth : soundWidth

    return (soundWidth)
  },
  // 初始化声音条实例
  initSound() {
    // wx.setInnerAudioOption({
    //   obeyMuteSwitch: false
    // })
    this.innerSoundContext = wx.createInnerAudioContext()
    this.innerSoundContext.onPlay(() => {
      console.log('开始播放录音')
    })
    this.innerSoundContext.onTimeUpdate(() => {
      console.log('音频播放进度更新事件')
      let {
        duration,
        currentTime
      } = this.innerSoundContext
      console.log(duration, currentTime)
    })
    this.innerSoundContext.onEnded(() => {
      console.log('// 录音播放结束')
      this.setData({
        isPlay: false
      })
    })
    this.innerSoundContext.onStop(() => {
      console.log('onStop')
      this.setData({
        isPlay: false
      })
    })
    this.innerSoundContext.onPause(() => {
      console.log('onPause')
      this.setData({
        isPlay: false
      })
    })
  },
  playRecord() {
    if (!this.innerSoundContext) {
      this.initSound()
      this.innerSoundContext.src = this.data.tempRecordPath
    }
    if (this.data.isPlay) {
      this.innerSoundContext.pause()
      this.setData({
        isPlay: false
      })
    } else {
      this.innerSoundContext.play()
      this.setData({
        isPlay: true
      })
    }

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
  //验证规则函数
  initValidate() {
    const rules = {
      title: {
        required: true,
        minlength: 6,
        maxlength: 60
      },
      activityLocation: {
        required: true,
      },
      organization: {
        required: true,
      },
      introduce: {
        required: true,
      }
    }
    const messages = {
      title: {
        required: '请填写标题',
        minlength: '小组活动名称不少于6个字符',
        maxlength: '小组活动名称不大于60个字符'
      },
      activityLocation: {
        required: '请填写活动地点',
      },
      organization: {
        required: '请填写活动组织者',
      },
      introduce: {
        required: '请填写演出详情',
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
    this.innerSoundContext && this.innerSoundContext.destroy()
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

  imgSheet() {
    this.chooseImg()
  },
  chooseImg() {
    common.chooseImage(9).then(res => {
      this.setData({
        tempImagePaths: res.tempFilePaths
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
  recordSheet() {
    wx.navigateTo({
      url: '/pages/common/record/record',
    })
    // wx.showActionSheet({
    //   itemList: ['添加网络链接', '在线录音'],
    //   success: res => {
    //     if (res.tapIndex === 1) {
    //       let record = this.selectComponent('#record')
    //       record.startRecord()
    //     } else if (res.tapIndex === 0) {
    //       this.showPopup(1)
    //     }
    //   }
    // })
  },
  recordResult(data) {
    this.setData({
      tempRecordPath: data.tempFilePath,
      duration: data.duration,
      soundWidth: this.initSoundWidth(data.duration)
    })
  },
  handlerGobackClick: app.handlerGobackClick,
  keyBoardChange(height) {
    //键盘高度改变时调用
    // bindkeyboardheightchange="keyBoardChange"安卓不能使用，因为点击空白处没有监听到
    // console.log(e.detail.height, '2222')
    //键盘收起,修改showTextara
    //注意keyBoardChange刚开始时调用了多次，第一次高度为不正确,这时不应该设置showTextara为false
    if (this.data.first) {
      this.setData({
        first: false
      })
    } else {
      let keyBoardHeight = height + 'px'
      this.setData({
        keyBoardHeight,
        id: 'textarea'
      })
    }
  },

  boardheightchange(even) {
    // this.keyBoardChange(even.detail.height)

  },
  // 日期选择器
  bindDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },
  // 进行校验
  validate(params) {
    try {
      return new Promise((resolve, reject) => {
        let {
          tempVideoPath,
          tempImagePaths,
          tempRecordPath,
          duration,
          linkUrl
        } = this.data
        let {
          date,
          time
        } = this.data
        if (!this.WxValidate.checkForm(params)) {
          console.log(this.WxValidate.errorList)
          const error = this.WxValidate.errorList[0].msg
          return reject(error)
        }
        if (date === '活动日期') return reject('请选择活动开始日期')
        if (time === '活动时间') return reject('请选择活动开始时间')
        if (!tempImagePaths.length) return reject('需要添加图片哦')
        // let mold = tempImagePaths.length ? 0 : (tempVideoPath ? 1 : 2)
        let timeStamp = `${this.data.date} ${time}`
        let dates = this.data.date.split('-')
  
        let activityTime = `${dates[0]}年${dates[1]}月${dates[2]}日${time}`
  
        return resolve({
          duration,
          timeStamp,
          userId: app.userInfo.id,
          groupId: app.userInfo.groupId,
          groupName: app.userInfo.groupName,
          introduce: params.introduce,
          pictureUrls: tempImagePaths || [],
          videoUrl: tempVideoPath || linkUrl,
          voiceUrl: tempRecordPath || '',
          // mold,
          activityTime,
          ...params
        })
      })
    } catch (err) {
      console.log(err);
    }
  
  },
  // 提交表单
  async formSubmit(e) {
    let params = e.detail.value
    try {
      params = await this.validate(params)
      common.showLoading()
      authorize.newSubscription(this.data.requestId, {
        cancelText: '继续发布'
      }).then((res) => {
        wx.hideLoading()
        if (res.type === 1) {
          common.Tip('为了更好通知到您，需要您授权相应权限，请接下来按照提示操作').then(res => {
            this.setData({
              msgAuthorizationShow: true
            })
            authorize.infoSubscribe(this.data.requestId).then(res => {
              this.setData({
                msgAuthorizationShow: false
              })
              this.submitTeam(params)
            })
          })
        } else if (res.type === -1) {
          if (!res.result.confirm) {
            this.submitTeam(params)
          } else {
            // 去开启
            wx.openSetting({
              success(res) {
              }
            })
          }
        } else if (res.type === 0) {
          this.submitTeam(params)
        }
      })
    } catch (err) {
      console.log(err)
      common.Tip(err)
      wx.hideLoading()
    }
  },
  async submitTeam(params) {
    let {
      tempVideoPath,
      tempImagePaths,
      tempRecordPath,
      linkUrl,
    } = this.data
    common.showLoading('发布中')
    if (tempRecordPath) params.voiceUrl = await this.uploadVoice(tempRecordPath)
    if (tempVideoPath && !linkUrl) params.videoUrl = await this.uploadVideo(tempVideoPath)
    if (tempImagePaths.length) params.pictureUrls = await this.uploadImg(tempImagePaths)
    const result = await this.postAlliance(params)
    if (result.affectedRows) {
      this.goPerformance()
    }
    common.Toast('已发布')
  },
  goPerformance() {
    app.alliancePostBack = true
    wx.navigateBack()
  },
  // 上传视频
  uploadVideo(tempImgParh) {
    return new Promise((resolve, reject) => {
      // app.userInfo.id
      let option = {
          userId: app.userInfo.id,
          type: 'video',
          module: 'alliance'
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
          module: 'alliance'
        },
        conf = {
          loading: false,
          toast: false
        }
      upload.uploadManyImg(app.Api.uploadImg, tempImgParhs, option, conf).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  // 上传音频
  uploadVoice(tempImgParh) {
    return new Promise((resolve, reject) => {
      // app.userInfo.id
      let option = {
          userId: app.userInfo.id,
          type: 'voice',
          module: 'alliance'
        },
        conf = {
          loading: false,
          toast: false
        }
      upload.uploadFile(app.Api.uploadImg, tempImgParh, option, conf).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  // 添加课程
  postAlliance(data) {
    return new Promise((resolve, reject) => {
      console.log(data)
      app.post(app.Api.postAlliance, data, {
        loading: false
      }).then(res => resolve(res)).catch(err => reject(err))
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
  touchmove() {
    return
  },
})