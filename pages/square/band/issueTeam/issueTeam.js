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
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    showExistPopup: false,
    showRecruitPopup: false,
    instruments: [{
        instrumentsName: '民谣吉他',
        instrumentsUrl: 'http://cdn.eigene.cn/issueTeam/folkGuitar.png',
        exist: false,
        recruit: false
      }, {
        instrumentsName: '贝斯',
        instrumentsUrl: 'http://cdn.eigene.cn/issueTeam/bass.png',
        exist: false,
        recruit: false
      },
      {
        instrumentsName: '主音吉他',
        instrumentsUrl: 'http://cdn.eigene.cn/issueTeam/leadGuitar.png',
        exist: false,
        recruit: false
      },
      {
        instrumentsName: '小提琴',
        instrumentsUrl: 'http://cdn.eigene.cn/issueTeam/violin.png',
        exist: false,
        recruit: false
      },
      {
        instrumentsName: '尤克里里',
        instrumentsUrl: 'http://cdn.eigene.cn/issueTeam/yukrili.png',
        exist: false,
        recruit: false
      },
      {
        instrumentsName: '萨克斯',
        instrumentsUrl: 'http://cdn.eigene.cn/issueTeam/sax.png',
        exist: false,
        recruit: false
      },
      {
        instrumentsName: '小号',
        instrumentsUrl: 'http://cdn.eigene.cn/issueTeam/trumpet.png',
        exist: false,
        recruit: false
      },
      {
        instrumentsName: '口琴',
        instrumentsUrl: 'http://cdn.eigene.cn/issueTeam/harmonica.png',
        exist: false,
        recruit: false
      },
      {
        instrumentsName: '手鼓',
        instrumentsUrl: 'http://cdn.eigene.cn/issueTeam/tambourine.png',
        exist: false,
        recruit: false
      },
      {
        instrumentsName: '主唱',
        instrumentsUrl: 'http://cdn.eigene.cn/issueTeam/leadSinger.png',
        exist: false,
        recruit: false
      },
      {
        instrumentsName: '手风琴',
        instrumentsUrl: 'http://cdn.eigene.cn/issueTeam/accordion.png',
        exist: false,
        recruit: false
      },
      {
        instrumentsName: '键盘',
        instrumentsUrl: 'http://cdn.eigene.cn/issueTeam/keyboard.png',
        exist: false,
        recruit: false
      },
      {
        instrumentsName: '口风琴',
        instrumentsUrl: 'http://cdn.eigene.cn/issueTeam/oralOrgan.png',
        exist: false,
        recruit: false
      },
      {
        instrumentsName: '架子鼓',
        instrumentsUrl: 'http://cdn.eigene.cn/issueTeam/drumKit.png',
        exist: false,
        recruit: false
      },
      {
        instrumentsName: '沙锤',
        instrumentsUrl: 'http://cdn.eigene.cn/issueTeam/sandHammer.png',
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
    uploadRecruits: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    this.initValidate()
    this.setUserInfo()

  },
  //验证规则函数
  initValidate() {
    const rules = {
      // title: {
      //   required: true,
      //   minlength: 4,
      //   maxlength: 12
      // },
      introduce: {
        required: true
      }
    }
    const messages = {
      // title: {
      //   required: '请填写标题',
      //   minlength: '标题不少于4个字符',
      //   maxlength: '标题不大于12个字符'
      // },
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
  toggleRecruit() {
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
    this.setData({
      showExistPopup: !this.data.showExistPopup,
      showRecruitPopup: false
    }, () => {
      if (!this.data.showExistPopup) {
        let instruments = this.data.instruments
        let exists = [],
          recruits = []
        instruments.forEach(item => {
          if (item.exist) {
            exists.push({
              instrumentsName: item.instrumentsName,
              instrumentsUrl: item.instrumentsUrl
            })
          }
        })
        instruments.forEach(item => {
          if (item.recruit) {
            recruits.push({
              instrumentsName: item.instrumentsName,
              instrumentsUrl: item.instrumentsUrl
            })
          }
        })
        let uploadExists = exists
        let uploadRecruits = recruits
        console.log('recruits', recruits);
        exists = tool.arraySplit(exists, 4)
        recruits = tool.arraySplit(recruits, 4)
        this.setData({
          exists,
          recruits,
          uploadExists,
          uploadRecruits
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
        avatarUrl: app.userInfo.avatarUrl,
        nickName: app.userInfo.nickName,
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
  // 提交表单
  async formSubmit(e) {
    console.log('form发生了submit事件，携带的数据为：', e.detail.value)
    let params = e.detail.value
    try {
      params = await this.validate(params)
      console.log(params)
      common.showLoading('发布中')
      let result = await this.issueTeam(params)
      if (result.affectedRows) {
        common.Toast('已发布')
        this.goBand()
      }

    } catch (err) {
      console.log(err)
      common.Tip(err)
      // wx.hideLoading()
    }
  },
  goBand() {
    app.bandBack = true
    wx.navigateBack()
  },
})