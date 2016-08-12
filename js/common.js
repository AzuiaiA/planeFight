/*
	获取从min到max之间的随机数
		min:最小值
		max:最大值
 */
function randomNumber(min,max){
	// 得到一个范围内的随机数
	return parseInt(Math.random()*(max-min + 1)) + min;
}


/*
	获取元素节点（删除非元素节点）
	// 过滤文本节点
 */
function filterNode(nodeList){
	var element = [];
	for(var i=0;i<nodeList.length;i++){
		if(nodeList[i].nodeType == 1){
			element.push(nodeList[i]);
		}
	}
	return element;
}

// 获取下一个元素节点
function getNextElement(node){
	var nextElement = node.nextSibling;
	while(nextElement.nodeType != 1){
		nextElement = nextElement.nextSibling;
	}
	return nextElement;
}

// 获取前一个元素节点
function getPrevElement(node){
	var prevElement = node.previousSibling;
	while(prevElement.nodeType != 1){
		prevElement = prevElement.previousSibling;
	}
	return prevElement;
}

/*
	事件绑定封装函数
 */
function addEvent(node,type,fn,cat){
	cat = cat || false;
	//addEventListener(type,fn,catch)
	if(node.addEventListener){
		node.addEventListener(type,fn,cat);
	}else if(node.attachEvent){
		node.attachEvent('on'+type,fn);
	}else{
		node['on'+type] = fn;
	}
}
//测试驱动开发
//addEvent(btn,'click',function(){});
//addEvent(document,'mousemove',function(){});


/*
	封装cookie的增删改查
 */
function addCookie(name,value,expires){
	var str = name + '=' + value;

	// 如果有失效时间，则写入，如果没有失效时间，则为临时cookie
	if(expires) str += ';expires=' + expires;
	document.cookie = str;
}
// addCookie(name,value,expires)
// document.cookie;==> name=value
// addCookie(name,value);//临时cookie

function getCookie(name){
	var cookies = document.cookie;
	if(!cookies){
		return '';
	}

	cookies = cookies.split('; ');

	// 输出结果
	var res = '';
	cookies.forEach(function(cookie){
		var _temp = cookie.split('=');
		if(_temp[0] === name){
			res = _temp[1];
		}
	});

	return res;
}
//getCookie('username') ==> xie
//getCookie('password') ==> 123
//getCookie('skin') ==> css1
//

function removeCookie(name){
	var now = new Date();
	document.cookie = name + '=null;expires=' + now;
}


/*
	删除前后空格
 */
function trim(str){
	var reg = /^\s*|\s*$/g;
	return str.replace(reg,'');
}
//trim('good    ');//'good'
//trim('good good study');//'good good study'
//trim('          ');//''
//
// 获取页面元素
// document.getElementById(id)
// document.getElementsByTagName('div');
// document.getElementsByClassName('box');
// document.getElementsByName('checkbox');
function getByClass(className){
	if(document.getElementsByClassName){
		return document.getElementsByClassName(className);
	}else{
		var node = document.getElementsByTagName('*');

		// 遍历所有标签
		var arr = [];
		for(var i=0;i<node.length;i++){
			var _className = node[i].className;
			// 如果当前标签包含传入的className
			if(_className.indexOf(className) != -1){
				arr.push(node[i]);
			}
		}

		return arr;
	}
}
//getByClass('box')
//
/*
	获取页面元素
	selector:选择器
	context:上下文，可选
 */
function $(selector,context){
	if(selector.tagName) return selector;
	context = context || document;
	var res;
	if(context.querySelectorAll){
		res = context.querySelectorAll(selector);
		// 如果返回的res只有一个元素，提取第一元素
		if(res.length == 1){
			res = res[0];
		}
		return res;
	}
	// 判断传进来的ele是element对象还是字符串
	if(/^#\w+/.test(selector)){
		res = context.getElementById(selector.substring(1));
	}else if(/^\.\w+/.test(selector)){
		// res = document.getElementsByClassName(selector.substring(1));
		res = context['getElementsByClassName'](selector.substring(1));
	}else if(typeof selector === 'string'){
		// res = document.getElementsByTagName(selector);
		context['getElementsByTagName'](selector);
	}else if(selector.nodeType == 1){
		res = selector;
	}
	return res;
}
// $('.col',picList)
// $('#box'),$('.container'),$('div')
// $('div#box li span');

