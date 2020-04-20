import { getSetting, chooseAddress, openSetting } from '../../utils/asyncWx'
import regeneratorRuntime, { isGeneratorFunction } from '../../lib/runtime/runtime';
//点击收货地址
/*
1.获取用户的收货地址
  1.绑定点击事件
  2.调用小程序内置api获取用户的收货地址wx.chooseAddress
  2.获取用户对小程序所授予获取地址的权限状态，scope、
    1.假设用户点击获取收货地址的提示框，确定 authSetting scope.address
      scope值 true 直接调用 获取收货地址
    2.假设用户从来没有调用该收货地址api，
      scope值 undefined 直接调用获取收货地址
    3.假设用户点击获取收货地址的提示，取消
      scope值false
      1.诱导用户自己打开授权设置页面(wx.openSetting)当用户重新给予获取地址的权限时
      2.获取收货地址
    4把获取到的收货地址存到本地存储中
2.页面加载完毕要做的事
  0 onShow()
  1.获取本地存储中的地址数据
  2.把数据设置给data中的一个变量
3.onShow
  0.回到商品详情页面，第一次添加商品的时候，手动添加了属性
    1.num = 1
    2.checked = true 
  1.获取缓存中的购物车数组 
  2.把购物车数据填充到data中 
4.全选的实现 数据的展示 
  1.onShow获取缓存中的购物车数组 
  2.根据购物车中商品数据 所有商品都被选中，checked=true全选就被选中 
5.总价格和总数量
  1.都需要商品被选中，我们才拿他来计算
  2.获取到购物车的数组
  3.遍历
  4.判断商品是否被选中
  5.总价格+=商品的单价*商品的数量
  5.总数量+=商品的数量
  6.把计算后的加个和数量设置回data中即可
6.商品的选中功能
  1.绑定change事件
  2.获取到被修改的商品对象
  3.商品对象的选中状态 取反
  4.重新填充回data中和缓存中
  5.重新计算全选，总价格总数量
7.全选和反选
  1.全选复选框绑定事件 change
  2.获取data中的全选变量  
  3.直接取反 allChecked =!allChecked
  4.遍历购物车数组 让里面商品  选中状态allChecked改变而改变
  5.把购物车数组和allChecked重新设置回data 把购物车重新设置回缓存中
8.商品数量的编辑
  1."+","-"按钮，绑定同一个点击事件，区分关键 自定义属性  
    1"+"属性， "+1"
    2 "-"  "-1"
  2.传递被点击的商品id goods_id
  3.获取到data中的购物车数组 来获取需要被修改的商品对象
  4.当购物车的数量等于1同时用户点击 "-"
    弹窗提示询问用户是否要删除
      确定 直接执行删除，
      取消 什么都不做
  4.直接修改商品对象的数量 num
  5.把cart数组 重新设置回 缓存中和data中，this.setCart()
9.点击结算
  1判断有没有收货地址
  2判断用户有没有选购商品
  3经过以上的验证跳转到支付页面
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    //1.获取缓存中的收货地址信息
    const address = wx.getStorageSync('address');
    //1.获取缓存中的购物车数据
    const cart = wx.getStorageSync('cart') || []
    //1.计算全选
    //Array.every()数组方法，会遍历，会接受一个回调函数那么
    //没一个回调函数都返回true，那么every的返回值就是true
    // const allChecked = cart.length ? cart.every(v => v.checked) : false;
    this.setData({
      address
    })
    this.setCart(cart)
  },
  async handleChooseAddress() {
    //1.获取权限状态
    try {
      //1获取权限状态
      const res1 = await getSetting()
      const scopeAddress = res1.authSetting["scope.address"];
      //判断权限状态
      if (scopeAddress === false) {
        //3.诱导用户打开授权页面
        await openSetting()
      }
      //4调用获取收货地址的api
      const address = await chooseAddress()
      //5.存入到缓存中
      wx.setStorageSync('address', address)
    } catch (error) {
      console.log(error);
    }
  },
  handeItemChange(e) {
    //1获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    //2获取购物车数组
    let { cart } = this.data
    //3找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id)
    //4选中状态取反
    cart[index].checked = !cart[index].checked
    //56把购物车数据重新设置回data中和缓存中
    this.setCart(cart)
  },
  //设置购物车状态同时，重新计算，底部工具栏的数据，全选总价格购买的数量
  setCart(cart) {
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price
        totalNum += v.num
      } else {
        allChecked = false
      }
    })
    //判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      allChecked,
      totalNum,
      totalPrice
    })
    wx.setStorageSync('cart', cart)
  },
  handleItemAllCheck() {
    //1.获取data中全选的变量allChecked
    let { cart, allChecked } = this.data
    //2修改值
    allChecked = !allChecked
    //3循环修改cart数组中商品的选中状态
    cart.forEach(v => v.checked = allChecked)
    //4修改后的值填充回data或者缓存中
    this.setCart(cart)
  },
  //商品数量编辑的功能
  handleItemNumEdit(e) {
    //1.获取传递过来的参数值
    const { operation, id } = e.currentTarget.dataset;
    //获取购物车数组
    let { cart } = this.data;
    //找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id)
    //4判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      wx.showModal({
        title: '提示',
        content: '您是否要删除？',
        success: (result) => {
          cart.splice(index, 1)
          this.setCart(cart)
        },
        fail: (res) => { },
      })
    } else {
      //4进行修改数量
      cart[index].num += operation;
      //5.设置回缓存和data中
      this.setCart(cart)

    }
  },
  //点击结算
  handlePay(){
    //1.判断收货地址
    const {address,totalNum } = this.data;
    if(!address.userName){
      wx.showToast({
        title: '您还没有选择收货地址',
      })
      return
    } 
    //判断用户有没有选购商品
    if(totalNum===0){
      wx.showToast({
        title: '您还没有选购商品',
      })
      return;
    }
    //跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    })
  }
})


    // //1.获取权限状态
    // wx.getSetting({
    //   success:(result)=>{
    //     //2.获取权限状态
    //     const scopeAddress = result.authSetting["scope.address"]
    //     if(scopeAddress===true||scopeAddress===undefined){
    //       wx.chooseAddress({
    //         success: (res) => {},
    //       })
    //     }else{
    //       //用户以前拒绝过授权，诱导用户打开授权
    //       wx.openSetting({
    //         success: (res) => {
    //           wx.chooseAddress({
    //             complete: (res) => {},
    //           })
    //         },
    //       })
    //     }
    //   }
    // })