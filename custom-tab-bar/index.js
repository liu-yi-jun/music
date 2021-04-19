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
        name:'小组'
      }, {
        pagePath: "/pages/tool/tool",
        iconPath: "/images/tool.png",
        selectedIconPath: "/images/toolSelect.png",
        name:'工具'
      },
      {
        pagePath: "/pages/square/square",
        iconPath: "/images/square.png",
        selectedIconPath: "/images/squareSelect.png",
        name:'广场'
      },
      {
        pagePath: "/pages/my/my",
        iconPath: "/images/my.png",
        selectedIconPath: "/images/mySelect.png",
        name:'我的'
      }
    ],
    showTabBarRedDot: false
  },
  methods: {

    switchTab(e) {

      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({
        url
      })
      authorize.alwaysSubscription().then(res=> {
        console.log(res);
      })
      // 出现闪烁现象，注册掉
      // this.setData({
      //   selected: data.index
      // })
    }
  },
  lifetimes: {
    ready: function () {
      // 页面被展示
      this.setData({
        transition: 'all .4s'
      })
    },
  },
})