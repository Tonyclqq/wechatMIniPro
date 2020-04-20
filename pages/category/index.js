// pages/category/index.js
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
    //左侧菜单数据
    leftMenuList:[],
    //右侧商品数据
    rightContent:[],
    //被电击的左侧菜单
    currentIndex:0,
    //
    scrollTop:0
  },
  //接口返回数据
  Cates:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*1先判断一下本地存储中有没有旧数据
      {time:Date.now(),data:[...]}
      2没有就直接发送新请求
      3有旧数据，同时旧数据没过期 */
    //1.获取本地存储数据
    const Cates= wx.getStorageSync('cates');
    if(!Cates){
      //不存在发送请求获取数据
      this.getCategories()
    }else{
      //有旧的数据,暂时定义过期时间
      if(Date.now()-Cates.time>1000*60*5){
        this.getCategories()
      }else{
        this.Cates = Cates.data;
        let  leftMenuList = this.Cates.map(v=>v.cat_name) 
        let  rightContent = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  async getCategories(){
    const result = await request({url:`${baseUrl}categories`})
    this.Cates = result.data.message;
    //把接口数据存入到本地存储中
    wx.setStorageSync('Cates', {
      time:Date.now(),
      data:this.Cates
    })
    //构造左侧菜单数据
    let  leftMenuList = this.Cates.map(v=>v.cat_name) 
    //构造右侧商品数据
    let  rightContent = this.Cates[0].children
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  handleItemTap(e){
    /*1/获取被点击的标题身上的索引
      2给data中的currentIndex赋值就可以了
      3根据不同的索引渲染 */
    
    const {index} = e.currentTarget.dataset;
    let  rightContent = this.Cates[index].children
        this.setData({
          currentIndex:index,
          rightContent,
          scrollTop:0
        })
  }
})