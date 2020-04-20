//引入请求方法
import {
  request,
  baseUrl
} from '../../request/index'
Page({
  data: {
    //swiper
    swiperList: [],
    //导航数组
    cateList: [],
    //楼层数据
    floorData: []
  },
  onLoad: function (options) {
    //发送异步去请求
    this.getSwiperList();
    this.getcateList();
    this.getfloorData();
  },
  getSwiperList() {
    request({
        url: `${baseUrl}home/swiperdata`
      })
      .then(result => {
        if (result.data.meta.status === 200) {
          this.setData({
            swiperList: result.data.message
          })
        } else {
          wx.showToast({
            title: '轮播图数据获取失败',
          })
        }
      })
  },
  getcateList() {
    request({
        url: `${baseUrl}home/catitems`
      })
      .then(result => {
        if (result.data.meta.status === 200) {
          this.setData({
            cateList: result.data.message
          })
        } else {
          wx.showToast({
            title: '轮播图数据获取失败',
          })
        }
      })
  },
  //home/floordata
  getfloorData() {
    request({
        url: `${baseUrl}home/floordata`
      })
      .then(result => {
        if (result.data.meta.status === 200) {
          this.setData({
            floorData: result.data.message
          })
        } else {
          wx.showToast({
            title: '轮播图数据获取失败',
          })
        }
      })
  }
})