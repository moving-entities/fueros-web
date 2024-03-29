//Written by Brendan Whitfield




/*
 * Array2D Constructor
 * 
 * new Array2D(<Array2D>);
 * new Array2D(<x>, <y>;)
 */
window.Array2D = function() {
	"use strict";

	this.default_value = 0;
	var args = arguments; //for brevity, nothing more

	this.__assert__.totalArgs.call(this, "constructor", [1,2,3], args);

	switch(args.length)
	{
		case 1: //copy constructor
			this.__assert__.typeOf.call(this, "constructor", args[0], Array2D);

			var old = args[0];
			this.__build__.call(this, old.x, old.y, old.default_value);

			this.forEach(function(v, x, y, a) {
				a[x][y] = old[x][y];
			});
			break;

		case 2: //normal Array2D constructor
			this.__assert__.areNumbers.call(this, "constructor", args[0], args[1]);
			this.__assert__.validDimensions.call(this, "constructor", args[0], args[1]);
			this.__build__(args[0], args[1], 0);
			break;

		case 3: //normal Array2D constructor, with default value parameter
			this.__assert__.areNumbers.call(this, "constructor", args[0], args[1]);
			this.__assert__.validDimensions.call(this, "constructor", args[0], args[1]);
			this.__build__.apply(this, args);
			break;
	}
};




/*
 * Internal functions
 */

Array2D.prototype.__assert__ = {
	totalArgs : function(sourceName, nums, args) {
		for(var i = 0; i < nums.length; i++)
		{
			if(nums[i] === args.length) { return; }
		}
		throw "Array2D Error [" + sourceName + "]: wrong number of arguments";
	},

	areNumbers : function(sourceName) {
		for(var i = 1; i < arguments.length; i++)
		{
			if(isNaN(arguments[i]))
			{
				throw "Array2D Error [" + sourceName + "]: argument not a number";
			}
		}
	},

	isFunction : function(sourceName, callback) {
		if((callback === undefined) || !(callback instanceof Function))
		{
			throw "Array2D Error [" + sourceName + "]: callback is not a function";
		}
	},

	inBounds : function(sourceName, x, y, w, h) {
		switch(arguments.length)
		{
			case 3:
				if(!this.inBounds(x, y))
				{
					throw "Array2D Error [" + sourceName + "]: array index (" + x + ", " + y + ") out of bounds";
				}
				break;
			case 5:
				if(!this.inBounds(x, y, w, h))
				{
					throw "Array2D Error [" + sourceName + "]: rectangular area (" + x + ", " + y + ", " + w + ", " + h + ") out of bounds";
				}
				break;
		}
	},

	validDimensions : function(sourceName, x, y) {
		if((x <= 0) || (y <= 0))
		{
			throw "Array2D Error [" + sourceName + "]: can't create array with dimensions (" + x + ", " + y + ")";
		}
	},

	typeOf : function(sourceName, obj, type) {
		if(!(obj instanceof type))
		{
			throw "Array2D Error [" + sourceName + "]: parameter must be of type [" + type.name + "]";
		}
	},
};




Array2D.prototype.__build__ = function(nx, ny, def) {

	this.x = nx;
	this.y = ny;
	this.default_value = def !== undefined ? def : this.default_value;

	for(var x = 0; x < this.x; x++)
	{
		this[x] = {};
		for(var y = 0; y < this.y; y++)
		{
			this[x][y] = this.default_value;
		}
	}
};



/*
 * API functions
 */

/*
 * Iterators
 */

Array2D.prototype.forEach = function(callback) {
	this.__assert__.totalArgs.call(this, "forEach", [1], arguments);
	this.__assert__.isFunction.call(this, "forEach", callback);

	for(var x = 0; x < this.x; x++)
	{
		for(var y = 0; y < this.y; y++)
		{
			callback(this[x][y], x, y, this);
		}
	}
};

