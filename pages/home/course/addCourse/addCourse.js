// pages/home/course/addCourse/addCourse.js
const app = getApp()
const tool = require('../../../../assets/tool/tool.js')
const common = require('../../../../assets/tool/common')
const upload = require('../../../../assets/request/upload')
import WxValidate from '../../../../assets/tool/WxValidate'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    tempVideoPath: "",
    tempPicturePaths: [],
    tempRecordPath: '',
    posterUrl: '',
    avatarUrl: '',
    nickName: '',
    // 控制连接弹窗
    dialogShow: false,
    imgNumber: 4,
    // 录音时长
    duration: 0,
    // 总录音时长
    recordTime: 60,
    // 录音长度
    voiceBar: {
      minWidth: 130,
      maxWidth: 500,
    },
    soundWidth: 500,
    isPlay: false,
    // 弹出的连接是什么类型
    currentType: 0,
    // 链接路径
    linkUrl: '',
    // 标注是否是有输入链接
    isAudioLink: false,
    isVideoLink: false,
    isDatumLink: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initValidate()
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    this.getUserInfo()

  },
  //验证规则函数
  initValidate() {
    const rules = {
      courseName: {
        required: true,
        minlength: 4,
        maxlength: 30
      },
      introduce: {
        required: true,
        // minlength: 4,
        // maxlength: 12
      }

    }
    const messages = {

      courseName: {
        required: '请填写课程名称',
        minlength: '课程名称不少于4个字符',
        maxlength: '课程名称不大于500个字符'
      },
      introduce: {
        required: '请填写课程介绍',
        // minlength: '课程介绍不少于4个字符',
        // maxlength: '课程介绍不大于500个字符'
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.drawCircle()

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.innerSoundContext && this.innerSoundContext.destroy()
  },
  handlerGobackClick: app.handlerGobackClick,
  inputLinkUrl(e) {
    clearTimeout(this.point)
    this.point = setTimeout(() => {
      this.setData({
        linkUrl: e.detail.value
      })
    }, 200)
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
      // 音频
      this.setData({
        tempRecordPath: this.data.linkUrl,
        isAudioLink: true,
        dialogShow: false,
        linkUrl: ''
      })
    } else if (currentType == 2) {
      // 视频
      this.setData({
        tempVideoPath: this.data.linkUrl,
        dialogShow: false,
        isVideoLink: true,
        linkUrl: ''
      })
    } else if (currentType == 3) {
      // 资料
      this.setData({
        tempPicturePaths: this.data.linkUrl ? [this.data.linkUrl] : '',
        dialogShow: false,
        isDatumLink: true,
        linkUrl: ''
      })
    }
  },
  // 显示弹窗
  showPopup(currentType) {
    this.setData({
      currentType,
      dialogShow: true
    })
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
      this.setData({
        isPlay: false
      })
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
  recordResult(e) {
    this.setData({
      duration: e.detail.duration,
      tempRecordPath: e.detail.tempFilePath,
      soundWidth: this.initSoundWidth(e.detail.duration)
    })
  },
  addImg() {
    common.chooseImage(1).then(res => {
      this.setData({
        posterUrl: res.tempFilePaths[0]
      })
    })
  },

  previewImage(e) {
    let src = e.currentTarget.dataset.src
    common.previewImage(this.data.tempPicturePaths, src)
  },
  deleteData(e) {
    let type = e.currentTarget.dataset.type
    if (type == 1) {
      this.setData({
        tempRecordPath: '',
        isAudioLink: false
      })
    } else if (type == 2) {
      this.setData({
        tempVideoPath: '',
        isVideoLink: false
      })
    } else if (type == 3) {
      this.setData({
        tempPicturePaths: [],
        isDatumLink: false
      })
    }
  },

  // 进行校验
  validate(params) {
    let {
      tempVideoPath,
      tempPicturePaths,
      posterUrl,
      duration,
      tempRecordPath
    } = this.data
    let {
      voiceUrl,
      videoUrl,
      pictureUrls,
      courseName,
      introduce
    } = params
    return new Promise((resolve, reject) => {
      if (!posterUrl) return reject('请添加课程封面海报')
      if (!this.WxValidate.checkForm(params)) {
        console.log(this.WxValidate.errorList)
        const error = this.WxValidate.errorList[0].msg
        return reject(error)
      }
      // if (!tempRecordPath && !voiceUrl) return reject('请添加课程音频')
      if (!tempVideoPath && !videoUrl) return reject('请添加课程视频')
      // if (!pictureUrls && !tempPicturePaths.length) return reject('请添加课程资料')

      // app.userInfo.avatarUrl ||  app.userInfo.nickName
      return resolve({
        groupId: app.userInfo.groupId,
        userId: app.userInfo.id,
        groupName: app.userInfo.groupName,
        nickName: app.userInfo.nickName,
        avatarUrl: app.userInfo.avatarUrl,
        posterUrl,
        courseName,
        introduce,
        duration,
        pictureUrls: pictureUrls || '',
        videoUrl: videoUrl || '',
        voiceUrl: voiceUrl || ''
      })
    })
  },
  // 音频菜单
  audioSheet() {
    wx.showActionSheet({
      itemList: ['添加链接', '本地录制'],
      success: res => {
        if (res.tapIndex === 1) {
          let record = this.selectComponent('#record')
          record.startRecord()
        } else if (res.tapIndex === 0) {
          this.showPopup(1)
        }
      }
    })
  },
  // 视频菜单
  videoSheet() {
    wx.showActionSheet({
      itemList: ['添加链接', '从手机选择视频'],
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
  // 图片菜单
  pictureurlSheet() {
    wx.showActionSheet({
      itemList: ['添加链接', '从手机选择图片'],
      success: res => {
        if (res.tapIndex === 1) {
          this.choosePicture()
        } else if (res.tapIndex === 0) {
          this.showPopup(3)
        }
      }
    })
  },
  // 选择视频
  chooseVideo() {
    common.chooseVideo().then(res => {
      this.setData({
        tempVideoPath: res.tempFilePath
      })
    })
  },
  // 选择图片
  choosePicture() {
    let imgNumber = this.data.imgNumber
    common.chooseImage(imgNumber).then(res => {
      imgNumber = imgNumber - res.tempFilePaths.length
      this.setData({
        imgNumber,
        tempPicturePaths: this.data.tempPicturePaths.concat(res.tempFilePaths)
      })
    })
  },
  // 上传视频
  uploadVideo(tempImgParh) {
    return new Promise((resolve, reject) => {
      // app.userInfo.id
      let option = {
          userId: app.userInfo.id,
          type: 'video',
          module: 'groupcourse'
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
          module: 'groupcourse'
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
          module: 'groupcourse'
        },
        conf = {
          loading: false,
          toast: false
        }
      upload.uploadFile(app.Api.uploadImg, tempImgParh, option, conf).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  // 添加课程
  addCourse(data) {
    return new Promise((resolve, reject) => {
      console.log(data)
      app.post(app.Api.addCourse, data, {
        loading: false
      }).then(res => resolve(res)).catch(err => reject(err))
    })
  },

  // 提交表单
  async formSubmit(e) {
    let params = e.detail.value
    console.log('111111111', params)
    let {
      tempVideoPath,
      tempPicturePaths,
      tempRecordPath,
      isAudioLink,
      isVideoLink,
      isDatumLink
    } = this.data
    try {
      params = await this.validate(params)
      console.log('22222222222', params)
      common.showLoading('发布中')
      let posterUrls = await this.uploadImg([params.posterUrl])
      params.posterUrl = posterUrls[0]
      if (tempRecordPath && !isAudioLink) params.voiceUrl = await this.uploadVoice(tempRecordPath)
      if (tempVideoPath && !isVideoLink) params.videoUrl = await this.uploadVideo(tempVideoPath)
      if (tempPicturePaths.length && !isDatumLink) params.pictureUrls = await this.uploadImg(tempPicturePaths)
      console.log('33333333333', params)
      const result = await this.addCourse(params)
      console.log(result)
      if (result.affectedRows) {
        this.goCourse()
      }
      common.Toast('已发布')
    } catch (err) {
      console.log(err)
      common.Tip(err)
      // wx.hideLoading()
    }
  },
  // 跳转到课程
  goCourse() {
    app.addCourseBack = true
    wx.navigateBack()
  },
  touchmove() {
    return
  }
})