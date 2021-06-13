// pages/home/course/addCourse/addCourse.js
const app = getApp()
const tool = require('../../../../assets/tool/tool.js')
const common = require('../../../../assets/tool/common')
const upload = require('../../../../assets/request/upload')
const authorize = require('../../../../assets/tool/authorize')
import WxValidate from '../../../../assets/tool/WxValidate'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    qiniuUrl: app.qiniuUrl,
    excludeHeight: 0,
    tempVideoPath: "",
    tempPicturePaths: [],
    tempRecordPath: '',
    posterUrl: '',
    avatarUrl: '',
    nickName: '',
    open: 0,
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
    // 标注是否是有输入链接
    isVideoLink: false,
    // 控制连接弹窗
    linkDialogShow: false,
    // 链接路径
    linkUrl: '',
    // 标注视频链接类型
    isVid: false,
    msgAuthorizationShow: false,
    requestId: [app.InfoId.like, app.InfoId.content, app.InfoId.band],
    isEdit: false,
    courseName: '',
    courseId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.newForm = {}
    if (options.detail) this.initData(JSON.parse(options.detail), options.isEdit)
    this.initValidate()
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    this.getUserInfo()

  },
  initData(detail, isEdit) {
    this.newForm.introduce = detail.introduce
    this.newForm.open = detail.open
    this.newForm.courseName = detail.courseName
    this.oldForm = {
      introduce: detail.introduce,
      posterUrl: detail.posterUrl,
      courseName: detail.courseName,
      open: detail.open,
      videoUrl: detail.videoUrl,
      courseId: detail.id,
      isEdit,
    }
    if (detail.videoUrl.includes('mp4')) {
      // 是mp4链接
      this.setData({
        tempVideoPath: detail.videoUrl
      })
    } else {
      this.setData({
        linkUrl: detail.videoUrl,
        isVid: true
      })
    }
    this.setData({
      ...this.oldForm,
      tempPicturePaths: JSON.parse(JSON.stringify(detail.pictureUrls))
    })
    this.oldForm.tempPicturePaths = detail.pictureUrls
  },
  //验证规则函数
  initValidate() {
    const rules = {
      courseName: {
        required: true,
        minlength: 6,
        maxlength: 120
      },
      introduce: {
        required: true,
      }

    }
    const messages = {

      courseName: {
        required: '请填写课程名称',
        minlength: '课程名称不少于6个字符',
        maxlength: '课程名称不大于120个字符'
      },
      introduce: {
        required: '请填写课程介绍',
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
    let record = this.selectComponent('#record')
    record.stopRecord()
  },
  handlerGobackClick: app.handlerGobackClick,
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
    soundWidth >= maxWidth ? soundWidth = maxWidth : soundWidth
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
    console.log('111111111', src)
    common.previewImage(this.data.tempPicturePaths, src)
  },
  deleteData(e) {
    let type = e.currentTarget.dataset.type
    if (type == 1) {
      this.setData({
        tempRecordPath: ''
      })
    } else if (type == 2) {
      this.setData({
        tempVideoPath: '',
        linkUrl: ''
      })
    } else if (type == 3) {
      this.setData({
        tempPicturePaths: [],

      })
    }
  },
  deleteImg(e) {
    let index = e.currentTarget.dataset.index
    let tempPicturePaths = this.data.tempPicturePaths
    tempPicturePaths.splice(index, 1)
    this.setData({
      tempPicturePaths
    })
  },
  // 进行校验
  validate(params) {
    let {
      tempVideoPath,
      tempPicturePaths,
      posterUrl,
      duration,
      tempRecordPath,
      linkUrl
    } = this.data
    let {
      voiceUrl,
      courseName,
      introduce,
      open
    } = params
    return new Promise((resolve, reject) => {
      if (!posterUrl) return reject('请添加课程封面海报')
      if (!this.WxValidate.checkForm(params)) {
        console.log(this.WxValidate.errorList)
        const error = this.WxValidate.errorList[0].msg
        return reject(error)
      }

      // if (!tempRecordPath && !voiceUrl) return reject('请添加课程音频')
      if (!tempVideoPath && !linkUrl) return reject('请添加课程视频')
      // if (!pictureUrls && !tempPicturePaths.length) return reject('请添加课程资料')

      // app.userInfo.avatarUrl ||  app.userInfo.nickName
      return resolve({
        groupId: app.userInfo.groupId,
        userId: app.userInfo.id,
        groupName: app.userInfo.groupName,
        posterUrl,
        courseName,
        introduce,
        duration,
        open: Number(open),
        pictureUrls: tempPicturePaths || '',
        videoUrl: tempVideoPath || linkUrl,
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
          this.setData({
            linkDialogShow: true
          })
        }
      }
    })
  },
  // 图片菜单
  pictureurlSheet() {
    this.choosePicture()
  },
  // 选择视频
  chooseVideo() {
    common.chooseVideo().then(res => {
      this.setData({
        tempVideoPath: res.tempFilePath,
        linkUrl: ''
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
  deletePoster() {
    this.setData({
      posterUrl: ''
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
      }).then(res => resolve(res)).catch(err => {
        wx.hideLoading(err)
        common.Tip(err)
        reject(err)
      })
    })
  },
  changeExamine(e) {
    this.newForm.open = e.detail.value
  },
  inputCourseName(e) {
    this.newForm.courseName = e.detail.value
  },
  inputIntroduce(e) {
    this.newForm.introduce = e.detail.value
  },

  // 提交表单
  async formSubmit(e) {
    let params = {
      ...this.newForm
    }
    try {
      params = await this.validate(params)
      if (!this.data.isEdit) {
        // 发布
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
      } else {
        // 编辑
        common.showLoading('保存中')
        let result = await this.saveCourse(params)
        if (result.affectedRows) {
          common.Toast('已保存')
          this.goCourse()
        }
      }
    } catch (err) {
      console.log(err)
      common.Tip(err)
      wx.hideLoading()
    }
  },
  saveCourse(params) {
    return new Promise(async (resolve, reject) => {
      let flag = true
      if (params.pictureUrls.length !== this.oldForm.tempPicturePaths.length) {
        flag = false
      } else {
        params.pictureUrls.forEach((item, index) => {
          console.log(this.oldForm.tempPicturePaths[index], item);
          if (this.oldForm.tempPicturePaths[index] !== item) return flag = false
        })
      }

      console.log(flag);
      if (params.courseName == this.oldForm.courseName && flag && params.introduce == this.oldForm.introduce && params.posterUrl == this.oldForm.posterUrl && params.open == this.oldForm.open && params.videoUrl == this.oldForm.videoUrl) return resolve({
        affectedRows: 1
      })

      if (params.posterUrl !== this.oldForm.posterUrl) params.posterUrl = await this.uploadImg([params.posterUrl])
      if (!flag) {
        params.pictureUrls = await this.uploadImg(params.pictureUrls)
      }

      if (params.videoUrl !== this.oldForm.videoUrl) {
        let {
          linkUrl,
          tempVideoPath
        } = this.data
        if ((tempVideoPath && !linkUrl) || tempVideoPath && tempVideoPath !== this.oldForm.videoUrl) {
          params.videoUrl = await this.uploadVideo(params.videoUrl)
        }
      }
      app.post(app.Api.saveCourse, {
        params: params,
        id: this.data.courseId
      }, {
        loading: false
      }).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  async submitTeam(params) {
    let {
      tempVideoPath,
      tempPicturePaths,
      tempRecordPath,
      linkUrl
    } = this.data
    common.showLoading('发布中')
    let posterUrls = await this.uploadImg([params.posterUrl])
    params.posterUrl = posterUrls[0]
    if (tempRecordPath) params.voiceUrl = await this.uploadVoice(tempRecordPath)
    if (tempVideoPath && !linkUrl) params.videoUrl = await this.uploadVideo(tempVideoPath)
    if (tempPicturePaths.length) params.pictureUrls = await this.uploadImg(tempPicturePaths)
    const result = await this.addCourse(params)
    console.log(result)
    if (result.affectedRows) {
      this.goCourse()
    }
    common.Toast('已发布')
  },
  // 跳转到课程
  goCourse() {
    app.addCourseBack = true
    wx.navigateBack()
  },
  deleteVideo() {
    this.setData({
      tempVideoPath: '',
      linkUrl: ''
    })
  },
  deleteAllImg() {
    this.setData({
      tempPicturePaths: []
    })
  },
  touchmove() {
    return
  }
})