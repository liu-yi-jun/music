Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: {
      type: String,
      value: 'ILoveEwei'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    marqueePace: 1,
    marqueeDistance: 10,
    size: 12,
    orientation: 'left',
    interval: 20,
    first:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _scrolling: function () {
      var _this = this;
      console.log(-_this.data.marqueeDistance < _this.data.length)
      this.timer = setInterval(() => {
        if (-_this.data.marqueeDistance < _this.data.length) {
          _this.setData({
            marqueeDistance: _this.data.marqueeDistance - _this.data.marqueePace
          })
        } else {
          clearInterval(this.timer);
          _this.setData({
            marqueeDistance: _this.data.windowWidth
          });
          _this._scrolling();
        }
      }, _this.data.interval);
    },
    startScroll(windowWidth) {
      let _this = this
      if(this.data.first === true){
        _this.setData({
          length: _this.data.text.length * _this.data.size, //文字长度
          marqueeDistance: windowWidth,//left
          windowWidth: windowWidth,//滚动的窗口长度,
          first:false
        });
      }
      _this._scrolling();
    },
    pauseScroll() {
      clearInterval(this.timer);
    }
  },


})