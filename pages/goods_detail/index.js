// pages/goods_detail/index.js

import {
  request,
  baseUrl
} from '../../request/index';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {}
  },
  //商品对象
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      goods_id
    } = options
    this.getGoodsDetail(goods_id)
  },
  //获取商品详情数据
  async getGoodsDetail(goods_id) {
    const res = await request({
      url: `${baseUrl}goods/detail`,
      data: {
        goods_id
      }
    })
    this.GoodsInfo = res.data.message
    this.setData({
      goodsObj: {
        goods_name: res.data.message.goods_name,
        goods_price: res.data.message.goods_price,
        //iphone部分手机不识别webp格式图片
        //最好找后台修改
        goods_introduce: res.data.message.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: res.data.message.pics
      }
    })
  },
  //点击轮播图，放大预览
  handlePreviewImage(e) {
    const urls = this.GoodsInfo.pics.map(v=>v.pics_mid)
    const current =  e.currentTarget.dataset.url
    wx.previewImage({
      urls,
      current
    })
  },
  //点击加入购物车
  /**
 * 点击加入购物车
 * 1.先绑定点击事件
 * 2.获取缓存中的购物车数据，数组格式
 * 3.先判断当前的商品是否已经存在于购物车
 * 4.已经存在修改商品数据 执行购物车数量++重新把购物车数组填充回缓存中。
 * 5.不存在购物车的数组中，直接给购物车数组添加一个新元素，新元素带上购买数量属性，num,重新把购物车数组填充回缓存中
 * 6.弹出一些用户提示
 * 
 */
  handleCartAdd(){
    //1.获取缓存中的购物车数组，
    let cart = wx.getStorageSync('cart')||[]
    //2.判断一下商品对象是否存在购物车数组中。
    let index = cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index === -1){
      //3不存在第一次添加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true
      cart.push(this.GoodsInfo)
    } else{
      //4已经存在购物车数据执行num++
      cart[index].num++
    }
    //5把购物车重新添加回缓存中
    wx.setStorageSync('cart', cart);
    //6.弹窗提示
    wx.showToast({
      title: '加入成功',
      icon:"success",
      //防止用户手抖，mask遮罩
      mask:true
    })
  }
})