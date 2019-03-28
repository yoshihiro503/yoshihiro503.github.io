var $_, $hxClasses = $hxClasses || {}, $estr = function() { return js.Boot.__string_rec(this,''); }
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var Hash = $hxClasses["Hash"] = function() {
	this.h = { };
};
Hash.__name__ = ["Hash"];
Hash.prototype = {
	h: null
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return a.iterator();
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,toString: function() {
		var s = new StringBuf();
		s.b[s.b.length] = "{";
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b[s.b.length] = i == null?"null":i;
			s.b[s.b.length] = " => ";
			s.add(Std.string(this.get(i)));
			if(it.hasNext()) s.b[s.b.length] = ", ";
		}
		s.b[s.b.length] = "}";
		return s.b.join("");
	}
	,__class__: Hash
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
var Sprite = $hxClasses["Sprite"] = function() { }
Sprite.__name__ = ["Sprite"];
Sprite.prototype = {
	x: null
	,y: null
	,width: null
	,height: null
	,image: null
	,detectCollision: function(other) {
		return Math.abs(this.x - other.x) < 16 && Math.abs(this.y - other.y) < 16;
	}
	,draw: function(context) {
		context.drawImage(this.image,this.x - ((this.width | 0) >> 1),this.y - ((this.height | 0) >> 1));
	}
	,__class__: Sprite
}
var MovingObject = $hxClasses["MovingObject"] = function(x,y,dx,dy,image) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.image = image;
};
MovingObject.__name__ = ["MovingObject"];
MovingObject.__super__ = Sprite;
MovingObject.prototype = $extend(Sprite.prototype,{
	dx: null
	,dy: null
	,update: function() {
		this.x += this.dx;
		this.y += this.dy;
		return this._inDisplay();
	}
	,_inDisplay: function() {
		return !(this.x <= 0 || this.x >= 320 || this.y <= 0 || this.y >= 480);
	}
	,__class__: MovingObject
});
var Bullet = $hxClasses["Bullet"] = function(x,y,dx,dy,image) {
	MovingObject.call(this,x,y,dx,dy,image);
	this.width = 4;
	this.height = 4;
};
Bullet.__name__ = ["Bullet"];
Bullet.__super__ = MovingObject;
Bullet.prototype = $extend(MovingObject.prototype,{
	updateSt: function(st) {
		var inDisplay = MovingObject.prototype.update.call(this);
		this.draw(st.ctx);
		var $it0 = st.rocks.keys();
		while( $it0.hasNext() ) {
			var rockKey = $it0.next();
			var rock = st.rocks.get(rockKey);
			if(this.detectCollision(rock)) {
				if(rock.hp == 0) return false;
				inDisplay = false;
				if(--rock.hp == 0) {
					st.score = Math.min(st.score + rock.score,999999999);
					st.updateScore();
					rock.dx = rock.dy = 0;
					rock.setState(st,"bomb1");
				} else {
					var newState = (rock.state + "w").substr(0,6);
					rock.setState(st,newState);
				}
			}
		}
		return inDisplay;
	}
	,__class__: Bullet
});
var Rock = $hxClasses["Rock"] = function(x,y,dx,dy,hp,score,state,image) {
	MovingObject.call(this,x,y,dx,dy,image);
	this.width = 32;
	this.height = 32;
	this.hp = hp;
	this.score = score;
	this.state = state;
};
Rock.__name__ = ["Rock"];
Rock.__super__ = MovingObject;
Rock.prototype = $extend(MovingObject.prototype,{
	hp: null
	,score: null
	,state: null
	,updateSt: function(st) {
		var inDisplay = MovingObject.prototype.update.call(this);
		this.draw(st.ctx);
		if(this.hp == 0) {
			var next = Std.parseInt(this.state.substr(4)) + 1;
			if(next > 10) return false; else this.setState(st,"bomb" + next);
		} else {
			this.setState(st,this.state.substr(0,5));
			if(st.isGaming() && this.detectCollision(st.ship)) {
				st.changeStateToBeDying();
				st.dying = 1;
			}
		}
		return inDisplay;
	}
	,setState: function(stage,state) {
		this.state = state;
		this.image = stage.images.get(state);
	}
	,__class__: Rock
});
var SpaceShip = $hxClasses["SpaceShip"] = function(x,y,image) {
	this.width = 32;
	this.height = 32;
	this.x = x;
	this.y = y;
	this.image = image;
};
SpaceShip.__name__ = ["SpaceShip"];
SpaceShip.__super__ = Sprite;
SpaceShip.prototype = $extend(Sprite.prototype,{
	__class__: SpaceShip
});
var js = js || {}
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
var Stage = $hxClasses["Stage"] = function(stageCanvas,scoreboard) {
	var me = this;
	this.state = "loading";
	this.dying = 0;
	this.lastX = -1;
	this.lastY = -1;
	this.frameCount = 0;
	this.changeStateToBeLoading();
	this.start = Date.now();
	this.fps = 0;
	this.imageName = ["my","bullet","rock1","rock2","rock3"];
	this.images = new Hash();
	scoreboard.style.width = 320 + "px";
	this.scoreElement = scoreboard;
	stageCanvas.width = 320;
	stageCanvas.height = 480;
	this.ctx = stageCanvas.getContext("2d");
	var bg = js.Lib.document.createElement("canvas");
	bg.width = 320;
	bg.height = 512;
	this.bgCtx = bg.getContext("2d");
	var _g = 0;
	while(_g < 10) {
		var i = _g++;
		this.imageName.push("space" + (i + 1));
		this.imageName.push("bomb" + (i + 1));
	}
	var loadedCount = 0;
	var checkLoad = function(e) {
		var image = e.target;
		var canvas = js.Lib.document.createElement("canvas");
		var cx = canvas.getContext("2d");
		cx.drawImage(image,0,0);
		me.images.set(image.dataset.name,canvas);
		if(++loadedCount == me.imageName.length) me.initialize();
	};
	var _g = 0, _g1 = this.imageName;
	while(_g < _g1.length) {
		var name = _g1[_g];
		++_g;
		var image = js.Lib.document.createElement("img");
		image.addEventListener("load",checkLoad);
		image.src = "img" + "/" + name + ".png";
		image.dataset.name = name;
	}
	var touchStart = function(e) {
		e.preventDefault();
		var p = me.getPoint(e);
		me.lastX = p[0];
		me.lastY = p[1];
		if(me.isGameOver()) me.initialize();
	};
	var body = js.Lib.document.body;
	body.addEventListener("mousedown",touchStart);
	body.addEventListener("touchstart",touchStart);
	var touchMove = function(e) {
		e.preventDefault();
		var p = me.getPoint(e);
		if(me.isGaming() && me.lastX != -1) {
			var ship = me.ship;
			ship.x += (p[0] - me.lastX) * 2.5 | 0;
			ship.y += (p[1] - me.lastY) * 3.0 | 0;
			ship.x = Math.max(ship.x,0);
			ship.x = Math.min(ship.x,320);
			ship.y = Math.max(ship.y,0);
			ship.y = Math.min(ship.y,480);
		}
		me.lastX = p[0];
		me.lastY = p[1];
	};
	body.addEventListener("mousemove",touchMove);
	body.addEventListener("touchmove",touchMove);
};
Stage.__name__ = ["Stage"];
Stage.setTimeout = function(ff,t) {
	var f = ff;
	setTimeout(f, t);
}
Stage.prototype = {
	imageName: null
	,images: null
	,state: null
	,ship: null
	,dying: null
	,lastX: null
	,lastY: null
	,frameCount: null
	,currentTop: null
	,ctx: null
	,bgCtx: null
	,bullets: null
	,rocks: null
	,numRocks: null
	,score: null
	,scoreElement: null
	,changeStateToBeLoading: function() {
		this.state = "loading";
	}
	,isLoading: function() {
		return this.state == "loading";
	}
	,changeStateToBeGaming: function() {
		this.state = "gaming";
	}
	,isGaming: function() {
		return this.state == "gaming";
	}
	,changeStateToBeDying: function() {
		this.state = "dying";
	}
	,isDying: function() {
		return this.state == "dying";
	}
	,changeStateToBeGameOver: function() {
		this.state = "gameover";
	}
	,isGameOver: function() {
		return this.state == "gameover";
	}
	,level: function() {
		return this.frameCount / 500 | 0;
	}
	,drawBackground: function() {
		var bottom = 512 - this.currentTop;
		if(bottom > 0) this.ctx.drawImage(this.bgCtx.canvas,0,this.currentTop,320,bottom,0,0,320,bottom);
		if(Math.abs(480 - bottom) > 0) this.ctx.drawImage(this.bgCtx.canvas,0,bottom);
	}
	,draw: function() {
		this.drawBackground();
		var ship = this.ship;
		if(this.isGaming()) ship.draw(this.ctx); else if(this.isDying()) {
			ship.image = this.images.get("bomb" + this.dying);
			ship.draw(this.ctx);
			if(++this.dying > 10) this.initialize();
		}
	}
	,drawSpace: function(px,py) {
		var spaceType = Math.random() * 10 + 1 | 0;
		var image = this.images.get("space" + spaceType);
		this.bgCtx.drawImage(image,px * 32,py * 32);
	}
	,createBullet: function(dx,dy) {
		return new Bullet(this.ship.x,this.ship.y,dx * 20,dy * 20,this.images.get("bullet"));
	}
	,createRock: function() {
		var level = this.level();
		var px = this.ship.x + Math.random() * 100 - 50;
		var py = this.ship.y + Math.random() * 100 - 50;
		var fx = Math.random() * 320;
		var fy = level >= 4?Math.random() * 2 * 480:0;
		var r = Math.atan2(py - fy,px - fx);
		var d = Math.max(Math.random() * (5.5 + level) + 1.5,10);
		var hp = Math.random() * Math.random() * (5 + level / 4 | 0) | 0 | 1;
		var rockId = Math.random() * 3 + 1 | 0;
		return new Rock(fx,fy,Math.cos(r) * d,Math.sin(r) * d,hp,hp * hp * 100,"rock" + rockId,this.images.get("rock" + rockId));
	}
	,tick: function() {
		var me = this;
		++this.frameCount;
		Stage.setTimeout(function() {
			me.tick();
		},1000 / 30 | 0 | 0);
		this.watchFPS();
		if(this.isLoading()) return;
		if(--this.currentTop == 0) this.currentTop = 512;
		if(this.currentTop % 32 == 0) {
			var line = this.currentTop / 32 - 1;
			var _g = 0;
			while(_g < 10) {
				var px = _g++;
				this.drawSpace(px,line);
			}
		}
		this.draw();
		var fc = Std.string(this.frameCount);
		if(this.isGaming() && this.frameCount % 3 == 0) {
			this.bullets.set(fc + "a",this.createBullet(-1,-1));
			this.bullets.set(fc + "b",this.createBullet(0,-1));
			this.bullets.set(fc + "c",this.createBullet(1,-1));
			this.bullets.set(fc + "d",this.createBullet(-1,1));
			this.bullets.set(fc + "e",this.createBullet(1,1));
		}
		if(this.numRocks < 5 + this.level()) {
			this.rocks.set(fc + "r",this.createRock());
			++this.numRocks;
		}
		var $it0 = this.bullets.keys();
		while( $it0.hasNext() ) {
			var bulletKey = $it0.next();
			if(!this.bullets.get(bulletKey).updateSt(this)) this.bullets.remove(bulletKey);
		}
		var $it1 = this.rocks.keys();
		while( $it1.hasNext() ) {
			var rockKey = $it1.next();
			if(!this.rocks.get(rockKey).updateSt(this)) {
				this.rocks.remove(rockKey);
				--this.numRocks;
			}
		}
	}
	,initialize: function() {
		var _g = 0;
		while(_g < 10) {
			var px = _g++;
			var _g2 = 0, _g1 = 16;
			while(_g2 < _g1) {
				var py = _g2++;
				this.drawSpace(px,py);
			}
		}
		var _g = 0;
		while(_g < 3) {
			var i = _g++;
			var canvas = js.Lib.document.createElement("canvas");
			canvas.width = 32;
			canvas.height = 32;
			var rctx = canvas.getContext("2d");
			var k = "rock" + (i + 1);
			rctx.drawImage(this.images.get(k),0,0);
			rctx.globalCompositeOperation = "source-in";
			rctx.fillStyle = "#fff";
			rctx.fillRect(0,0,canvas.width,canvas.height);
			this.images.set(k + "w",canvas);
		}
		this.currentTop = 512;
		this.ship = new SpaceShip(80,360. | 0,this.images.get("my"));
		this.score = 0;
		this.bullets = new Hash();
		this.rocks = new Hash();
		this.numRocks = 0;
		this.changeStateToBeGaming();
		Stage.setTimeout(function() {
			js.Lib.window.scrollTo(0,0);
		},250);
	}
	,getPoint: function(e) {
		var px = 0;
		var py = 0;
		haxe.Log.trace(e.type,{ fileName : "Main.hx", lineNumber : 519, className : "Stage", methodName : "getPoint"});
		if(e.type == "mousedown" || e.type == "mousemove") {
			var me = e;
			px = me.clientX;
			py = me.clientY;
		} else {
			var te = e;
			px = te.touches[0].pageX;
			py = te.touches[0].pageY;
		}
		return [px,py];
	}
	,start: null
	,fps: null
	,watchFPS: function() {
		if(this.frameCount % 30 == 0) {
			this.fps = this.frameCount / (Date.now().getTime() - this.start.getTime()) * 1000 | 0;
			this.updateScore();
		}
	}
	,updateScore: function() {
		var scoreStr = Std.string(this.score);
		var fillz = "000000000".substr(0,9 - scoreStr.length);
		this.scoreElement.innerHTML = fillz + scoreStr + "<br/>\n" + this.fps + " FPS";
	}
	,__class__: Stage
}
var App = $hxClasses["App"] = function() { }
App.__name__ = ["App"];
App.main = function(args) {
	var dom = js.Lib.document;
	var stageCanvas = dom.getElementById(args[0]);
	var scoreboard = dom.getElementById(args[1]);
	var stage = new Stage(stageCanvas,scoreboard);
	stage.tick();
}
App.prototype = {
	__class__: App
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
var StringBuf = $hxClasses["StringBuf"] = function() {
	this.b = new Array();
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	add: function(x) {
		this.b[this.b.length] = x == null?"null":x;
	}
	,addSub: function(s,pos,len) {
		this.b[this.b.length] = s.substr(pos,len);
	}
	,addChar: function(c) {
		this.b[this.b.length] = String.fromCharCode(c);
	}
	,toString: function() {
		return this.b.join("");
	}
	,b: null
	,__class__: StringBuf
}
var haxe = haxe || {}
haxe.Log = $hxClasses["haxe.Log"] = function() { }
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Log.prototype = {
	__class__: haxe.Log
}
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
Config.cols = 10;
Config.rows = 15;
Config.cellWidth = 32;
Config.cellHeight = 32;
Config.bulletWidth = 4;
Config.bulletHeight = 4;
Config.bulletSpeed = 20;
Config.reloadCount = 3;
Config.initialNumRocks = 5;
Config.FPS = 30;
Config.width = 320;
Config.height = 480;
Config.imagePath = "img";
js.Lib.onerror = null;
Stage.dom = js.Lib.document;
Stage.window = js.Lib.window;
Main.main()