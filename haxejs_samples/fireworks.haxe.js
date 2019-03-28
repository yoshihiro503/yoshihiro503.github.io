var $_, $hxClasses = $hxClasses || {}, $estr = function() { return js.Boot.__string_rec(this,''); }
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var IntIter = $hxClasses["IntIter"] = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	min: null
	,max: null
	,hasNext: function() {
		return this.min < this.max;
	}
	,next: function() {
		return this.min++;
	}
	,__class__: IntIter
}
var Config = $hxClasses["Config"] = function() { }
Config.__name__ = ["Config"];
Config.prototype = {
	__class__: Config
}
var Spark = $hxClasses["Spark"] = function(posX,posY,size,color) {
	this.state = 0;
	this.posX = posX;
	this.posY = posY;
	this.size = size;
	this.color = color;
	var angle = Math.random() * (Math.PI * 2);
	var velocity = Math.random() * 6.0;
	this.velX = Math.cos(angle) * velocity;
	this.velY = Math.sin(angle) * velocity;
};
Spark.__name__ = ["Spark"];
Spark.prototype = {
	posX: null
	,posY: null
	,velX: null
	,velY: null
	,size: null
	,color: null
	,state: null
	,_decay: function() {
		this.velX *= 0.98;
		this.velY *= 0.98;
		this.size *= 0.98;
		if(this.size < 0.5 && this.state == 0) {
			this.color = Firework.randomColor();
			this.size = 2.0;
			this.state++;
		}
	}
	,_move: function() {
		this.posX += this.velX + (Math.random() - 0.5);
		this.posY += this.velY + (Math.random() - 0.5) + 2.0;
	}
	,_render: function(view) {
		view.cx.beginPath();
		view.cx.arc(this.posX,this.posY,this.size,0,Math.PI * 2,true);
		view.cx.fillStyle = Math.random() > 0.2?this.color:"white";
		view.cx.fill();
	}
	,_isLiving: function(view) {
		if(this.size <= 0.01) return false; else if(this.posX <= 0) return false; else if(this.posX >= view.width || this.posY >= view.height) return false; else return true;
	}
	,draw: function(view) {
		{
			this.velX *= 0.98;
			this.velY *= 0.98;
			this.size *= 0.98;
			if(this.size < 0.5 && this.state == 0) {
				this.color = Firework.randomColor();
				this.size = 2.0;
				this.state++;
			}
		}
		{
			this.posX += this.velX + (Math.random() - 0.5);
			this.posY += this.velY + (Math.random() - 0.5) + 2.0;
		}
		{
			view.cx.beginPath();
			view.cx.arc(this.posX,this.posY,this.size,0,Math.PI * 2,true);
			view.cx.fillStyle = Math.random() > 0.2?this.color:"white";
			view.cx.fill();
		}
		return this.size <= 0.01?false:this.posX <= 0?false:this.posX >= view.width || this.posY >= view.height?false:true;
	}
	,__class__: Spark
}
var Firework = $hxClasses["Firework"] = function(view,x,y) {
	this.sparks = [];
	this.view = view;
	var color = "lime";
	var _g1 = 0, _g = Config.quantity;
	while(_g1 < _g) {
		var i = _g1++;
		this.sparks.push(new Spark(x,y,2.0,color));
	}
};
Firework.__name__ = ["Firework"];
Firework.randomColor = function() {
	var blightness = 60;
	var rgb = [];
	var _g = 0;
	while(_g < 3) {
		var i = _g++;
		rgb[i] = Math.min(Math.random() * 255 + blightness,255) | 0;
	}
	return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
}
Firework.prototype = {
	sparks: null
	,view: null
	,update: function() {
		var _g1 = 0, _g = this.sparks.length;
		while(_g1 < _g) {
			var i = _g1++;
			var s = this.sparks[i];
			if(!s.draw(this.view)) this.sparks.splice(i,1);
		}
		return this.sparks.length > 0;
	}
	,__class__: Firework
}
var FireworkView = $hxClasses["FireworkView"] = function(canvas) {
	var me = this;
	this.fireworks = [];
	this.numSparks = 0;
	this.cx = canvas.getContext("2d");
	this.width = canvas.width;
	this.height = canvas.height;
	var rect = canvas.getBoundingClientRect();
	this.left = rect.left;
	this.top = rect.top;
	canvas.addEventListener("mousedown",function(e) {
		var me1 = e;
		me.explode(me1.clientX,me1.clientY);
	});
	canvas.addEventListener("touchstart",function(e) {
		var te = e;
		me.explode(te.touches[0].pageX,te.touches[0].pageY);
	});
};
FireworkView.__name__ = ["FireworkView"];
FireworkView.prototype = {
	cx: null
	,width: null
	,height: null
	,left: null
	,top: null
	,fireworks: null
	,numSparks: null
	,explode: function(x,y) {
		this.fireworks.push(new Firework(this,x - this.left,y - this.top));
	}
	,update: function() {
		if(this.fireworks.length == 0) this.explode(this.width / 2 + this.left | 0,this.height / 3 | 0);
		this.numSparks = 0;
		var _g1 = 0, _g = this.fireworks.length;
		while(_g1 < _g) {
			var i = _g1++;
			var fw = this.fireworks[i];
			if(fw.update()) this.numSparks += fw.sparks.length; else this.fireworks.splice(i,1);
		}
		this.cx.fillStyle = "rgba(0, 0, 0, 0.3)";
		this.cx.fillRect(0,0,this.width,this.height);
	}
	,__class__: FireworkView
}
var FPSWatcher = $hxClasses["FPSWatcher"] = function(elementId) {
	this.start = Date.now();
	this.frameCount = 0;
	this.elementId = elementId;
};
FPSWatcher.__name__ = ["FPSWatcher"];
FPSWatcher.prototype = {
	elementId: null
	,start: null
	,frameCount: null
	,update: function(numSparks) {
		++this.frameCount;
		if(this.frameCount % 100 == 0) {
			var message = "FPS: " + (this.frameCount / (Date.now().getTime() - this.start.getTime()) * 1000 | 0) + " (sparks: " + numSparks + ")";
			js.Lib.document.getElementById(this.elementId).innerHTML = message;
		}
	}
	,__class__: FPSWatcher
}
var Application = $hxClasses["Application"] = function() { }
Application.__name__ = ["Application"];
Application.main = function(canvasId,fpsId,quantity) {
	Config.quantity = quantity;
	var dom = js.Lib.document;
	var canvas = dom.getElementById(canvasId);
	var view = new FireworkView(canvas);
	var watcher = new FPSWatcher(fpsId);
	var ns = view.numSparks;
	var update = function() {
		view.update();
		watcher.update(ns);
	};
	setInterval(update, 0);
}
Application.prototype = {
	__class__: Application
}
var Main = $hxClasses["Main"] = function() { }
Main.__name__ = ["Main"];
Main.main = function() {
}
Main.prototype = {
	__class__: Main
}
var Std = $hxClasses["Std"] = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && x.charCodeAt(1) == 120) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
Std.prototype = {
	__class__: Std
}
var js = js || {}
js.Boot = $hxClasses["js.Boot"] = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ != null || o.__ename__ != null)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__ != null) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		return o.__enum__ == cl || cl == Class && o.__name__ != null || cl == Enum && o.__ename__ != null;
	}
}
js.Boot.__init = function() {
	js.Lib.isIE = typeof document!='undefined' && document.all != null && typeof window!='undefined' && window.opera == null;
	js.Lib.isOpera = typeof window!='undefined' && window.opera != null;
	Array.prototype.copy = Array.prototype.slice;
	Array.prototype.insert = function(i,x) {
		this.splice(i,0,x);
	};
	Array.prototype.remove = Array.prototype.indexOf?function(obj) {
		var idx = this.indexOf(obj);
		if(idx == -1) return false;
		this.splice(idx,1);
		return true;
	}:function(obj) {
		var i = 0;
		var l = this.length;
		while(i < l) {
			if(this[i] == obj) {
				this.splice(i,1);
				return true;
			}
			i++;
		}
		return false;
	};
	Array.prototype.iterator = function() {
		return { cur : 0, arr : this, hasNext : function() {
			return this.cur < this.arr.length;
		}, next : function() {
			return this.arr[this.cur++];
		}};
	};
	if(String.prototype.cca == null) String.prototype.cca = String.prototype.charCodeAt;
	String.prototype.charCodeAt = function(i) {
		var x = this.cca(i);
		if(x != x) return undefined;
		return x;
	};
	var oldsub = String.prototype.substr;
	String.prototype.substr = function(pos,len) {
		if(pos != null && pos != 0 && len != null && len < 0) return "";
		if(len == null) len = this.length;
		if(pos < 0) {
			pos = this.length + pos;
			if(pos < 0) pos = 0;
		} else if(len < 0) len = this.length + len - pos;
		return oldsub.apply(this,[pos,len]);
	};
	Function.prototype["$bind"] = function(o) {
		var f = function() {
			return f.method.apply(f.scope,arguments);
		};
		f.scope = o;
		f.method = this;
		return f;
	};
}
js.Boot.prototype = {
	__class__: js.Boot
}
js.Lib = $hxClasses["js.Lib"] = function() { }
js.Lib.__name__ = ["js","Lib"];
js.Lib.isIE = null;
js.Lib.isOpera = null;
js.Lib.document = null;
js.Lib.window = null;
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
js.Lib.prototype = {
	__class__: js.Lib
}
js.Boot.__res = {}
js.Boot.__init();
{
	var d = Date;
	d.now = function() {
		return new Date();
	};
	d.fromTime = function(t) {
		var d1 = new Date();
		d1["setTime"](t);
		return d1;
	};
	d.fromString = function(s) {
		switch(s.length) {
		case 8:
			var k = s.split(":");
			var d1 = new Date();
			d1["setTime"](0);
			d1["setUTCHours"](k[0]);
			d1["setUTCMinutes"](k[1]);
			d1["setUTCSeconds"](k[2]);
			return d1;
		case 10:
			var k = s.split("-");
			return new Date(k[0],k[1] - 1,k[2],0,0,0);
		case 19:
			var k = s.split(" ");
			var y = k[0].split("-");
			var t = k[1].split(":");
			return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
		default:
			throw "Invalid date format : " + s;
		}
	};
	d.prototype["toString"] = function() {
		var date = this;
		var m = date.getMonth() + 1;
		var d1 = date.getDate();
		var h = date.getHours();
		var mi = date.getMinutes();
		var s = date.getSeconds();
		return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d1 < 10?"0" + d1:"" + d1) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
	};
	d.prototype.__class__ = $hxClasses["Date"] = d;
	d.__name__ = ["Date"];
}
{
	Math.__name__ = ["Math"];
	Math.NaN = Number["NaN"];
	Math.NEGATIVE_INFINITY = Number["NEGATIVE_INFINITY"];
	Math.POSITIVE_INFINITY = Number["POSITIVE_INFINITY"];
	$hxClasses["Math"] = Math;
	Math.isFinite = function(i) {
		return isFinite(i);
	};
	Math.isNaN = function(i) {
		return isNaN(i);
	};
}
{
	String.prototype.__class__ = $hxClasses["String"] = String;
	String.__name__ = ["String"];
	Array.prototype.__class__ = $hxClasses["Array"] = Array;
	Array.__name__ = ["Array"];
	var Int = $hxClasses["Int"] = { __name__ : ["Int"]};
	var Dynamic = $hxClasses["Dynamic"] = { __name__ : ["Dynamic"]};
	var Float = $hxClasses["Float"] = Number;
	Float.__name__ = ["Float"];
	var Bool = $hxClasses["Bool"] = Boolean;
	Bool.__ename__ = ["Bool"];
	var Class = $hxClasses["Class"] = { __name__ : ["Class"]};
	var Enum = { };
	var Void = $hxClasses["Void"] = { __ename__ : ["Void"]};
}
{
	if(typeof document != "undefined") js.Lib.document = document;
	if(typeof window != "undefined") {
		js.Lib.window = window;
		js.Lib.window.onerror = function(msg,url,line) {
			var f = js.Lib.onerror;
			if(f == null) return false;
			return f(msg,[url + ":" + line]);
		};
	}
}
Config.quantity = 360;
Config.size = 2.0;
Config.decay = 0.98;
Config.gravity = 2.0;
Config.speed = 6.0;
Spark.rad = Math.PI * 2;
js.Lib.onerror = null;
Main.main()