/*
	获取css样式
	ele:获取css样式所在的元素
	attr:css属性
 */
function getStyle(ele,attr){
	ele = $(ele);
	if(window.getComputedStyle){
		return getComputedStyle(ele)[attr]
	}else if(ele.currentStyle){
		return ele.currentStyle[attr]
	}else{
		return ele.style[attr];
	}
}
//getStyle(ele,attr);
//getStyle(div,'opacity') //.5,1
//getStyle('div','width') //100px
//getStyle('#box','height')

/*
	动画函数
	ele:改变样式的元素对象
	opt:目标属性
	callback:回调函数，动画完成后执行
 */
function animate(ele,opt,callback){
	time = opt.time || 50;

	// 如果当前存在正在执行的动画，先清除
	if(ele.timerList && ele.timerList.length){
		for(var name in ele.timerList){
			// if(name == 'length') continue;
			clearAnimate(name);
			typeof callback === 'function' && callback();
		}
	}

	// 开始动画
	// 为当前ele对象创建一个存放定时器的属性timerList
	ele.timerList = {};

	// 创建一个不可枚举的length属性
	// 不可通过for..in获取
	Object.defineProperty(ele.timerList,'length',{enumerable:false,writable:true,value:0});

	// 为每个属性创建一个定时器，实现多个动画同时执行
	for(var attr in opt){
		(function(attr){
			// 为每个属性设一个定时器
			ele.timerList[attr] = setInterval(function(){
				//当前样式
				var currentStyle = parseFloat(getStyle(ele,attr));
				var speed = (opt[attr] - currentStyle)/8;

				//opacity速度
				var ospped = speed>0 ? .1 : -.1;

				// 其他属性速度
				speed = speed>0 ? Math.ceil(speed) : Math.floor(speed);

				// 变化到目标属性值时清除定时器
				if(currentStyle == opt[attr]){
					clearAnimate(attr);
					if(ele.timerList.length == 0){
						typeof callback === 'function' && callback();
					}
					return;
				}

				// opacity兼容性
				if(attr == "opacity"){
					ele.style.opacity = (currentStyle+ospped);
					ele.style.filter = "alpha(opacity="+(currentStyle+ospped)*100+")";
				}else{
					ele.style[attr] = currentStyle + speed + 'px';
				}
			},time);
			ele.timerList.length++;
		})(attr);
	}

	// 清除定时器
	function clearAnimate(attr){
		clearInterval(ele.timerList[attr]);
		delete ele.timerList[attr];
		ele.timerList.length--;
	}
}

/*
	ajax封装
		1)兼容
		2)能发送ajax异步请求
		3)能处理返回的数据
*/
function ajax(opt){
	var req;
	try{
		// 如果当前浏览器支持XMLHttpRequest对象，则执行这里的代码
		req = new XMLHttpRequest();
	}catch(error){
		// 如果不支持XMLHttpRequest对象，则执行这里的代码
		try{
			req = new ActiveXObject("Msxml2.XMLHTTP");
		}catch(error){
			try{
				req = new ActiveXObject("Microsoft.XMLHTTP");
			}catch(error){
				req = false;
			}
		}
	}
	if(!req){
		return;
	}

	// 处理数据
	req.onreadystatechgange = function(){
		if(req.readyState == 4 && req.status == 200){
			if(typeof opt.success === 'function'){
				var data;
				try{
					data = JSON.parse(req.responseText);
				}catch(error){
					data = req.responseText;
				}
				opt.success(data);
			}
		}
	}

	// 与服务器建立连接
	req.open(opt.type, opt.url, opt.async);

	// 发送请求
	req.send(null);
}
// ajax({
// url:'http://localhost/ajax/football?pageNo=1',
// type:'get',
// success:function(data){
// console.log(data)
// }
// })

/*
	extend扩展对象函数
		-target:目标对象
		-obj:要扩展的对象

	最终结果：把obj中的属性和方法全部复制到target对象中
 */
function extend(target,obj){
	// 遍历obj，把其中的属性和属性值写入target
	for(var name in obj){
		target[name] = obj[name];
	}
	return target;
}
// extend({async:true,type:'get'},{async:false,url:'xxx',sucess:function(){}});
// 结果得到：{async:false,type:'get',url:'xxx',sucess:function(){}}
// 