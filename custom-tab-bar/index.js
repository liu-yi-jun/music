const app = getApp()
const authorize = require('../assets/tool/authorize')
Component({
  data: {
    transition: 'none',
    show: true,
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
        pagePath: "/pages/home/home",
        iconPath: "/images/home.png",
        selectedIconPath: "/images/homeSelect.png",
        name: '小组'
      }, {
        pagePath: "/pages/tool/tool",
        iconPath: "/images/tool.png",
        selectedIconPath: "/images/toolSelect.png",
        name: '工具'
      },
      {
        pagePath: "/pages/square/square",
        iconPath: "/images/square.png",
        selectedIconPath: "/images/squareSelect.png",
        name: '广场'
      },
      {
        pagePath: "/pages/my/my",
        iconPath: "/images/my.png",
        selectedIconPath: "/images/mySelect.png",
        name: '我的'
      }
    ],
    showTabBarRedDot: app.showTabBarRedDot !== undefined ? app.showTabBarRedDot : false
  },
  methods: {
    switchTab(e) {
      if (!app.globalData.codePass) return
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({
        url
      })
      authorize.alwaysSubscription().then(res => {
        console.log(res);
      })
      // 出现闪烁现象，注册掉
      // console.log(app.showTabBarRedDot,11111);


    },
    beforehandSetIsNew(showTabBarRedDot) {
      console.log('设置showTabBarRedDot', showTabBarRedDot);
      this.setData({
        showTabBarRedDot
      })
    },
    setIsNew(time = 100) {
      let systemMsg = wx.getStorageSync('systemMsg')
      return new Promise((resolve, reject) => {
        if (systemMsg) {
          let flag
          systemMsg.forEach(item => {
            if (item.message.jsonDate.isNew) {
              flag = true
              return
            }
          })
          if (app.userInfo) {
            if (!flag) {
              clearTimeout(this.time)
              this.time = setTimeout(() => {
                app.get(app.Api.noticeNumbe, {
                  userId: app.userInfo.id
                }, {
                  loading: false
                }).then(res => {
                  res.noticeNumbe ? (flag = true) : flag
                  if (flag) {
                    app.showTabBarRedDot = true
                    resolve(true)
                    this.setData({
                      showTabBarRedDot: true
                    })
                  } else {
                    app.showTabBarRedDot = false
                    resolve(false)
                    this.setData({
                      showTabBarRedDot: false
                    })

                  }
                })
              }, time)
            } else {
              app.showTabBarRedDot = true
              resolve(true)
              this.setData({
                showTabBarRedDot: true
              })
            }
          }
        }
      })

    }
  },
  lifetimes: {
    ready: function () {
      // 页面被展示
      this.setData({
        transition: 'all .4s'
      })
      if (app.showTabBarRedDot !== undefined) {
        this.setData({
          showTabBarRedDot: app.showTabBarRedDot
        })
      }
    },
  },
})