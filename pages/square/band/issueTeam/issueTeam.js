// pages/square/band/issueTeam/issueTeam.js
const app = getApp()
const tool = require('../../../../assets/tool/tool.js')
const authorize = require('../../../../assets/tool/authorize.js')
import WxValidate from '../../../../assets/tool/WxValidate'
const common = require('../../../../assets/tool/common')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    showExistPopup: false,
    showRecruitPopup: false,
    instruments: [{
        instrumentsName: '民谣吉他',
        instrumentsUrl: '/issueTeam/folkGuitar.png',
        exist: false,
        recruit: false
      }, {
        instrumentsName: '贝斯',
        instrumentsUrl: '/issueTeam/bass.png',
        exist: false,
        recruit: false
      },
      {
        instrumentsName: '主音吉他',
        instrumentsUrl: '/issueTeam/leadGuitar.png',
        exist: false,
        recruit: false
      },
      {
        instrumentsName: '小提琴',
        instrumentsUrl: '/issueTeam/violin.png',
        exist: false,
        recruit: false
      },
      {
        instrumentsName: '尤克里里',
        instrumentsUrl: '/issueTeam/yukrili.png',
        exist: false,
        recruit: false
      },
      {
        instrumentsName: '萨克斯',
        instrumentsUrl: '/issueTeam/sax.png',
        exist: false,
        recruit: false
      },
      {
        instrumentsName: '小号',
        instrumentsUrl: '/issueTeam/trumpet.png',
        exist: false,
        recruit: false
      },
      {
        instrumentsName: '口琴',
        instrumentsUrl: '/issueTeam/harmonica.png',
        exist: false,
        recruit: false
      },
      {
        instrumentsName: '手鼓',
        instrumentsUrl: '/issueTeam/tambourine.png',
        exist: false,
        recruit: false
      },
      {
        instrumentsName: '主唱',
        instrumentsUrl: '/issueTeam/leadSinger.png',
        exist: false,
        recruit: false
      },
      {
        instrumentsName: '手风琴',
        instrumentsUrl: '/issueTeam/accordion.png',
        exist: false,
        recruit: false
      },
      {
        instrumentsName: '键盘',
        instrumentsUrl: '/issueTeam/keyboard.png',
        exist: false,
        recruit: false
      },
      {
        instrumentsName: '口风琴',
        instrumentsUrl: '/issueTeam/oralOrgan.png',
        exist: false,
        recruit: false
      },
      {
        instrumentsName: '架子鼓',
        instrumentsUrl: '/issueTeam/drumKit.png',
        exist: false,
        recruit: false
      },
      {
        instrumentsName: '沙锤',
        instrumentsUrl: '/issueTeam/sandHammer.png',
        exist: false,
        recruit: false
      }
    ],
    exists: [],
    recruits: [],
    // 附近位置,
    index: 0,
    mks: [],
    nickName: '',
    avatarUrl: '',
    uploadExists: [],
    uploadRecruits: [],
    title: '',
    introduce: '',
    isEdit: false,
    msgAuthorizationShow: false,
    requestId: [app.InfoId.band]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.detail) options.detail = this.initData(JSON.parse(options.detail), options.isEdit)
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    this.initValidate()
    this.setUserInfo()
  },
  initData(detail, isEdit) {
    this.themeId = detail.id
    console.log(detail);
    let instruments = this.data.instruments
    detail.uploadExists.forEach(exist => {
      instruments.forEach(item => {
        if (exist.instrumentsName === item.instrumentsName) {
          item.exist = true
          return
        }
      })
    })
    detail.uploadRecruits.forEach(recruit => {
      instruments.forEach(item => {
        if (recruit.instrumentsName === item.instrumentsName) {
          item.recruit = true
          return
        }
      })
      this.setData({
        instruments
      })
    })
    this.setData({
      title: detail.title,
      introduce: detail.introduce,
      uploadExists: detail.uploadExists,
      uploadRecruits: detail.uploadRecruits,
      recruits: detail.recruitArr,
      exists: detail.existArr,
      isEdit
    })
  },
  //验证规则函数
  initValidate() {
    const rules = {
      title: {
        required: true,
        minlength: 4,
        maxlength: 24
      },
      introduce: {
        required: true
      }
    }
    const messages = {
      title: {
        required: '请填写标题',
        minlength: '标题不少于4个字符',
        maxlength: '标题不大于24个字符'
      },
      introduce: {
        required: '请填写详情'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  setUserInfo() {
    this.setData({
      nickName: app.userInfo.nickName,
      avatarUrl: app.userInfo.avatarUrl
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

  handlerGobackClick: app.handlerGobackClick,
  cancel(e) {
    console.log(e);
    if (e.mark.flag) return
    this.setData({
      showExistPopup: false,
      showRecruitPopup: false,
      instruments: this.instruments
    })
  },
  toggleRecruit() {
    this.instruments = JSON.parse(JSON.stringify(this.data.instruments))
    this.setData({
      showRecruitPopup: !this.data.showRecruitPopup,
      showExistPopup: false
    }, () => {
      if (!this.data.showRecruitPopup) {
        let instruments = this.data.instruments
        let recruits = []
        instruments.forEach(item => {
          if (item.recruit) {
            recruits.push({
              instrumentsName: item.instrumentsName,
              instrumentsUrl: item.instrumentsUrl
            })
          }
        })
        let uploadRecruits = recruits
        recruits = tool.arraySplit(recruits, 4)
        this.setData({
          recruits,
          uploadRecruits
        })
      }
    })
  },
  toggleExist() {
    this.instruments = JSON.parse(JSON.stringify(this.data.instruments))
    this.setData({
      showExistPopup: !this.data.showExistPopup,
      showRecruitPopup: false
    }, () => {
      if (!this.data.showExistPopup) {
        let instruments = this.data.instruments
        let exists = []
        instruments.forEach(item => {
          if (item.exist) {
            exists.push({
              instrumentsName: item.instrumentsName,
              instrumentsUrl: item.instrumentsUrl
            })
          }
        })
        let uploadExists = exists
        exists = tool.arraySplit(exists, 4)
        this.setData({
          exists,
          uploadExists,
        })
      }
    })
  },
  choose(e) {
    let index = e.currentTarget.dataset.index
    let flag = e.currentTarget.dataset.flag
    let instruments = this.data.instruments
    instruments[index][flag] = !instruments[index][flag]
    this.setData({
      instruments
    })
  },
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
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  // 进行校验
  validate(params) {
    let {
      mks,
      recruits,
      exists
    } = this.data
    let location = ''

    let {
      title,
      introduce
    } = params
    return new Promise((resolve, reject) => {
      if (mks.length) {
        location = mks[this.data.index].title
      }
      if (!this.WxValidate.checkForm(params)) {
        console.log(this.WxValidate.errorList)
        const error = this.WxValidate.errorList[0].msg
        return reject(error)
      }
      if (!exists.length) reject('请选择要现有的乐器')
      if (!recruits.length) reject('请选择要招募的乐器')
      return resolve({
        title,
        introduce,
        location,
        userId: app.userInfo.id,
        groupId: app.userInfo.groupId,
        groupName: app.userInfo.groupName,
        existArr: this.data.uploadExists,
        recruitArr: this.data.uploadRecruits
      })
    })
  },

  issueTeam(data) {
    return new Promise((resolve, reject) => {
      app.post(app.Api.issueTeam, data, {
        loading: false
      }).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  saveTeam(data) {
    return new Promise((resolve, reject) => {
      app.post(app.Api.saveTeam, data, {
        loading: false
      }).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  // 提交表单
  async formSubmit(e) {
    console.log('form发生了submit事件，携带的数据为：', e.detail.value)
    let params = e.detail.value
    try {
      params = await this.validate(params)
      console.log(params)
      if (!this.data.isEdit) {
        // 发布
        let subscriptionsSetting = await authorize.isSubscription()
        if (!subscriptionsSetting.itemSettings) {
          this.params = params
          // 未勾选总是
          this.setData({
            msgAuthorizationShow: true
          })
        }else {
          this.submitTeam(params)
        }
        // authorize.isSubscription().then(res => {
        //   if (res.mainSwitch && (!res.itemSettings || !res.itemSettings[app.InfoId.band])) {
        //     common.Tip('接下来将授权"组乐队申请"通知。授权时请勾选“总是保持以上选择,不再询问”，后续有其他用户申请与您组乐队，将会第一时间通知到您', '发布成功').then(res => {
        //       if (res.confirm) {
        //         authorize.alwaysSubscription([app.InfoId.band]).then(res => {
        //           this.goBand()
        //         })
        //       }
        //     })
        //   } else {
        //     common.Tip('确保您已开启相应的通知权限，“组乐队申请”将会第一时间通知到您', '发布成功').then(res => {
        //       if (res.confirm) {
        //         authorize.alwaysSubscription([app.InfoId.band]).then(res => {
        //           this.goBand()
        //         })
        //       }
        //     })
        //   }
        // })
      } else {
        // 编辑
        common.showLoading('保存中')
        params.themeId = this.themeId
        let result = await this.saveTeam(params)
        if (result.affectedRows) {
          common.Toast('已保存')
          this.goBand()
        }
      }

    } catch (err) {
      console.log(err)
      common.Tip(err)
      wx.hideLoading()
    }
  },
  completeMsgAuthorization() {
    this.submitTeam(this.params)
  },
  async submitTeam(params) {
    common.showLoading('发布中')
    let result = await this.issueTeam(params)
    if (result.affectedRows) {
      wx.hideLoading()
      this.goBand()
    }
  },

  goBand() {
    app.bandBack = true
    wx.navigateBack()
  },
})