Array2D.prototype.forArea = function(x, y, w, h, callback) {
	this.__assert__.totalArgs.call(this, "forArea", [5], arguments);
	this.__assert__.areNumbers.call(this, "forArea", x, y, w, h);
	this.__assert__.isFunction.call(this, "forArea", callback);
	this.__assert__.inBounds.call(this, "forArea", x, y, w, h);

	for(var cx = x; cx < x+w; cx++)
	{
		for(var cy = y; cy < y+h; cy++)
		{
			callback(this[cx][cy], cx, cy, this);
		}
	}
};

Array2D.prototype.forRow = function(y, callback) {
	this.__assert__.totalArgs.call(this, "forRow", [2], arguments);
	this.__assert__.areNumbers.call(this, "forRow", y);
	this.__assert__.isFunction.call(this, "forRow", callback);
	this.__assert__.inBounds.call(this, "forRow", 0, y);

	for(var x = 0; x < this.x; x++)
	{
		callback(this[x][y], x, y, this);
	}
};

Array2D.prototype.forCol = function(x, callback) {
	this.__assert__.totalArgs.call(this, "forCol", [2], arguments);
	this.__assert__.areNumbers.call(this, "forCol", x);
	this.__assert__.isFunction.call(this, "forCol", callback);
	this.__assert__.inBounds.call(this, "forCol", x, 0);

	for(var y = 0; y < this.y; y++)
	{
		callback(this[x][y], x, y, this);
	}
};



/*
 * Fill statements
 */

//fill()
//fill(value)
Array2D.prototype.fill = function(value) {
	value = value === undefined ? this.default_value : value;

	this.forEach(function(v, x, y) {
		this[x][y] = value;
	});

	return this;
};

Array2D.prototype.fillArea = function(x, y, w, h, value) {
	this.__assert__.totalArgs.call(this, "fillArea", [4, 5], arguments);
	this.__assert__.areNumbers.call(this, "fillArea", x, y, w, h);

	value = value === undefined ? this.default_value : value;

	for(var cx = x; cx < x+w; cx++)
	{
		for(var cy = y; cy < y+h; cy++)
		{
			this[cx][cy] = value;
		}
	}

	return this;
};

//fillRow(y)
//fillRow(y, value)
Array2D.prototype.fillRow = function(y, value) {
	this.__assert__.totalArgs.call(this, "fillRow", [1, 2], arguments);
	this.__assert__.areNumbers.call(this, "fillRow", y);
	this.__assert__.inBounds.call(this, "fillRow", 0, y);

	value = value === undefined ? this.default_value : value;

	for(var x = 0; x < this.x; x++)
	{
		this[x][y] = value;
	}

	return this;
};

//fillCol(y)
//fillCol(y, value)
Array2D.prototype.fillCol = function(x, value) {
	this.__assert__.totalArgs.call(this, "fillCol", [1, 2], arguments);
	this.__assert__.areNumbers.call(this, "fillCol", x);
	this.__assert__.inBounds.call(this, "fillCol", x, 0);

	value = value === undefined ? this.default_value : value;

	for(var y = 0; y < this.y; y++)
	{
		this[x][y] = value;
	}

	return this;
};



/*
 * Row & Column operations
 */

Array2D.prototype.getRow = function(y) {
	this.__assert__.totalArgs.call(this, "getRow", [1], arguments);
	this.__assert__.areNumbers.call(this, "getRow", y);
	this.__assert__.inBounds.call(this, "getRow", 0, y);

	var array = [];
	for(var x = 0; x < this.x; x++)
	{
		array[x] = this[x][y];
	}

	return array;
};

Array2D.prototype.getCol = function(x) {
	this.__assert__.totalArgs.call(this, "getCol", [1], arguments);
	this.__assert__.areNumbers.call(this, "getCol", x);
	this.__assert__.inBounds.call(this, "getCol", x, 0);

	var array = [];
	for(var y = 0; y < this.y; y++)
	{
		array[y] = this[x][y];
	}
	
	return array;
};

