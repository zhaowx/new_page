(function(win, $) {
	if (win.slide === undefined) {
		win.slide = function(o) {
			return (this instanceof slide) ? this.init.apply(this, arguments) : new slide(o)
		}
	}
	var slide = win.slide;
	var defaults = {
		id: ".slide",
		init: 5,
		min: 0,
		max: 100,
		width: 200,
		fixed: 0
	};
	slide.prototype = {
		init: function(o) {
			this.options = $.extend({},
			defaults, o || {});
			var options = this.options,
			self = this,
			con = $(options.id);
			con.each(function(i) {
				var _this = $(this),
				line = $('<span class="slide_line"></span>').appendTo(_this),
				cursor = $('<input type="button" class="slide_cursor" />').appendTo(_this),
				__x;
				_this.width(_this.attr("width") || options.width + 10);
				_this.data("data", {
					min: _this.attr("min") || options.min,
					max: _this.attr("max") || options.max,
					init: _this.attr("init") || options.init,
					width: _this.width() - 10,
					fixed: _this.attr("fixed") || options.fixed
				});
				if (_this.data("data").init > _this.data("data").max) {
					_this.data("data").init = _this.data("data").max
				}
				_this.data("data").pro = (_this.data("data").max - _this.data("data").min) / _this.data("data").width;
				_this.data("data").cursor = cursor;
				_this.trigger('change');
				
				self.setValue(this, _this.data("data").init);
				cursor.bind("mousedown.slide",
				function(e) {
					var ele = $(this),
					left = parseInt(ele.css("left"));
					__x = e.pageX;
					$(document).bind("mousemove.slide",
					function(e) {
						var __d = e.pageX - __x,
						__left = left + __d;
						if (__left >= 0 && __left <= _this.width() - 10) {
							//ele.css("left", __left);
							ele.css("left",  __left * _this.data("data").pro+'%');
							self.changeValue(_this[0], __left * _this.data("data").pro)
						}
					}).bind("mouseup.slide",
					function(e) {
						$(document).unbind(".slide")
					})
				}).bind("focus",
				function() {
					this.blur()
				});
				_this.bind("click.slide",
				function(e) {
					var left = parseInt(cursor.css("left")) + (e.pageX - cursor.offset().left);
					if (left >= 0 && left <= _this.width() - 10) {
						//cursor.css("left", left);
						cursor.css("left",  left * _this.data("data").pro+'%');
						self.changeValue(_this[0], left * _this.data("data").pro)
					}
					if (left < 0) {
						cursor.css("left", 0);
						self.changeValue(_this[0], 0 * _this.data("data").pro)
					}
					if (left > _this.width() - 10) {
						cursor.css("left", _this.width() - 10);
						self.changeValue(_this[0], (_this.width() - 10) * _this.data("data").pro)
					}
				})
			})
		},
		setValue: function(elm, val) {
			var _this = $(elm);
			this.changeValue(elm, val);
			_this.data("data").cursor.css("left", val / _this.data("data").pro)
		},
		changeValue: function(elm, val) {
			var _this = $(elm),
			val = Number(val).toFixed(_this.data("data").fixed);
			_this.data("data").value = val;
			_this[0].value = val;
			_this.trigger('change');
			//_this[0].onChange.call(_this[0])
		},
		getValue: function(elm, val) {
			var _this = $(elm);
			return _this.data("data").value
		}
	}
})(window, jQuery); 

jQuery(function(a) {
	window.bar = slide()
});