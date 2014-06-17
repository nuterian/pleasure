Element.prototype.hide = function() { this.style.display = 'none' };
Element.prototype.show = function() { this.style.display = '' };
Element.prototype.on = function(event, callback){ this.addEventListener(event, callback) }
Element.prototype.off = function(event, callback){ this.removeEventListener(event, callback) }
Element.prototype.find = function(selector) { return this.querySelector(selector) };

_el = function(id) { return document.getElementById(id) }
_extend = function(obj) {
	Array.prototype.slice.call(arguments, 1).forEach(function(source) {
	  if (source) {
	    for (var prop in source) {
	      obj[prop] = source[prop];
	    }
	  }
	});
	return obj;
};
_isFunction = function(obj) { return typeof obj === 'function' };

var slice = Array.prototype.slice;

var _each = function(obj, iterator, context) {
    if (obj == null) return obj;
    if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
    return obj;
};

var _bind = function(func, context) {
    var args, bound;
    if (Function.prototype.bind && func.bind === Function.prototype.bind) return Function.prototype.bind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
};
var _bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error('bindAll must be passed function names');
    _each(funcs, function(f) { obj[f] = _bind(obj[f], obj); });
    return obj;
};

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();

var View = Class.extend({

	events: {},

	init: function(options){
		options || (options = {});
		_extend(this, options);
		if(!this.el) this.el = _el(this.id);
		this.bind();
    //_bindAll(this, 'render', 'post_render', 'show', 'hide');
	},

	render: function(){},
	post_render: function(){},

	show: function(){ this.render(); this.el.show(); },
	hide: function() { this.post_render(); this.el.hide() } ,
	on: function(event, callback) { this.el.on(event, callback) },
  off: function(event, callback) { this.el.off(event, callback) },

	bind: function(){
    	var eventSplitter = /^(\S+)\s*(.*)$/;
    	for(var key in this.events){
    		var method = this.events[key];
	        if (!_isFunction(method)) method = this[this.events[key]];
	        if (!method) continue;
            method = method.bind(this);
	        var match = key.match(eventSplitter);
	        var eventName = match[1], selector = match[2];
	        if (selector === '') {
	            this.el.on(eventName, method);
	        } else {
                this.el.querySelector(selector).on(eventName, method);
	        }
    	}
    }
});