Array2D.prototype.setRow = function(y, array) {
	this.__assert__.totalArgs.call(this, "setRow", [2], arguments);
	this.__assert__.areNumbers.call(this, "setRow", y);
	this.__assert__.inBounds.call(this, "setRow", 0, y);
	this.__assert__.typeOf.call(this, "setRow", array, Array);

	for(var x = 0; (x < this.x) && (x < array.length); x++)
	{
		this[x][y] = array[x];
	}

	return this;
};

Array2D.prototype.setCol = function(x, array) {
	this.__assert__.totalArgs.call(this, "setCol", [2], arguments);
	this.__assert__.areNumbers.call(this, "setCol", x);
	this.__assert__.inBounds.call(this, "setCol", x, 0);
	this.__assert__.typeOf.call(this, "setCol", array, Array);

	for(var y = 0; (y < this.y) && (y < array.length); y++)
	{
		this[x][y] = array[y];
	}

	return this;
};

Array2D.prototype.swapRow = function(y1, y2) {
	this.__assert__.totalArgs.call(this, "swapRow", [2], arguments);
	this.__assert__.areNumbers.call(this, "swapRow", y1, y2);
	this.__assert__.inBounds.call(this, "swapRow", y1, 0);
	this.__assert__.inBounds.call(this, "swapRow", y2, 0);

	if(y1 != y2)
	{
		for(var x = 0; x < this.x; x++)
		{
			var temp = this[x][y1];
			this[x][y1] = this[x][y2];
			this[x][y2] = temp;
		}
	}

	return this;
};

Array2D.prototype.swapCol = function(x1, x2) {
	this.__assert__.totalArgs.call(this, "swapCol", [2], arguments);
	this.__assert__.areNumbers.call(this, "swapCol", x1, x2);
	this.__assert__.inBounds.call(this, "swapCol", x1, 0);
	this.__assert__.inBounds.call(this, "swapCol", x2, 0);

	if(x1 != x2)
	{
		for(var y = 0; y < this.y; y++)
		{
			var temp = this[x1][y];
			this[x1][y] = this[x2][y];
			this[x2][y] = temp;
		}
	}

	return this;
};

/*
//TODO
Array2D.prototype.spliceRow = function(array, y) {
	this.__assert__.totalArgs.call(this, "spliceRow", [2], arguments);
	this.__assert__.areNumbers.call(this, "spliceRow", y);
	this.__assert__.typeOf.call(this, "spliceRow", array, Array);
	return this;
};

//TODO
Array2D.prototype.spliceCol = function(array, x) {
	this.__assert__.totalArgs.call(this, "spliceCol", [2], arguments);
	this.__assert__.areNumbers.call(this, "spliceCol", x);
	this.__assert__.typeOf.call(this, "spliceCol", array, Array);
	return this;
};
*/


/*
 * 2D Transformations
 */

//resize(_x)
//resize(_x, _y)
//resize(_x, _y, x_)
//resize(_x, _y, x_, y_)
Array2D.prototype.resize = function(_x, _y, x_, y_) {
	this.__assert__.totalArgs.call(this, "resize", [1,2,3,4], arguments);

	_x = (_x === undefined) || (isNaN(_x)) ? 0 : _x;
	_y = (_y === undefined) || (isNaN(_y)) ? 0 : _y;
	x_ = (x_ === undefined) || (isNaN(x_)) ? 0 : x_;
	y_ = (y_ === undefined) || (isNaN(y_)) ? 0 : y_;

	//compute new dimensions
	var nx = this.x + _x + x_;
	var ny = this.y + _y + y_;

	this.__assert__.validDimensions.call(this, "resize", nx, ny);

	//save a copy of this array, and rebuild for new dimensions
	var existingData = new Array2D(this);
	this.__build__(nx, ny, this.default_value);
	var _this = this; //because of callback function below

	existingData.forEach(function(v, x, y) {
		//destination coordinates
		var dx = x + x_;
		var dy = y + y_;
		if(_this.inBounds(dx, dy))
		{
			_this[dx][dy] = existingData[x][y];
		}
	});

	return this;
};

