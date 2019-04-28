
项目信息
============================
* 项目:	茶叶小程序
* 版本:	2.0.0
* 更新:	2018年10月18日10:34:44
* 测试域:	123.207.83.88:8069

返回格式
----------------------------
```
{
	"code":"0",//错误代码（成功为0）(错误0)（失败其他）
	"msg": //错误提示
	"data":[{},{},{},]//json数据
}
```

登录
----------------------------
* 接口:	/shop/user/login
* 方法:	get
* 参数:	code, shop_id

注册
----------------------------
* 接口:	/shop/user/register
* 方法:	get
* 参数:	code, encrypted_data, iv, shop_id,
* 说明:	全部必填
* 更新:	新增:shop_id

商品分类
----------------------------
* 接口:	/shop/goods/category/extend
* 方法:	get
* 参数:	shop_id
* 说明:	必填:shop_id
* 更新:	新增shop_id

商品列表
----------------------------
* 接口:	/shop/goods/list
* 方法:	get
* 参数:	shop_id, page, num, category_id, category_years_id, category_brand_id,
* 说明:	必填:shop_id
* 更新:	新增:shop_id

商品
----------------------------
* 接口:	/shop/goods/list
* 方法:	get
* 参数:	shop_id, page, num, category_id, category_years_id, category_brand_id,
* 说明:	必填:shop_id
* 更新:	新增:shop_id

新增地址
----------------------------
* 接口:	/shop/address/add
* 方法:	post
* 参数:	linkman="", phone="",  address="", postcode=0, is_default=False, 
		province_id, city_id, district_id, token,
* 更新:	新增:shop_id

地址列表
----------------------------
* 接口:	/shop/address/list
* 方法:	get
* 参数:	shop_id
* 说明:	必填:shop_id
* 更新:	新增:shop_id

删除地址
----------------------------
* 接口:	/user/address/delete
* 方法:	get
* 参数:	shop_id, token, address_id,
* 说明:	全部必填
* 更新:	新增:shop_id

创建订单
----------------------------
* 接口:	/shop/order/create_extra
* 方法:	post
* 参数:	address地址, province_id省份id, city_id城市id, district_id区域id,
		remark注释, linkman联系人, phone电话,  postcode邮政编码,
		goods_json_str=[{
			goods_id,
			amount,
			transport_type,
			property_child_ids=property_id:property_child_id,
		}],
* 说明:	postcode选填，其他必填
* 更新:	新增:shop_id,废除:resUsersID,其他不变

订单金额计算
----------------------------
* 接口:	/order/count_extra
* 方法:	get
* 参数:	同创建订单
* 说明:	同创建订单
* 更新:	同创建订单

订单列表
----------------------------
* 接口:	/shop/order/list_extra
* 方法:	get
* 参数:	shop_id, token, status, page=0, num=20, 
* 说明:	必填:shop_id, token,
* 更新:	新增:shop_id,废除:resUsersID,其他不变

支付
----------------------------
* 接口:	/shop/pay
* 方法:	post
* 参数:	token, order_id, money,
* 返回:	timeStamp, nonceStr, prepayId, sign
* 说明:	全部必填
* 更新:	

支付完成，微信返回支付信息
----------------------------
* 接口:	/shop/pay/notify
* 方法:	post
* 参数:	
* 返回:	
* 说明:	
* 更新:	

购物车列表
----------------------------
* 接口:	/shop/cart/list
* 方法:	get
* 参数:	shop_id, token, status, page=0, num=20, 
* 说明:	必填:shop_id, token,
* 更新:	新增:shop_id,废除:resUsersID,其他不变

购物车创建
----------------------------
* 接口:	/shop/cart/create
* 方法:	get
* 参数:	goods_id, shop_id, number_goods, token, 
* 说明:	必填:shop_id, token,
* 更新:	

购物车删除
----------------------------
* 接口:	/shop/cart/create
* 方法:	get
* 参数:	cart_id, token, 
* 说明:	必填:shop_id, token,
* 更新:	

轮播图列表
----------------------------
* 接口:	/shop/banner/list
* 方法:	get
* 参数:	shop_id, page=0, num=20, 
* 说明:	必填:shop_id, token,
* 更新:	

地址列表
----------------------------
* 接口: /shop/address/list
* 方法: get
* 参数: shop_id
* 说明: 必填:shop_id
* 更新: 新增:shop_id


