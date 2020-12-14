// pages/home/puchCard/puchCard.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
const common = require('../../../assets/tool/common')
const upload = require('../../../assets/request/upload')
const core = require('../../../assets/tool/core')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    // 表示现在状态
    // 0未开始、1录音中、2等待播放、3播放中
    current: 0,
    // 录音时长，单位s
    recordTime: 60,
    // 每多少毫秒渲染一次
    interval: 100,
    // 录音本地路径
    tempFilePath: '',
    // 存放progress_box的宽高
    progressBox: {},
    // 录音完成后的时长
    duration: 0,
    // 声音条的最长与最短的宽度,单位rpx
    voiceBar: {
      minWidth: 110,
      maxWidth: 330,
    },
    groupDuty: 0,
    pagingGroupCard: {
      pageSize: 5,
      pageIndex: 1
    },

    groupCards: [],
    cardCurrent: 0,
    showGroupId: 0,
    // 没有卡片了
    pagingGroupCardIsNoData: false,
    // 是否是自己的小组
    isMyGroup: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let showGroupId = options.showGroupId
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    this.setData({
      groupDuty: app.userInfo.groupDuty,
      showGroupId: showGroupId,
      isMyGroup: showGroupId == app.userInfo.groupId
    })
    this.getPagingGroupCard(showGroupId)
    this.initialization()
    this.getProgressBoxInfo()
  },
  toLike(e) {
    let {
      index,
      islike
    } = e.currentTarget.dataset
    let current = this.data.current
    let groupCards = this.data.groupCards
    let soundRow = groupCards[current].soundRowArr[index]
    soundRow.isLike = !islike
    soundRow.isLike ? ++soundRow.likes : --soundRow.likes
    this.setData({
      groupCards
    }, () => {
      core.operateMultiple(app.Api.groupCardRecordLike, {
        operate: soundRow.isLike,
        relation: {
          userId: app.userInfo.id,
          themeId: soundRow.id
        }
      }, index)
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
      let groupCards = this.data.groupCards
      groupCards[this.i].soundRowArr[this.j].isPlay = false
      this.setData({
        groupCards
      })
    })
    this.innerSoundContext.onStop(() => {
      let groupCards = this.data.groupCards
      groupCards[this.i].soundRowArr[this.j].isPlay = false
      this.setData({
        groupCards
      })
    })
    this.innerSoundContext.onPause(() => {
      console.log('onPause')
      this.innerSoundContext.stop()
    })
  },
  playSound(e) {
    console.log(e)
    let {
      recordurl,
      i,
      j
    } = e.currentTarget.dataset
    console.log(i, j)
    let groupCards = this.data.groupCards
    let oldI = this.i,
      oldJ = this.j
    console.log(oldI, oldJ)
    let flag = false
    if ((oldI !== i || oldJ !== j)) {
      flag = true
    } else if (!groupCards[i].soundRowArr[j].isPlay) {
      flag = true
    }
    if (flag) {
      this.i = i
      this.j = j
      if (oldI !== undefined) {
        groupCards[oldI].soundRowArr[oldJ].isPlay = false
      }
      groupCards[i].soundRowArr[j].isPlay = true;
      this.setData({
        groupCards
      })
      this.innerSoundContext && this.innerSoundContext.destroy()
      this.initSound()
      this.innerSoundContext.src = recordurl
      this.innerSoundContext.play()
    }

  },
  // 获取分页打卡信息
  getPagingGroupCard(showGroupId) {
    let pagingGroupCard = this.data.pagingGroupCard
    app.get(app.Api.getPagingGroupCard, {
      pageSize: pagingGroupCard.pageSize,
      pageIndex: pagingGroupCard.pageIndex,
      groupId: showGroupId
    }).then(res => {
      if (res.length < pagingGroupCard.pageSize) {
        this.setData({
          pagingGroupCardIsNoData: true
        })
      }
      res.forEach((item, index) => {
        item.pageSize = 10
        item.pageIndex = 1
        item.soundRowArr = []
        item.pagingGroupCardRecordIsNoData = false
        item.first = true
        if (item.datumUrls.length) {
          item.flag = 'practice'
        } else {
          item.flag = 'demonstration'
        }
      })
      pagingGroupCard.pageIndex = pagingGroupCard.pageIndex + 1
      this.setData({
        groupCards: this.data.groupCards.concat(res),
        pagingGroupCard
      }, () => {
        if (this.data.cardCurrent == 0 && res.length) {
          this.getPagingGroupCardRecord(this.data.cardCurrent)
        }
        if (!this.data.groupCards.length) {
          if (!this.data.isMyGroup || this.data.groupDuty == -1) {
            return common.Tip('小组管理员暂无发布打卡')
          }
        }
      })
    }).catch(err => {
      console.log(err)
      common.Toast(err)
    })
  },
  // 获取分页打卡信息的录音
  getPagingGroupCardRecord(cardCurrent) {
    let groupCards = this.data.groupCards
    let groupCard = groupCards[cardCurrent]
    app.get(app.Api.getPagingGroupCardRecord, {
      pageSize: groupCard.pageSize,
      pageIndex: groupCard.pageIndex,
      groupcardId: groupCard.id,
      userId: app.userInfo.id
    }).then(res => {
      if (res.length < groupCard.pageSize) {
        groupCard.pagingGroupCardRecordIsNoData = true
      }
      groupCard.pageIndex = groupCard.pageIndex + 1
      let soundRowArr = this.initSoundWidth(res)
      groupCard.soundRowArr = groupCard.soundRowArr.concat(soundRowArr)
      groupCards[cardCurrent] = groupCard
      this.setData({
        groupCards
      })
    }).catch(err => {
      console.log(err)
      common.Toast(err)
    })
  },
  // 处理声音条的宽度
  initSoundWidth(soundRowArr) {
    const recordTime = this.data.recordTime
    const {
      minWidth,
      maxWidth
    } = this.data.voiceBar
    const changeRange = maxWidth - minWidth
    soundRowArr.forEach((item, index) => {
      item.width = item.duration * changeRange / recordTime + minWidth
    })
    return (soundRowArr)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.drawProgressbg()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.issuePuchCardBack) {
      this.setData({
        groupCards: [],
        cardCurrent: 0,
        pagingGroupCard: {
          pageSize: 5,
          pageIndex: 1
        }
      }, () => {
        this.getPagingGroupCard(this.data.showGroupId)
      })
      app.issuePuchCardBack = false
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.innerAudioContext.destroy()
    this.recorderManager.stop()
    this.innerSoundContext && this.innerSoundContext.destroy()
  },
  onHide() {
    this.innerSoundContext && this.innerSoundContext.stop()
  },
  handlerGobackClick: app.handlerGobackClick,
  // 预览图片
  previewImage(e) {
    console.log(e)
    let url = e.target.dataset.preview
    common.previewImage(url)
  },
  switch (e) {
    let flag = e.target.dataset.flag
    let index = e.target.dataset.index
    let groupCards = this.data.groupCards
    console.log(e)
    if (groupCards[index].flag === flag) return
    groupCards[index].flag = flag
    this.setData({
      groupCards
    })
  },
  getProgressBoxInfo() {
    wx.createSelectorQuery().select('#progress_box').boundingClientRect(rect => {
      if (rect) {
        this.setData({
          progressBox: {
            width: rect.width,
            height: rect.height
          }
        })
      }
    }).exec()
  },
  // 初始化录音，与播放实例
  initialization() {
    // ios,即使是在静音模式下，也能播放声音
    // wx.setInnerAudioOption({
    //   obeyMuteSwitch: false
    // })
    this.recorderManager = wx.getRecorderManager()
    this.innerAudioContext = wx.createInnerAudioContext()
    this.recorderManager.onError((err) => {
      console.log(err, '// 录音失败的回调处理');
    });
    this.recorderManager.onStart(() => {
      console.log('// 录音开始')
      // 录音计数
      this.recordingCount(this.data.recordTime)
    })
    this.recorderManager.onStop((res) => {
      console.log('// 录音结束')
      wx.showToast({
        title: '录音结束',
        icon: 'success',
        duration: 2000
      })
      const tempFilePath = res.tempFilePath
      this.innerAudioContext.src = tempFilePath
      this.setData({
        tempFilePath,
        duration: Math.floor(res.duration / 1000)
      })
    })

    this.innerAudioContext.onPlay(() => {
      console.log('开始播放录音')
    })
    this.innerAudioContext.onTimeUpdate(() => {
      console.log('音频播放进度更新事件')
      // 播放计数
      this.playCount()
    })
    this.innerAudioContext.onEnded(() => {
      this.drawCircle(0)
      this.setData({
        current: 2
      })
      console.log('// 录音播放结束')
    })
    this.innerAudioContext.onPause(() => {
      console.log('// 音频播放暂停')
      if (this.data.current === 3) {
        this.setData({
          current: 2
        })
      }
    })
  },
  // 开始录音
  startRecord() {
    let groupDuty = this.data.groupDuty
    this.innerSoundContext && this.innerSoundContext.stop()
    if (!this.data.groupCards.length) {
      if (groupDuty === 0 || groupDuty == 1) {
        return common.Tip('需要先发布打卡练习哦')
      } else {
        return common.Tip('暂时还没有打卡信息,请联系管理员或组长发布打卡吧')
      }
    }
    const options = {
      duration: this.data.recordTime * 1000,
      format: 'mp3'
    }
    this.setData({
      current: 1
    })
    wx.showToast({
      title: '开始录音',
      icon: 'success',
      mask: true,
      duration: 2000
    })
    setTimeout(() => {
      this.recorderManager.start(options)
    }, 2000)

  },
  // 结束录音
  endRecord() {
    this.drawCircle(0)
    clearInterval(this.loop);
    this.recorderManager.stop()
    this.setData({
      current: 2
    })
  },
  // 播放录音
  startPlay() {
    this.innerAudioContext.play()
    this.setData({
      current: 3
    })
  },
  // 删除录音
  deleteSound() {
    wx.showModal({
      title: '提示',
      content: '是否删除该录音',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
          this.innerAudioContext.stop()
          this.drawCircle(0)
          this.setData({
            current: 0,
            tempFilePath: '',
            duration: 0
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 暂停播放录音
  pausePlay() {
    this.innerAudioContext.pause()
    this.setData({
      current: 2
    })
  },
  issuePuchCard() {
    wx.navigateTo({
      url: '/pages/home/puchCard/issuePuchCard/issuePuchCard',
    })
  },
  drawProgressbg: function () {
    let {
      width,
      height
    } = this.data.progressBox
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('canvasProgressbg', this)
    if (!ctx) return
    ctx.setLineWidth(2); // 设置圆环的宽度
    ctx.setStrokeStyle('#757175'); // 设置圆环的颜色
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath(); //开始一个新的路径
    ctx.arc(width / 2, height / 2, height / 2 - 1, 0.8 * Math.PI, 2.2 * Math.PI, false);
    //设置一个原点(36,36)，半径为35的圆的路径到当前路径
    ctx.stroke(); //对当前路径进行描边
    ctx.draw();
  },
  drawCircle: function (step) {
    let {
      width,
      height
    } = this.data.progressBox
    var ctx = wx.createCanvasContext('canvasProgress', this);
    ctx.setLineWidth(2);
    ctx.setStrokeStyle('#fff');
    ctx.setLineCap('round')
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, height / 2 - 1, 0.8 * Math.PI, (step + 0.8) * Math.PI, false);
    ctx.stroke();
    ctx.draw()
  },
  recordingCount: function (totalTime) {
    let count = 0
    const interval = this.data.interval
    const total = totalTime * 1000 / interval
    console.log(totalTime, interval, total)
    this.loop = setInterval(() => {
      console.log(count, 'count')
      if (count < total) {
        this.drawCircle(count * (1.4 / total))
        count++;
      } else {
        clearInterval(this.loop);
        this.drawCircle(0)
        this.recorderManager.stop()
        this.setData({
          current: 2
        })
      }
    }, interval)
  },
  playCount() {
    let {
      duration,
      currentTime
    } = this.innerAudioContext
    console.log(duration, currentTime)
    this.drawCircle(currentTime * (1.4 / duration))
  },
  // 切换卡
  changeCard(e) {
    let current = e.detail.current
    let groupCards = this.data.groupCards
    if (groupCards[current].first && current != 0) {
      this.getPagingGroupCardRecord(current)
    }
    if (current == groupCards.length - 1 && !this.data.pagingGroupCardIsNoData) {
      this.getPagingGroupCard(this.data.showGroupId)
    }
    groupCards[current].first = false
    this.setData({
      groupCards: this.data.groupCards,
      cardCurrent: e.detail.current
    })
  },
  // 发送录音
  async sendGroupCardRecord() {
    try {
      common.showLoading('发送中')
      let recordUrl = await this.uploadGroupCardRecord(this.data.tempFilePath)
      let result = await this.issueGroupCardRecord(recordUrl)
      await this.setSoundRowArr(result[0])

      
      common.Toast('已发送')
      this.drawCircle(0)
      this.setData({
        current: 0,
        tempFilePath: '',
        duration: 0
      })
    } catch (err) {
      console.log(err)
      common.Toast(err)
    }
  },
  setSoundRowArr(soundRow) {
    return new Promise((resolve, reject) => {
      let groupCards = this.data.groupCards
      let soundRowArr = groupCards[this.data.cardCurrent].soundRowArr
      let soundRows = this.initSoundWidth([soundRow])
      if (soundRowArr.length >= 4) {
        // 插入到第三下标
        soundRowArr.splice(3, 0, soundRows[0])
      } else {
        // 插入到最后
        soundRowArr.push(soundRows[0])
      }
      resolve()
      this.setData({
        groupCards
      })
    })
  },
  // 上传录音
  uploadGroupCardRecord(tempImgParh) {
    return new Promise((resolve, reject) => {
      let option = {
          userId: app.userInfo.id,
          type: 'voice',
          module: 'groupcardrecord'
        },
        conf = {
          loading: false,
          toast: false
        }
      upload.uploadFile(app.Api.uploadImg, tempImgParh, option, conf).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  // 发布录音
  issueGroupCardRecord(recordUrl) {
    return new Promise((resolve, reject) => {
      let {
        groupCards,
        cardCurrent,
        duration
      } = this.data
      let {
        id,
        avatarUrl
      } = app.userInfo
      app.post(app.Api.issueGroupCardRecord, {
        userid: id,
        groupcardId: groupCards[cardCurrent].id,
        recordUrl,
        avatarUrl,
        duration
      }).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  scrolltolower() {
    let cardCurrent = this.data.cardCurrent
    if (!this.data.groupCards[cardCurrent].pagingGroupCardRecordIsNoData) {
      this.getPagingGroupCardRecord(cardCurrent)
    }
  },
  goPersonal(e) {
    let userId = e.currentTarget.dataset.userid
    wx.navigateTo({
      url: `/pages/my/invitation/invitation?userId=${userId}`,
    })
  },
})