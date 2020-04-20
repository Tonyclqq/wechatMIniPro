import { getSetting, chooseAddress, openSetting } from '../../utils/asyncWx'
import regeneratorRuntime, { isGeneratorFunction } from '../../lib/runtime/runtime';
/**
 * 1页面加载的时候
 *  1从缓存中获取购物车数据渲染到页面中
 *    这些数据checked=true的才渲染
 * 2.微信支付
 *  1.那些人哪些账号可以实现微信支付
 *    1.企业账号
 *    2.企业账号的小程序后台中，必须给开发者添加上白名单
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    //1.获取缓存中的收货地址信息
    const address = wx.getStorageSync('address');
    //1.获取缓存中的购物车数据
    let cart = wx.getStorageSync('cart') || []
    //过滤后的购物车数组
    cart = cart.filter(v=>v.checked)
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
        totalPrice += v.num * v.goods_price
        totalNum += v.num
    })
   
    this.setData({
      cart,
      totalNum,
      totalPrice,
      address
    })
  },
  getPhoneNumber(e){
    console.log(e);
    
  }
})
