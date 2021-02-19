// components/square/dynamicList/dynamicList.js
const core = require('../../../assets/tool/core')
const common = require('../../../assets/tool/common')
const tool = require('../../../assets/tool/tool')
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dynamics: {
      type: Array,
      value: []
    },
    isInvitation: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    myId: 0,
    list: [{
      name: '分享',
      open_type: 'share',
      functionName: ''
    }, {
      name: '收藏',
      open_type: '',
      functionName: 'handleStore'
    }, {
      name: '投诉',
      open_type: '',
      functionName: 'handleReport'
    }]
  },
  /**
   * 组件的方法列表
   */
  lifetimes: {
    attached: function () {
      if (app.userInfo) {
        this.setData({
          myId: app.userInfo.id
        })
      }

    },
    detached: function () {
      this.innerSoundContext && this.innerSoundContext.destroy()
    }
  },
  pageLifetimes: {
    hide: function () {
      // 页面被隐藏
      this.innerSoundContext && this.innerSoundContext.stop()
    },
  },
  methods: {
    showMenu(e) {
      let index = e.currentTarget.dataset.index
      this.index = index
      let detail = this.data.dynamics[index]
      if (this.getTabBar()) {
        this.tabBarShow = this.getTabBar().data.show
        if (app.userInfo.id === detail.userId) {
          let list = this.data.list
          list[2] = {
            name: '删除',
            open_type: '',
            functionName: 'hadleDelete'
          }
          this.getTabBar().setData({
            show: false
          }, () => this.setData({
            list
          }, () => {
            this.selectComponent('#menu').show();
          }))

        } else {
          this.getTabBar().setData({
            show: false
          }, () => {
            this.selectComponent('#menu').show();
          })
        }
      } else {
        if (app.userInfo.id === detail.userId) {
          list[2] = {
            name: '删除',
            open_type: '',
            functionName: 'hadleDelete'
          }
          this.setData({
            list
          }, () => {
            this.selectComponent('#menu').show();
          })
        } else {
          this.selectComponent('#menu').show();
        }
      }

    },
    cancelMenu() {
      if (this.tabBarShow) {
        this.getTabBar().setData({
          show: true
        })
      }
    },
    handleStore() {
      let detail = this.data.dynamics[this.index]
      core.operateStore(app.Api[detail.tableName + 'Store'], {
        operate: true,
        relation: {
          userId: app.userInfo.id,
          themeId: detail.id
        },
      }).then(res => {
        if (res.modify) {
          common.Toast('收藏成功')
        } else {
          common.Toast('动态已存在')
        }
      })
    },
    handleReport() {
      console.log('投诉');
      common.showLoading('投诉中...')
      setTimeout(() => {
        wx.hideLoading()
        common.Tip('投诉消息已发送至本平台，工作人员将进行审核')
      }, 1200)
    },
    hadleDelete(e) {
      common.Tip('是否删除该动态', '提示', '确认', true).then(res => {
        if (res.confirm) {
          console.log('用户点击确定')
          this.deleteDynamic(e)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      })
    },
    deleteDynamic(e) {
      common.showLoading('删除中')
      let dynamics = this.data.dynamics
      let {
        tableName,
        id
      } = dynamics[this.index]
      app.post(app.Api[tableName + 'Delete'], {
        tableName,
        id
      }, {
        loading: false
      }).then(res => {
        console.log(res)
        if (res.affectedRows) {
          dynamics.splice(this.index, 1)
          this.setData({
            dynamics
          })
          common.Toast('已删除')
        } else {
          dynamics.splice(this.index, 1)
          this.setData({
            dynamics
          })
          common.Toast('该动态已不存在')
        }
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
        let dynamics = this.data.dynamics
        dynamics[this.oldIndex].isPlay = false
        this.setData({
          dynamics
        })
      })
      this.innerSoundContext.onStop(() => {
        console.log('// 录音结束')
        let dynamics = this.data.dynamics
        dynamics[this.oldIndex].isPlay = false
        this.setData({
          dynamics
        })
      })
      this.innerSoundContext.onPause(() => {
        console.log('onPause')
        this.innerSoundContext.stop()
      })
    },
    playRecord(e) {
      console.log(e)
      let {
        voiceurl: voiceUrl,
        index
      } = e.currentTarget.dataset
      let dynamics = this.data.dynamics
      let flag = false
      if (this.oldIndex !== index) {
        flag = true
      } else if (!dynamics[index].isPlay) {
        flag = true
      }
      if (flag) {
        if (this.oldIndex !== undefined) {
          dynamics[this.oldIndex].isPlay = false
        }
        this.oldIndex = index
        dynamics[index].isPlay = true
        this.setData({
          dynamics
        })
        this.innerSoundContext && this.innerSoundContext.destroy()
        this.initSound()
        this.innerSoundContext.src = voiceUrl
        this.innerSoundContext.play()
      }

    },
    toLike(e) {
      console.log('toLiketoLike')
      let index = e.currentTarget.dataset.index
      let dynamics = this.properties.dynamics
      let content = dynamics[index]
      content.isLike = !content.isLike
      content.isLike ? ++content.likes : --content.likes
      // 是引用可以不用赋值
      // dynamics[index] = content
      this.setData({
        dynamics
      }, () => {
        core.operateLike(app.Api[content.tableName + 'Like'], {
          operate: content.isLike,
          relation: {
            userId: app.userInfo.id,
            themeId: content.id
          },
          extra: {
            otherId: content.userId,
            avatarUrl: app.userInfo.avatarUrl,
            nickName: app.userInfo.nickName,
            themeTitle: content.introduce
          }
        })
      })
    },
    goComment(e) {
      let index = e.currentTarget.dataset.index
      this.index = index
      let content = this.properties.dynamics[index]
      let {
        isLike,
        isStore,
        id
      } = content
      let param = {
        id,
        isLike,
        isStore,
        isComment: true,
        table: content.tableName
      }
      param = JSON.stringify(param)
      wx.navigateTo({
        url: `/pages/home/dynamicDetail/dynamicDetail?param=${param}`
      })
    },
    dynamicDetail(e) {
      let notDo = e.mark.notDo
      if (notDo) return;
      let index = e.currentTarget.dataset.index
      this.index = index
      let content = this.properties.dynamics[index]
      let {
        isLike,
        isStore,
        id,
      } = content
      let param = {
        id,
        isLike,
        isStore,
        table: content.tableName
      }
      param = JSON.stringify(param)
      wx.navigateTo({
        url: `/pages/home/dynamicDetail/dynamicDetail?param=${param}`
      })
    },
    goOtherHome(e) {
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/home/otherHome/otherHome?showGroupId=${id}`,
      })
    },
    goPersonal(e) {
      let userId = e.currentTarget.dataset.userid
      wx.navigateTo({
        url: `/pages/my/invitation/invitation?userId=${userId}`,
      })
    },
    completeLike(commenetBarData) {
      console.log(222222222222)
      let dynamics = this.properties.dynamics
      let content = dynamics[this.index]
      content.isLike = commenetBarData.isLike
      content.likes = commenetBarData.likes
      this.setData({
        dynamics
      })
    },
    completeStore(commenetBarData) {
      let dynamics = this.properties.dynamics
      let content = dynamics[this.index]
      content.isStore = commenetBarData.isStore
      content.store = commenetBarData.store
      this.setData({
        dynamics
      })
    },
    completeShare(index) {
      let dynamics = this.properties.dynamics
      dynamics[index].share++
      this.setData({
        dynamics
      })
    },
    previewImage(e) {
      let {
        i,
        j
      } = e.currentTarget.dataset
      let pictureUrls = this.properties.dynamics[i].pictureUrls
      common.previewImage(pictureUrls, pictureUrls[j])
    },
    bindfullscreenchange: function (e) {
      console.log(e.detail.fullScreen)
      let fullScreen = e.detail.fullScreen
      this.triggerEvent('fullscreenchange', {
        fullScreen
      })
    },
    startPlay(e) {
      let index = e.currentTarget.dataset.index
      if (this.videoId && (this.videoId !== index)) {
        let videoContext = wx.createVideoContext(`video${this.videoId}`, this)
        videoContext.pause()
      }
      this.videoId = index
    }
  },


})