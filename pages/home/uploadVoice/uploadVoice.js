// pages/home/uploadVoice/uploadVoice.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
const authorize = require('../../../assets/tool/authorize.js')
const upload = require('../../../assets/request/upload')
const common = require('../../../assets/tool/common')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    // 控制录音当前显示的图片
    current: 0,
    // 录音四张图
    soundRecordSrcArr: [
      '/images/uploadVoice/soundRecord.png',
      '/images/uploadVoice/soundRecording.png',
      '/images/uploadVoice/play.png',
      '/images/uploadVoice/playing.png'
    ],
    // 录音当前显示图
    soundRecordSrc: '/images/uploadVoice/soundRecord.png',
    // 路音本地路径
    tempFilePath: '',
    // 控制width-none
    // true：不显示左边，false显示左边
    widthNone: true,
    // 控制clip-auto
    // false：遮掉左边部分
    // true：不遮掉
    clipAuto: false,
    // 控制录音圆环
    recordRotate: 0,
    // 控制录音时间
    recordTime: 0,
    // 录音限制时间
    limitTime: 300000,
    // 附近位置,
    index: 0,
    mks: [],
    msgAuthorizationShow: false,
    requestId: [app.InfoId.like, app.InfoId.content, app.InfoId.band]
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
    authorize.authSettingRecord().then(() => {
      this.initialization()
    })
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
    this.innerAudioContext.stop()
    this.recorderManager.stop()
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
  // 初始化
  initialization() {
    // ios,即使是在静音模式下，也能播放声音
    wx.setInnerAudioOption({
      obeyMuteSwitch: false
    })
    this.recorderManager = wx.getRecorderManager()
    this.innerAudioContext = wx.createInnerAudioContext()
    this.recorderManager.onError((err) => {
      console.log(err, '// 录音失败的回调处理');
    });
    this.recorderManager.onStart(() => {
      console.log('// 开始录音')
      this.startRecord()
    })
    this.recorderManager.onStop((res) => {
      clearInterval(this.loop)
      this.setData({
        widthNone: true,
        clipAuto: false,
        recordRotate: 0,
        soundRecordSrc: this.data.soundRecordSrcArr[2],
        current: 2
      })
      const tempFilePath = res.tempFilePath
      this.innerAudioContext.src = tempFilePath
      this.setData({
        tempFilePath
      })
    })

    this.innerAudioContext.onError((res) => {
      console.log(res, '// 播放音频失败的回调')
    })
    this.innerAudioContext.onTimeUpdate(() => {
      console.log('音频播放进度更新事件')
      this.playStart()
    })
    this.innerAudioContext.onEnded(() => {
      console.log('// 音频播放结束')
      this.playEnd()
    })
    this.innerAudioContext.onPause(() => {
      console.log('// 音频播放暂停')
      this.setData({
        soundRecordSrc: this.data.soundRecordSrcArr[2],
        current: 2
      })
    })

  },
  // 录音播放开始
  playStart() {
    let {
      duration,
      currentTime
    } = this.innerAudioContext
    if (duration / 2 <= currentTime && this.data.widthNone === true) {
      console.log('超过一半了')
      this.setData({
        widthNone: false,
        clipAuto: true
      })
    }
    this.setData({
      recordRotate: 360 * currentTime / duration,
    })
  },
  // 录音播放结束
  playEnd() {
    this.setData({
      recordRotate: 0,
      widthNone: true,
      clipAuto: false,
      soundRecordSrc: this.data.soundRecordSrcArr[2],
      current: 2
    })
  },

  // 点击图片调用
  soundRecord() {
    authorize.authSettingRecord().then(() => {
      let current = this.data.current
      switch (current) {
        case 0: {
          wx.showToast({
            title: '开始录音',
            icon: 'success',
            mask: true,
            duration: 2000
          })
          // 开始录音
          const options = {
            duration: this.data.limitTime,
            format: 'mp3'
          }
          setTimeout(() => {
            console.log('// 开始录音')
            this.recorderManager.start(options)

          }, 2000)
          current++
          break
        }
        case 1: {
          this.recorderManager.stop()
          wx.showToast({
            title: '录音结束',
            icon: 'success',
            duration: 2000
          })
          console.log('// 结束录音')
          // current++
          clearInterval(this.loop)
          return
        }
        case 2: {
          // 开始播放录音
          console.log('// 开始播放录音')
          this.innerAudioContext.play()
          current++
          break
        }
        case 3: {
          // this.pauseRing()
          // 暂停播放录音
          console.log('// 暂停播放录音')
          this.innerAudioContext.pause()
          current--
          break
        }
      }
      this.setData({
        soundRecordSrc: this.data.soundRecordSrcArr[current],
        current
      })
    })
  },
  // 重录
  remake() {
    wx.showModal({
      title: '提示',
      content: '是否删除该录音',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
          this.innerAudioContext.stop()
          this.setData({
            soundRecordSrc: this.data.soundRecordSrcArr[0],
            current: 0,
            recordRotate: 0,
            recordTime: 0,
            tempFilePath: '',
            widthNone: true,
            clipAuto: false
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 开始录音
  startRecord() {
    let recordRotate = this.data.recordRotate;
    let limitTime = this.data.limitTime
    let recordTime = this.data.recordTime
    this.loop = setInterval(() => {
      recordTime++;
      if (recordTime >= limitTime / 2000 && this.data.widthNone === true) {
        this.setData({
          widthNone: false,
          clipAuto: true
        })
      }
      this.setData({
        recordRotate: 360000 / limitTime * recordTime,
        recordTime
      })
    }, 1000)
  },
 // 获取定位
 getLocation() {
  authorize.getLocation(data => {
    if (data.errMsg !== 'getLocation:ok') {
      common.Tip('请勿频繁定位，请稍后重试')
      return wx.hideLoading()
    }
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
      if (!tempFilePath || !describe) return reject('要添加录音和描述哦')
      if (mks.length) {
        location = mks[this.data.index].title
      }
      // app.userInfo.avatarUrl ||  app.userInfo.nickName
      return resolve({
        introduce: describe,
        voiceUrl: tempFilePath,
        location,
        // groupName: app.userInfo.groupName,
        mold: 2
      })
    })
  },
  // 上传视频
  uploadVoice(tempImgParh) {
    return new Promise((resolve, reject) => {
      // app.userInfo.id
      let option = {
          userId: app.userInfo.id,
          type: 'voice',
          module: 'groupdynamics'
        },
        conf = {
          loading: false,
          toast: false
        }
      upload.uploadFile(app.Api.uploadImg, tempImgParh, option, conf).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  // 以音频发布
  voiceIssue(data) {
    return new Promise((resolve, reject) => {
      console.log(data)
      app.post(app.Api.voiceIssue, data, {
        loading: false
      }).then(res => resolve(res)).catch(err => {
        wx.hideLoading()
        common.Tip(err)
        reject(err)
      })
    })
  },
  // 提交表单
  async formSubmit(e) {
    console.log('form发生了submit事件，携带的数据为：', e.detail.value)
    let params = e.detail.value
    console.log(params)
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
              success(res) {}
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
    common.showLoading('发布中')
    params.voiceUrl = await this.uploadVoice(params.voiceUrl)
    const result = await this.voiceIssue({
      ...params,
      userId: app.userInfo.id,
      groupId: app.userInfo.groupId,
      // groupName: app.userInfo.groupName,
    })
    common.Toast('已发布')
    this.goHome()
  },
  goHome() {
    app.switchData.refresh = true
    wx.navigateBack()
  },
  deleteLocal() {
    this.setData({
      mks: []
    })
  }
})