/*!
 * pjax(ajax + history.pushState) for jquery
 * 
 * by welefen
 */
(function($) {
	var Util = {
		support : {
			pjax : window.history && window.history.pushState && window.history.replaceState && !navigator.userAgent.match(/(iPod|iPhone|iPad|WebApps\/.+CFNetwork)/),
			storage : !!window.localStorage
		},
		toInt : function(obj) {
			return parseInt(obj);
		},
		stack : {},
		getTime : function() {
			return new Date * 1;
		},
		// èŽ·å–URLä¸å¸¦hashçš„éƒ¨åˆ†,åˆ‡åŽ»æŽ‰pjax=trueéƒ¨åˆ†
		getRealUrl : function(url) {
			url = (url || '').replace(/\#.*?$/, '');
			url = url.replace('?pjax=true', '').replace('&pjax=true', '');
			return url;
		},
		// èŽ·å–urlçš„hashéƒ¨åˆ†
		getUrlHash : function(url) {
			return url.replace(/^[^\#]*(?:\#(.*?))?$/, '$1');
		},
		// èŽ·å–æœ¬åœ°å­˜å‚¨çš„key
		getLocalKey : function(src) {
			var s = 'pjax_' + encodeURIComponent(src);
			return {
				data : s + '_data',
				time : s + '_time',
				title : s + '_title'
			};
		},
		// æ¸…é™¤æ‰€æœ‰çš„cache
		removeAllCache : function() {
			if (!Util.support.storage)
				return;
			for ( var name in localStorage) {
				if ((name.split('_') || [ '' ])[0] === 'pjax') {
					delete localStorage[name];
				}
			}
		},
		// èŽ·å–cache
		getCache : function(src, time, flag) {
			var item, vkey, tkey, tval;
			time = Util.toInt(time);
			if (src in Util.stack) {
				item = Util.stack[src], ctime = Util.getTime();
				if ((item.time + time * 1000) > ctime) {
					return item;
				} else {
					delete Util.stack[src];
				}
			} else if (flag && Util.support.storage) { // ä»ŽlocalStorageé‡ŒæŸ¥è¯¢
				var l = Util.getLocalKey(src);
				vkey = l.data;
				tkey = l.time;
				item = localStorage.getItem(vkey);
				if (item) {
					tval = Util.toInt(localStorage.getItem(tkey));
					if ((tval + time * 1000) > Util.getTime()) {
						return {
							data : item,
							title : localStorage.getItem(l.title)
						};
					} else {
						localStorage.removeItem(vkey);
						localStorage.removeItem(tkey);
						localStorage.removeItem(l.title);
					}
				}
			}
			return null;
		},
		// è®¾ç½®cache
		setCache : function(src, data, title, flag) {
			var time = Util.getTime(), key;
			Util.stack[src] = {
				data : data,
				title : title,
				time : time
			};
			if (flag && Util.support.storage) {
				key = Util.getLocalKey(src);
				localStorage.setItem(key.data, data);
				localStorage.setItem(key.time, time);
				localStorage.setItem(key.title, title);
			}
		},
		// æ¸…é™¤cache
		removeCache : function(src) {
			src = Util.getRealUrl(src || location.href);
			delete Util.stack[src];
			if (Util.support.storage) {
				var key = Util.getLocalKey(src);
				localStorage.removeItem(key.data);
				localStorage.removeItem(key.time);
				localStorage.removeItem(key.title);
			}
		}
	};
	// pjax
	var pjax = function(options) {
		options = $.extend({
			selector : '',
			container : '',
			callback : function() {},
			fitler : function() {}
		}, options);
		if (!options.container || !options.selector) {
			throw new Error('selector & container options must be set');
		}
		$('body').delegate(options.selector, 'click', function(event) {
			if (event.which > 1 || event.metaKey) {
				return true;
			}
			var $this = $(this), href = $this.attr('href');
			// è¿‡æ»¤
			if (typeof options.filter === 'function') {
				if (options.filter.call(this, href, this) === true){
					return true;
				}
			}
			if (href === location.href) {
				return true;
			}
			// åªæ˜¯hashä¸åŒ
			if (Util.getRealUrl(href) == Util.getRealUrl(location.href)) {
				var hash = Util.getUrlHash(href);
				if (hash) {
					location.hash = hash;
					options.callback && options.callback.call(this, {
						type : 'hash'
					});
				}
				return true;
			}
			event.preventDefault();
			options = $.extend(true, options, {
				url : href,
				element : this
			});
			// å‘èµ·è¯·æ±‚
			pjax.request(options);
		});
	};
	pjax.xhr = null;
	pjax.options = {};
	pjax.state = {};

	// é»˜è®¤é€‰é¡¹
	pjax.defaultOptions = {
		timeout : 2000,
		element : null,
		cache : 24 * 3600, // ç¼“å­˜æ—¶é—´, 0ä¸ºä¸ç¼“å­˜, å•ä½ä¸ºç§’
		storage : true, // æ˜¯å¦ä½¿ç”¨localstorageå°†æ•°æ®ä¿å­˜åˆ°æœ¬åœ°
		url : '', // é“¾æŽ¥åœ°å€
		push : true, // true is push, false is replace, null for do nothing
		show : '', // å±•ç¤ºçš„åŠ¨ç”»
		title : '', // æ ‡é¢˜
		titleSuffix : '',// æ ‡é¢˜åŽç¼€
		type : 'GET',
		data : {
			pjax : true
		},
		dataType : 'html',
		callback : null, // å›žè°ƒå‡½æ•°
		// for jquery
		beforeSend : function(xhr) {
			$(pjax.options.container).trigger('pjax.start', [ xhr, pjax.options ]);
			xhr && xhr.setRequestHeader('X-PJAX', true);
		},
		error : function() {
			pjax.options.callback && pjax.options.callback.call(pjax.options.element, {
				type : 'error'
			});
			location.href = pjax.options.url;
		},
		complete : function(xhr) {
			$(pjax.options.container).trigger('pjax.end', [ xhr, pjax.options ]);
		}
	};
	// å±•çŽ°åŠ¨ç”»
	pjax.showFx = {
		"_default" : function(data, callback, isCached) {
			this.html(data);
			callback && callback.call(this, data, isCached);
		},
		fade: function(data, callback, isCached){
			var $this = this;
			if(isCached){
				$this.html(data);
				callback && callback.call($this, data, isCached);
			}else{
				this.fadeOut(500, function(){
					$this.html(data).fadeIn(500, function(){
						callback && callback.call($this, data, isCached);
					});
				});
			}
		}
	}
	// å±•çŽ°å‡½æ•°
	pjax.showFn = function(showType, container, data, fn, isCached) {
		var fx = null;
		if (typeof showType === 'function') {
			fx = showType;
		} else {
			if (!(showType in pjax.showFx)) {
				showType = "_default";
			}
			fx = pjax.showFx[showType];
		}
		fx && fx.call(container, data, function() {
			var hash = location.hash;
			if (hash != '') {
				location.href = hash;
				//for FF
				if(/Firefox/.test(navigator.userAget)){
					history.replaceState($.extend({}, pjax.state, {
						url : null
					}), document.title);
				}
			} else {
				window.scrollTo(0, 0);
			}
			fn && fn.call(this, data, isCached);
		}, isCached);
	}
	// success callback
	pjax.success = function(data, isCached) {
		// isCached default is success
		if (isCached !== true) {
			isCached = false;
		}
		if ((data || '').indexOf('<html') != -1) {
			pjax.options.callback && pjax.options.callback.call(pjax.options.element, {
				type : 'error'
			});
			location.href = pjax.options.url;
			return false;
		}
		var title = pjax.options.title, el;
		if (!title) {
			var matches = data.match(/<title>(.*?)<\/title>/);
			if (matches) {
				title = matches[1];
			}
			if (!title && pjax.options.element) {
				el = $(pjax.options.element);
				title = el.attr('pjax-title') || el.text();
			}
		}
		if (title) {
			if (title.indexOf(pjax.options.titleSuffix) == -1) {
				title += pjax.options.titleSuffix;
			}
			document.title = title;
		}
		pjax.state = {
			container : pjax.options.container,
			timeout : pjax.options.timeout,
			cache : pjax.options.cache,
			storage : pjax.options.storage,
			show : pjax.options.show,
			title : title,
			url : pjax.options.oldUrl
		};
		var query = $.param(pjax.options.data);
		if (query != "") {
			pjax.state.url = pjax.options.url + (/\?/.test(pjax.options.url) ? "&" : "?") + query;
		}
		if (pjax.options.push) {
			if (!pjax.active) {
				history.replaceState($.extend({}, pjax.state, {
					url : null
				}), document.title);
				pjax.active = true;
			}
			history.pushState(pjax.state, document.title, pjax.options.oldUrl);
		} else if (pjax.options.push === false) {
			history.replaceState(pjax.state, document.title, pjax.options.oldUrl);
		}
		pjax.options.showFn && pjax.options.showFn(data, function() {
			pjax.options.callback && pjax.options.callback.call(pjax.options.element,{
				type : isCached? 'cache' : 'success'
			});
		}, isCached);
		// è®¾ç½®cache
		if (pjax.options.cache && !isCached) {
			Util.setCache(pjax.options.url, data, title, pjax.options.storage);
		}
	};

	// å‘é€è¯·æ±‚
	pjax.request = function(options) {
		options = $.extend(true, pjax.defaultOptions, options);
		var cache, container = $(options.container);
		options.oldUrl = options.url;
		options.url = Util.getRealUrl(options.url);
		if($(options.element).length){
			cache = Util.toInt($(options.element).attr('data-pjax-cache'));
			if (cache) {
				options.cache = cache;
			}
		}
		if (options.cache === true) {
			options.cache = 24 * 3600;
		}
		options.cache = Util.toInt(options.cache);
		// å¦‚æžœå°†ç¼“å­˜æ—¶é—´è®¾ä¸º0ï¼Œåˆ™å°†ä¹‹å‰çš„ç¼“å­˜ä¹Ÿæ¸…é™¤
		if (options.cache === 0) {
			Util.removeAllCache();
		}
		// å±•çŽ°å‡½æ•°
		if (!options.showFn) {
			options.showFn = function(data, fn, isCached) {
				pjax.showFn(options.show, container, data, fn, isCached);
			};
		}
		pjax.options = options;
		pjax.options.success = pjax.success;
		if (options.cache && (cache = Util.getCache(options.url, options.cache, options.storage))) {
			options.beforeSend();
			options.title = cache.title;
			pjax.success(cache.data, true);
			options.complete();
			return true;
		}
		if (pjax.xhr && pjax.xhr.readyState < 4) {
			pjax.xhr.onreadystatechange = $.noop;
			pjax.xhr.abort();
		}
		pjax.xhr = $.ajax(pjax.options);
	};

	// popstate event
	var popped = ('state' in window.history), initialURL = location.href;
	$(window).bind('popstate', function(event) {
		var initialPop = !popped && location.href == initialURL;
		popped = true;
		if (initialPop) return;
		var state = event.state;
		if (state && state.container) {
			if ($(state.container).length) {
				var data = {
					url : state.url || location.href,
					container : state.container,
					push : null,
					timeout : state.timeout,
					cache : state.cache,
					storage : state.storage
				};
				pjax.request(data);
			} else {
				window.location = location.href;
			}
		}
	});

	// not support
	if (!Util.support.pjax) {
		pjax = function() {
			return true;
		};
		pjax.request = function(options) {
			if (options && options.url) {
				location.href = options.url;
			}
		};
	}
	// pjax bind to $
	$.pjax = pjax;
	$.pjax.util = Util;

	// extra
	if ($.inArray('state', $.event.props) < 0) {
		$.event.props.push('state')
	}

})(jQuery);