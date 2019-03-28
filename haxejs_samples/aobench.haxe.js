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
var Vec3 = $hxClasses["Vec3"] = function(x,y,z) {
	this.x = x;
	this.y = y;
	this.z = z;
};
Vec3.__name__ = ["Vec3"];
Vec3.vadd = function(a,b) {
	return new Vec3(a.x + b.x,a.y + b.y,a.z + b.z);
}
Vec3.vsub = function(a,b) {
	return new Vec3(a.x - b.x,a.y - b.y,a.z - b.z);
}
Vec3.vcross = function(a,b) {
	return new Vec3(a.y * b.z - a.z * b.y,a.z * b.x - a.x * b.z,a.x * b.y - a.y * b.x);
}
Vec3.vdot = function(a,b) {
	return a.x * b.x + a.y * b.y + a.z * b.z;
}
Vec3.vlength = function(a) {
	return Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
}
Vec3.vnormalize = function(a) {
	var len = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
	var v = new Vec3(a.x,a.y,a.z);
	if(Math.abs(len) > 1.0e-17) {
		v.x /= len;
		v.y /= len;
		v.z /= len;
	}
	return v;
}
Vec3.prototype = {
	x: null
	,y: null
	,z: null
	,__class__: Vec3
}
var Isect = $hxClasses["Isect"] = function() {
	this.p = new Vec3(0.0,0.0,0.0);
	this.n = new Vec3(0.0,0.0,0.0);
	this.t = 1000000.0;
	this.hit = false;
};
Isect.__name__ = ["Isect"];
Isect.prototype = {
	t: null
	,hit: null
	,p: null
	,n: null
	,__class__: Isect
}
var Ray = $hxClasses["Ray"] = function(org,dir) {
	this.org = org;
	this.dir = dir;
};
Ray.__name__ = ["Ray"];
Ray.prototype = {
	org: null
	,dir: null
	,__class__: Ray
}
var Sphere = $hxClasses["Sphere"] = function(center,radius) {
	this.center = center;
	this.radius = radius;
};
Sphere.__name__ = ["Sphere"];
Sphere.prototype = {
	center: null
	,radius: null
	,intersect: function(ray,isect) {
		var org = ray.org;
		var dir = ray.dir;
		var center = this.center;
		var rs = new Vec3(org.x - center.x,org.y - center.y,org.z - center.z);
		var B = rs.x * dir.x + rs.y * dir.y + rs.z * dir.z;
		var C = rs.x * rs.x + rs.y * rs.y + rs.z * rs.z - this.radius * this.radius;
		var D = B * B - C;
		if(D > 0.0) {
			var t = -B - Math.sqrt(D);
			if(t > 0.0 && t < isect.t) {
				isect.t = t;
				isect.hit = true;
				var p = new Vec3(ray.org.x + ray.dir.x * t,ray.org.y + ray.dir.y * t,ray.org.z + ray.dir.z * t);
				isect.p = p;
				var n = new Vec3(p.x - center.x,p.y - center.y,p.z - center.z);
				isect.n = Vec3.vnormalize(n);
			}
		}
	}
	,__class__: Sphere
}
var Plane = $hxClasses["Plane"] = function(p,n) {
	this.p = p;
	this.n = n;
};
Plane.__name__ = ["Plane"];
Plane.prototype = {
	p: null
	,n: null
	,intersect: function(ray,isect) {
		var p = this.p;
		var n = this.n;
		var org = ray.org;
		var dir = ray.dir;
		var d = -(p.x * n.x + p.y * n.y + p.z * n.z);
		var v = dir.x * n.x + dir.y * n.y + dir.z * n.z;
		if(Math.abs(v) < 1.0e-17) return;
		var t = -(org.x * n.x + org.y * n.y + org.z * n.z + d) / v;
		if(t > 0.0 && t < isect.t) {
			isect.hit = true;
			isect.t = t;
			isect.n = this.n;
			isect.p = new Vec3(ray.org.x + t * ray.dir.x,ray.org.y + t * ray.dir.y,ray.org.z + t * ray.dir.z);
		}
	}
	,__class__: Plane
}
var AOBench = $hxClasses["AOBench"] = function() {
	this.spheres = [new Sphere(new Vec3(-2.0,0.0,-3.5),0.5),new Sphere(new Vec3(-0.5,0.0,-3.0),0.5),new Sphere(new Vec3(1.0,0.0,-2.2),0.5)];
	this.plane = new Plane(new Vec3(0.0,-0.5,0.0),new Vec3(0.0,1.0,0.0));
};
AOBench.__name__ = ["AOBench"];
AOBench.createArray = function(len) {
	var xs = new Array();
	var _g = 0;
	while(_g < len) {
		var i = _g++;
		xs.push(null);
	}
	return xs;
}
AOBench.prototype = {
	clamp: function(f) {
		var i = f * 255.0;
		if(i > 255.0) i = 255.0;
		if(i < 0.0) i = 0.0;
		return Math.round(i);
	}
	,orthoBasis: function(basis,n) {
		basis[2] = n;
		basis[1] = new Vec3(0.0,0.0,0.0);
		if(n.x < 0.6 && n.x > -0.6) basis[1].x = 1.0; else if(n.y < 0.6 && n.y > -0.6) basis[1].y = 1.0; else if(n.z < 0.6 && n.z > -0.6) basis[1].z = 1.0; else basis[1].x = 1.0;
		var b1 = basis[1], b2 = basis[2];
		basis[0] = new Vec3(b1.y * b2.z - b1.z * b2.y,b1.z * b2.x - b1.x * b2.z,b1.x * b2.y - b1.y * b2.x);
		basis[0] = Vec3.vnormalize(basis[0]);
		var b0 = basis[0];
		basis[1] = new Vec3(b2.y * b0.z - b2.z * b0.y,b2.z * b0.x - b2.x * b0.z,b2.x * b0.y - b2.y * b0.x);
		basis[1] = Vec3.vnormalize(basis[1]);
	}
	,spheres: null
	,plane: null
	,ambient_occlusion: function(isect) {
		var basis = AOBench.createArray(3);
		this.orthoBasis(basis,isect.n);
		var p = new Vec3(isect.p.x + 0.0001 * isect.n.x,isect.p.y + 0.0001 * isect.n.y,isect.p.z + 0.0001 * isect.n.z);
		var occlusion = 0;
		var _g = 0;
		while(_g < 8) {
			var j = _g++;
			var _g1 = 0;
			while(_g1 < 8) {
				var i = _g1++;
				var r = Math.random();
				var phi = 2.0 * Math.PI * Math.random();
				var x = Math.cos(phi) * Math.sqrt(1.0 - r);
				var y = Math.sin(phi) * Math.sqrt(1.0 - r);
				var z = Math.sqrt(r);
				var rx = x * basis[0].x + y * basis[1].x + z * basis[2].x;
				var ry = x * basis[0].y + y * basis[1].y + z * basis[2].y;
				var rz = x * basis[0].z + y * basis[1].z + z * basis[2].z;
				var raydir = new Vec3(rx,ry,rz);
				var ray = new Ray(p,raydir);
				var occIsect = new Isect();
				this.spheres[0].intersect(ray,occIsect);
				this.spheres[1].intersect(ray,occIsect);
				this.spheres[2].intersect(ray,occIsect);
				this.plane.intersect(ray,occIsect);
				if(occIsect.hit) occlusion++;
			}
		}
		var occ_f = (64 - occlusion) / 64;
		return new Vec3(occ_f,occ_f,occ_f);
	}
	,render: function(ctx,w,h) {
		var cnt = 0;
		var half_w = w * .5;
		var half_h = h * .5;
		var _g = 0;
		while(_g < h) {
			var y = _g++;
			var _g1 = 0;
			while(_g1 < w) {
				var x = _g1++;
				cnt++;
				var px = (x - half_w) / half_w;
				var py = -(y - half_h) / half_h;
				var eye = Vec3.vnormalize(new Vec3(px,py,-1.0));
				var ray = new Ray(new Vec3(0.0,0.0,0.0),eye);
				var isect = new Isect();
				this.spheres[0].intersect(ray,isect);
				this.spheres[1].intersect(ray,isect);
				this.spheres[2].intersect(ray,isect);
				this.plane.intersect(ray,isect);
				var col = new Vec3(0.0,0.0,0.0);
				if(isect.hit) col = this.ambient_occlusion(isect);
				var r = Math.round(col.x * 255.0);
				var g = Math.round(col.y * 255.0);
				var b = Math.round(col.z * 255.0);
				ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
				ctx.fillRect(x,y,1,1);
			}
		}
	}
	,__class__: AOBench
}
var Application = $hxClasses["Application"] = function() { }
Application.__name__ = ["Application"];
Application.main = function(canvasId,fpsId,quantity) {
	var dom = js.Lib.document;
	var canvas = dom.getElementById(canvasId);
	var ctx = canvas.getContext("2d");
	var ao = new AOBench();
	var t0 = Date.now().getTime();
	ao.render(ctx,256,256);
	var t1 = Date.now().getTime();
	var d = t1 - t0;
	dom.getElementById(fpsId).innerHTML = "Time = " + d + "[ms]";
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
AOBench.IMAGE_WIDTH = 256;
AOBench.IMAGE_HEIGHT = 256;
AOBench.NSUBSAMPLES = 2;
AOBench.NAO_SAMPLES = 8;
AOBench.EPS = 0.0001;
AOBench.NPHI = 8;
AOBench.NTHETA = 8;
AOBench.ALLRAY = 64;
js.Lib.onerror = null;
Main.main()