Array2D.prototype.crop = function(x, y, w, h) {
	this.__assert__.totalArgs.call(this, "crop", [4], arguments);
	this.__assert__.areNumbers.call(this, "crop", x, y, w, h);
	this.__assert__.inBounds.call(this, "crop", x, y, w, h);
	this.__assert__.validDimensions.call(this, "crop", w, h);

	this.resize((x+w)-this.x, (y+h)-this.y, -x, -y);

	return this;
};

//shift(x, y)
//shift(x, y, wrap)
Array2D.prototype.shift = function(x, y, wrap) {
	this.__assert__.totalArgs.call(this, "shift", [2,3], arguments);
	this.__assert__.areNumbers.call(this, "shift", x, y);

	wrap = (wrap === undefined) || (typeof wrap !== "boolean") ? true : wrap;

	if((x !== 0) && (y !== 0))
	{
		this.resize(-x, -y, x, y);
	}

	return this;
};

//rotate()
//rotate(clockwise)
Array2D.prototype.rotate = function(clockwise) {
	this.__assert__.totalArgs.call(this, "rotate", [0,1], arguments);

	clockwise = (clockwise === undefined) || (typeof clockwise !== "boolean") ? true : clockwise;

	//save a copy of this array, and rebuild for new dimensions
	var existingData = new Array2D(this);
	this.__build__(this.y, this.x, this.default_value);

	return this;
};

Array2D.prototype.invertX = function() {
	var _this = this;
	var existingData = new Array2D(this);
	existingData.forEach(function(v, x, y, a) {
		_this[x][y] = existingData[a.x - x - 1][y];
	});

	return this;
};

Array2D.prototype.invertY = function() {
	var _this = this;
	var existingData = new Array2D(this);
	existingData.forEach(function(v, x, y, a) {
		_this[x][y] = existingData[x][a.y - y - 1];
	});

	return this;
};

/*
 * Misc utilities
 */

//inBounds(x, y)
//inBounds(x, y, w, h)
Array2D.prototype.inBounds = function(x, y, w, h) {
	this.__assert__.totalArgs.call(this, "inBounds", [2,4], arguments);
	switch(arguments.length)
	{
		case 2:
			return (x >= 0) && (x < this.x) && (y >= 0) && (y < this.y);
		case 4:
			return this.inBounds(x, y) && this.inBounds(x+w-1, y+h-1);
	}
};

//log()
//log(renderFunction)
Array2D.prototype.log = function(renderFunction) {
	this.__assert__.totalArgs.call(this, "log", [0,1], arguments);

	if((renderFunction === undefined) || !(renderFunction instanceof Function))
	{
		renderFunction = function(data) { return data; }; //default render function
	}

	function genChars(c, l)
	{
		var str = "";
		for(var i = 0; i < l; i++) { str += c; }
		return str;
	}

	function padLeft(str, len)
	{
		var space = genChars(" ", len - str.length);
		str = space + str;
		return str;
	}

	function padRight(str, len)
	{
		var space = genChars(" ", len - str.length);
		str = str + space;
		return str;
	}

	var maxYWidth = String(this.y - 1).length;
	var maxElementWidth = 0;
	this.forEach(function(v) {
		var width = String(v).length;
		if(width > maxElementWidth)
		{
			maxElementWidth = width;
		}
	});

	var header = genChars(" ", maxYWidth + 1) + genChars("_", (maxElementWidth + 1) * this.x) + "_";
	console.log(header);

	for(var y = 0; y < this.y; y++)
	{
		var line = padLeft(String(y), maxYWidth) + "| ";
		for(var x = 0; x < this.x; x++)
		{
			var element = String(renderFunction(this[x][y], x, y, this));
			line += padRight(element, maxElementWidth + 1);
		}
		console.log(line);
	}
};

export default Array2D;