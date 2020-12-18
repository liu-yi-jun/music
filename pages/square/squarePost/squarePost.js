// pages/square/squarePost/squarePost.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
const authorize = require('../../../assets/tool/authorize.js')
const common = require('../../../assets/tool/common')
const upload = require('../../../assets/request/upload')
import WxValidate from '../../../assets/tool/WxValidate'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    // 附近位置,
    index: 0,
    mks: [],
    tempRecordPath: '',
    tempVideoPath: '',
    tempImagePaths: [],
    // 剩余能够上传多少张图片
    restCount: 9,
    topics: [],
    topicIndex: undefined,
    avatarUrl: '',
    nickName: '',
    // 录音时长
    duration: 0,
    // 总录音时长
    recordTime: 60,
    // 录音长度
    voiceBar: {
      minWidth: 130,
      maxWidth: 400,
    },
    soundWidth: 500,
    isPlay: false,
    // 标注是否输入了链接
    isRecordLink: false,
    isVideoLink: false,
    isImageLink: false,
    linkUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    this.getUserInfo()
    this.getTopic()
    this.initValidate()
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
      introduce: {
        required: true,
      }

    }
    const messages = {
      introduce: {
        required: '说点什么吧...',
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  getTopic() {
    app.get(app.Api.allTopic).then(res => {
      this.setData({
        topics: res
      })
    })
  },
  previewImage(ev) {
    //查看对应的图片
    const id = ev.target.dataset.id;
    common.previewImage([this.data.tempImagePaths[id]])
  },
  toDelete(ev) {
    const id = ev.target.dataset.id;
    // 删除数组中对应index的元素，会改变原数组,修改的是tempFilePaths里面的元素,tempFilePaths本身引用没有改变，页面没有监听到
    // const tempFilePath = this.data.tempFilePaths.splice(index, 1);
    //过滤生成一个新的数组
    const tempImagePaths = this.data.tempImagePaths.filter((item, index) => {
      return index != id
    })
    this.setData({
      restCount: this.data.restCount + 1,
      tempImagePaths
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
  onUnload: function () {
    this.innerSoundContext && this.innerSoundContext.destroy()
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
      this.setData({
        isPlay: false
      })
    })
    this.innerSoundContext.onPause(() => {
      console.log('onPause')
      this.innerSoundContext.stop()
    })
  },
  playRecord() {
    if (this.data.isPlay) return
    let tempRecordPath = this.data.tempRecordPath
    this.innerSoundContext && this.innerSoundContext.destroy()
    this.initSound()
    this.innerSoundContext.src = tempRecordPath
    this.innerSoundContext.play()
    this.setData({
      isPlay: true
    })
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
    return (soundWidth)
  },
  recordResult(e) {
    this.setData({
      tempImagePaths: [],
      tempVideoPath: '',
      tempRecordPath: e.detail.tempFilePath,
      duration: e.detail.duration,
      soundWidth: this.initSoundWidth(e.detail.duration),
      isRecordLink: false
    })
  },
  imgSheet() {
    // wx.showActionSheet({
    //   itemList: ['添加网络链接', '从手机选择图片'],
    //   success: res => {
    //     if (res.tapIndex === 1) {
          this.chooseImg()
    //     } else if (res.tapIndex === 0) {
    //       this.showPopup(3)
    //     }
    //   }
    // })
  },
  videoSheet() {
    wx.showActionSheet({
      itemList: ['添加网络链接', '从手机选择视频'],
      success: res => {
        console.log(res)
        if (res.tapIndex === 1) {
          this.chooseVideo()
        } else if (res.tapIndex === 0) {
          this.showPopup(2)
        }
      }
    })
  },
  recordSheet() {
    wx.showActionSheet({
      itemList: ['添加网络链接', '在线录音'],
      success: res => {
        if (res.tapIndex === 1) {
          this.record()
        } else if (res.tapIndex === 0) {
          this.showPopup(1)
        }
      }
    })
  },
  record() {
    let record = this.selectComponent('#record')
    record.startRecord()
  },
  chooseImg() {
    common.chooseImage(9).then(res => {
      this.setData({
        tempImagePaths: res.tempFilePaths,
        tempRecordPath: '',
        tempVideoPath: '',
        restCount: this.data.restCount - res.tempFilePaths.length,
        isImageLink: false
      })
    })
  },
  chooseVideo() {
    common.chooseVideo().then(res => {
      this.setData({
        tempRecordPath: '',
        tempImagePaths: [],
        tempVideoPath: res.tempFilePath,
        isVideoLink: false
      })
    })
  },
  handlerGobackClick: app.handlerGobackClick,
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
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  // 进行校验
  validate(params) {
    let {
      tempVideoPath,
      tempImagePaths,
      tempRecordPath,
      topics,
      topicIndex,
      mks
    } = this.data
    let location = ''
    let topic = (topicIndex === undefined) ? '' : topics[topicIndex]

    return new Promise((resolve, reject) => {
      if (!this.WxValidate.checkForm(params)) {
        console.log(this.WxValidate.errorList)
        const error = this.WxValidate.errorList[0].msg
        return reject(error)
      }
      if (!tempImagePaths.length && !tempVideoPath && !tempRecordPath) return reject('需要添加图片或者视频或录音哦')
      let mold = tempImagePaths.length ? 0 : (tempVideoPath ? 1 : 2)
      if (mks.length) {
        location = mks[this.data.index].title
      }
      return resolve({
        userId: app.userInfo.id,
        nickName: app.userInfo.nickName,
        avatarUrl: app.userInfo.avatarUrl,
        groupId: app.userInfo.groupId,
        groupName: app.userInfo.groupName,
        introduce: params.introduce,
        pictureUrls: tempImagePaths || [],
        videoUrl: tempVideoPath || '',
        voiceUrl: tempRecordPath || '',
        topicId: topic.id,
        topicName: topic.topicName,
        mold,
        gender: app.userInfo.gender,
        constellation: app.userInfo.constellation,
        age: app.userInfo.age,
        duration: this.data.duration,
        soundWidth: this.data.soundWidth,
        location
      })
    })
  },

  // 提交表单
  async formSubmit(e) {
    let params = e.detail.value
    let {
      tempVideoPath,
      tempImagePaths,
      tempRecordPath,
      isRecordLink,
      isVideoLink,
      isImageLink
    } = this.data
    try {
      params = await this.validate(params)
      common.showLoading('发布中')
      if (tempRecordPath && !isRecordLink) params.voiceUrl = await this.uploadVoice(tempRecordPath)
      if (tempVideoPath && !isVideoLink) params.videoUrl = await this.uploadVideo(tempVideoPath)
      if (tempImagePaths.length && !isImageLink) params.pictureUrls = await this.uploadImg(tempImagePaths)
      const result = await this.squarePost(params)
      console.log(result)
      if (result.affectedRows) {
        this.goSquare()
      }
      common.Toast('已发布')
    } catch (err) {
      console.log(err)
      common.Tip(err)
      // wx.hideLoading()
    }
  },
  goSquare() {
    app.squarePostBack = true
    wx.navigateBack()
  },
  // 上传视频
  uploadVideo(tempImgParh) {
    return new Promise((resolve, reject) => {
      // app.userInfo.id
      let option = {
          userId: app.userInfo.id,
          type: 'video',
          module: 'squaredynamics'
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
          module: 'squaredynamics'
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
          module: 'squaredynamics'
        },
        conf = {
          loading: false,
          toast: false
        }
      upload.uploadFile(app.Api.uploadImg, tempImgParh, option, conf).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  // 添加动态
  squarePost(data) {
    return new Promise((resolve, reject) => {
      console.log(data)
      app.post(app.Api.squarePost, data, {
        loading: false
      }).then(res => resolve(res)).catch(err => reject(err))
    })
  }, 
  // 取消弹窗
  cancelPopup() {
    this.setData({
      dialogShow: false,
      linkUrl: ''
    })
  },
  // 完成输入链接
  complete() {
    let currentType = this.data.currentType
    if (currentType == 1) {
      this.setData({
        tempRecordPath: this.data.linkUrl,
        dialogShow: false,
        linkUrl: '',
        tempImagePaths: '',
        tempVideoPath: '',
        isRecordLink: true
      })
    } else if (currentType == 2) {
      this.setData({
        tempVideoPath: this.data.linkUrl,
        dialogShow: false,
        linkUrl: '',
        tempImagePaths: '',
        tempRecordPath: '',
        isVideoLink: true
      })
    } else if (currentType == 3) {
      this.setData({
        tempImagePaths: this.data.linkUrl ? [this.data.linkUrl] : '',
        dialogShow: false,
        linkUrl: '',
        tempRecordPath: '',
        tempVideoPath: '',
        isImageLink: true
      })
    }
  },
  touchmove() {
    return
  },
  inputLinkUrl(e) {
    clearTimeout(this.point)
    this.point = setTimeout(() => {
      this.setData({
        linkUrl: e.detail.value
      })
    }, 200)
  },
  // 显示弹窗
  showPopup(currentType) {
    this.setData({
      currentType,
      dialogShow: true
    })
  },
  toDelete(ev) {
    const id = ev.target.dataset.id;
    // 删除数组中对应index的元素，会改变原数组,修改的是tempFilePaths里面的元素,tempFilePaths本身引用没有改变，页面没有监听到
    // const tempFilePath = this.data.tempFilePaths.splice(index, 1);
    //过滤生成一个新的数组
    const tempImagePaths = this.data.tempImagePaths.filter((item, index) => {
      return index != id
    })
    this.setData({
      restCount: this.data.restCount + 1,
      tempImagePaths
    })
  },
})