////////////////////////////////////////////
// 
//   Countdown
//   v5.0
//   Sept. 3, 2014
//   www.gieson.com
//   Copyright Mike Gieson
// 
//////////////////////////////////////////////////////////////////////////////////////
//
// The MIT License (MIT)
// 
//////////////////////////////////////////////////////////////////////////////////////
//
// Copyright (c) 2014 Mike Gieson www.gieson.com
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
//////////////////////////////////////////////////////////////////////////////////////
// -----------------------------------------
//
// Usage:
// var test = new Countdown({time:15});
//
// -----------------------------------------
var CountdownImageFolder = "Content/countdown/"; // Should have trailing slash.
// NOTE: The countdown script assumes the folder is relative to the countdown.js script file.
// When CountdownImageFolder starts with a slash "/", or "http" the script will not assume the 
// folder is relative to the script and you can hard-code another folder on your site.
// Examples:
// var CountdownImageFolder = "/path/to/images/"; // Starts with a slash ( / ) as a shortcut to the root of your site.
// var CountdownImageFolder = "http://www.yoursite.com/path/to/images/";
var CountdownImageBasename = "flipper";
var CountdownImageExt = "png";
var CountdownImagePhysicalWidth = 41;
var CountdownImagePhysicalHeight = 60;

var CountdownWidth = 200;
var CountdownHeight = 30;

var CountdownLabels = {
    second: "SECONDS",
    minute: "MINUTES",
    hour: "HOURS",
    day: "DAYS",
    month: "MONTHS",
    year: "YEARS"
};

var CountdownInterval = 76;


////////////////////////////////////////////
//                                        //
//                 jbeeb                  //
//         version 0.0.0.3 alpha          //
//             www.jbeeb.com              //
//          Copyright Mike Gieson         //
//                                        //
////////////////////////////////////////////

if (!Array.prototype.indexOf) Array.prototype.indexOf = function (c) {
    if (this == null) throw new TypeError;
    var b = Object(this),
        a = b.length >>> 0;
    if (a === 0) return -1;
    var h = 0;
    arguments.length > 1 && (h = Number(arguments[1]), h != h ? h = 0 : h != 0 && h != Infinity && h != -Infinity && (h = (h > 0 || -1) * Math.floor(Math.abs(h))));
    if (h >= a) return -1;
    for (h = h >= 0 ? h : Math.max(a - Math.abs(h), 0) ; h < a; h++)
        if (h in b && b[h] === c) return h;
    return -1
};
if (!Function.prototype.bind) Function.prototype.bind = function (c) {
    if (typeof this !== "function") throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    var b = Array.prototype.slice.call(arguments, 1),
        a = this,
        h = function () { },
        e = function () {
            return a.apply(this instanceof h && c ? this : c, b.concat(Array.prototype.slice.call(arguments)))
        };
    h.prototype = this.prototype;
    e.prototype = new h;
    return e
};
this.jbeeb = this.jbeeb || {};
(function () {
    var c = function () { },
        b = Object.prototype.toString,
        a = String.prototype.trim;
    c.link = function (a, b, d) {
        var d = d || {},
            b = b || "_blank",
            f = [],
            c;
        for (c in d) c = c.toLowerCase(), c == "width" || c == "height" || c == "left" ? f.push(c + "=" + d[c]) : (c == "location" || c == "menubar" || c == "resizable" || c == "scrollbars" || c == "status" || c == "titlebar" || c == "toolbar") && f.push(c + "=1");
        d = null;
        f.length > 0 && (d = f.join(","));
        window.open(a, b, d)
    };
    c.isArray = function (a) {
        return Array.isArray ? Array.isArray(a) : b.call(a) === "[object Array]"
    };
    c.isEmpty = function (a) {
        var b =
            typeof a;
        if (b == "undefined") return true;
        if (a === null) return true;
        else if (b == "object") {
            if (a == {} || a == []) return true;
            var b = true,
                d;
            for (d in a)
                if (!c.isEmpty(a[d])) {
                    b = false;
                    break
                }
            return b
        } else return b == "string" && a == "" ? true : false
    };
    c.isNumber = function (a) {
        return b.call(a) === "[object Number]" && isFinite(a)
    };
    c.isInteger = function (a) {
        return parseFloat(a) == parseInt(a) && !isNaN(a) && isFinite(a)
    };
    c.isString = function (a) {
        return b.call(a) === "[object String]"
    };
    c.isNull = function (a) {
        return a === "" || a === null || a === void 0 || typeof a ==
            "undefined" || a == "undefined" || a == "null" ? true : false
    };
    c.clone = function (a) {
        if (a === null || typeof a != "object") return a;
        if (a.init) return a;
        else {
            var b = a.constructor;
            if (b) {
                var d = new b,
                    f;
                for (f in a) d[f] = c.clone(a[f])
            }
        }
        return d
    };
    c.sortOn = function (a, b) {
        if (!b || !a) return a;
        a.sort(function (a, h) {
            return a[b] < h[b] ? -1 : a[b] > h[b] ? 1 : 0
        })
    };
    c.arrayShuffle = function (a) {
        if (a) {
            for (var b = a.length, d, f; b;) f = Math.floor(Math.random() * b--), d = a[b], a[b] = a[f], a[f] = d;
            return a
        } else return []
    };
    c.arrayMove = function (a, b, d) {
        a.splice(d, 0, a.splice(b,
            1)[0])
    };
    c.arrayInsertAt = function (a, b, d) {
        Array.prototype.splice.apply(a, [b, 0].concat(d));
        return a
    };
    c.rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    c.trim = a && !a.call("\ufeff\u00a0") ? function (h) {
        return h == null ? "" : a.call(h)
    } : function (a) {
        return a == null ? "" : (a + "").replace(c.rtrim, "")
    };
    c.alphanumeric = function (a, b) {
        return b ? a.replace(/[^A-Za-z0-9]/g, "") : a.replace(/[^A-Za-z0-9_\-\.]/g, "")
    };
    c.parseJSON = function (a) {
        if (typeof a != "string") return null;
        try {
            return JSON.parse(a)
        } catch (b) {
            return a || null
        }
    };
    c.hexToRgb = function (a) {
        return !a ?
            "" : (a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a)) ? [parseInt(a[1], 16), parseInt(a[2], 16), parseInt(a[3], 16)] : [0, 0, 0]
    };
    c.makeColor = function (a, b) {
        if (!a) return "";
        var d = c.hexToRgb(a);
        return c.isNumber(b) && jbeeb.Browser.rgba ? (b > 1 && (b /= 100), "rgba(" + d.join(",") + ("," + b) + ")") : a
    };
    c.getXYWH = function (a) {
        var b = 0,
            d = 0,
            f = 0,
            c = 0;
        if (a) {
            for (var f = a.offsetWidth, c = a.offsetHeight, g = jbeeb.Browser.touch; a && !isNaN(a.offsetLeft) && !isNaN(a.offsetTop) ;) g ? (b += (a.offsetLeft || 0) - (a.scrollLeft || 0), d += (a.offsetTop || 0) - (a.scrollTop ||
                0)) : (b += a.offsetLeft || 0, d += a.offsetTop || 0), a = a.offsetParent;
            g && (a = window.scrollY != null ? window.scrollY : window.pageYOffset, b += window.scrollX != null ? window.scrollX : window.pageXOffset, d += a)
        }
        return {
            x: b,
            y: d,
            w: f,
            h: c,
            xMax: b + f,
            yMax: d + c
        }
    };
    c.getWindowSize = function () {
        var a = window,
            b = document,
            d = b.documentElement,
            b = b.getElementsByTagName("body")[0];
        return {
            w: a.innerWidth || d.clientWidth || b.clientWidth,
            h: a.innerHeight || d.clientHeight || b.clientHeight
        }
    };
    c.contains = function (a, b) {
        var d = {},
            f = {
                x: a.x,
                y: a.y,
                w: a.width,
                h: a.height
            },
            c = {
                x: b.x,
                y: b.y,
                w: b.width,
                h: b.height
            };
        f.xMax = f.x + f.w;
        f.yMax = f.y + f.h;
        c.xMax = c.x + c.w;
        c.yMax = c.y + c.h;
        for (var g in f) d[g] = f[g] >= c[g] ? true : false;
        return !d.x && !d.y && d.xMax && d.yMax ? true : false
    };
    c.getTimestamp = function () {
        var a = new Date;
        return Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds(), a.getMilliseconds()).valueOf()
    };
    c.bindEvent = function (a, b, d) {
        a.attachEvent ? a.attachEvent("on" + b, d) : a.addEventListener && a.addEventListener(b, d, false)
    };
    c.unbindEvent = function (a, b,
        d) {
        a.attachEvent ? a.detachEvent("on" + b, d) : a.addEventListener && a.removeEventListener(b, d, false)
    };
    c.getAttributes = function (a) {
        var b = {};
        if (a = a.attributes) {
            for (var d = a.length, f = 0; f < d; f++) jbeeb.Browser.ie ? a[f].specified && (b[a[f].nodeName] = a[f].nodeValue.toString()) : b[a[f].nodeName] = a[f].value ? a[f].value.toString() : a[f].nodeValue.toString();
            return b
        } else return {}
    };
    jbeeb.Utils = c
})();
this.jbeeb = this.jbeeb || {};
(function () {
    var c = function () {
        this.initialize()
    },
        b = c.prototype;
    c.initialize = function (a) {
        a.addEventListener = b.addEventListener;
        a.removeEventListener = b.removeEventListener;
        a.removeAllEventListeners = b.removeAllEventListeners;
        a.hasEventListener = b.hasEventListener;
        a.dispatchEvent = b.dispatchEvent
    };
    b._listeners = null;
    b.initialize = function () { };
    b.addEventListener = function (a, b, e, d) {
        var f = this._listeners;
        f ? this.removeEventListener(a, b, e) : f = this._listeners = {};
        var c = f[a];
        c || (c = f[a] = []);
        c.push({
            fn: b,
            arg: d,
            scope: e
        });
        return b
    };
    b.removeEventListener = function (a, b, e) {
        var d = this._listeners;
        if (d && (a = d[a]))
            for (d = a.length; d--;) {
                var c = a[d];
                c.scope == e && c.fn == b && a.splice(d, 1)
            }
    };
    b.removeAllEventListeners = function (a) {
        a ? this._listeners && delete this._listeners[a] : this._listeners = null
    };
    b.dispatchEvent = function (a) {
        var b = this._listeners;
        if (a && b && (b = b[a])) {
            var e = [].slice.call(arguments);
            e.splice(0, 1);
            for (var d = 0; d < b.length; d++) {
                var c = b[d];
                if (c.fn) {
                    var i = e,
                        g = c.arg;
                    typeof g !== "undefined" && i.push(g);
                    i.length ? c.scope ? c.fn.apply(c.scope,
                        i) : c.fn.apply(null, i) : c.scope ? c.fn.call(c.scope) : c.fn()
                }
            }
        }
    };
    b.hasEventListener = function (a) {
        var b = this._listeners;
        return !(!b || !b[a])
    };
    b.toString = function () {
        return "[EventDispatcher]"
    };
    if (!jbeeb.EventDispatcher) jbeeb.EventDispatcher = c
})();
this.jbeeb = this.jbeeb || {};
(function () {
    var c;
    if (!jbeeb.ready) jbeeb.ready = function () {
        var b, a, h = [],
            e, d = document,
            c = d.documentElement,
            i = c.doScroll,
            g = (i ? /^loaded|^c/ : /^loaded|c/).test(d.readyState);
        a = function (b) {
            try {
                b = d.getElementsByTagName("body")[0].appendChild(d.createElement("span")), b.parentNode.removeChild(b)
            } catch (e) {
                return setTimeout(function () {
                    a()
                }, 50)
            }
            for (g = 1; b = h.shift() ;) b()
        };
        d.addEventListener && (e = function () {
            d.removeEventListener("DOMContentLoaded", e, false);
            a()
        }, d.addEventListener("DOMContentLoaded", e, false), b = function (a) {
            g ?
                a() : h.push(a)
        });
        i && (e = function () {
            /^c/.test(d.readyState) && (d.detachEvent("onreadystatechange", e), a())
        }, d.attachEvent("onreadystatechange", e), b = function (a) {
            if (self != top) g ? a() : h.push(a);
            else {
                try {
                    c.doScroll("left")
                } catch (e) {
                    return setTimeout(function () {
                        b(a)
                    }, 50)
                }
                a()
            }
        });
        return b
    }()
})();
this.jbeeb = this.jbeeb || {};
(function () {
    function c() {
        return a && a.call(performance) || (new Date).getTime()
    }
    var b = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame,
        a = window.performance && (performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow),
        h = function (a) {
            this.init(a);
            return this
        },
        e = h.prototype;
    e.addEventListener = null;
    e.removeEventListener = null;
    e.removeAllEventListeners = null;
    e.dispatchEvent =
        null;
    e.hasEventListener = null;
    jbeeb.EventDispatcher.initialize(e);
    e._interval = 50;
    e._lastTime = 0;
    e._times = null;
    e._active = null;
    e._loopHandler = null;
    e._useRAF = false;
    e.state = 0;
    e.init = function (a) {
        a.fps ? (this._useRAF = a.animation && b || false, this._interval = 1E3 / (a.fps || 60)) : this._interval = a.interval || 50;
        a.startNow && this.start()
    };
    e.stop = function () {
        this.state = 0;
        this._setLoopHandler(this._handleStop)
    };
    e.getInterval = function () {
        return this._interval
    };
    e.setInterval = function (a) {
        this._interval = a
    };
    e.start = function () {
        if (!this.state) this.state =
            1, this._times = [], this._times.push(this._lastTime = c()), this._useRAF ? this._setLoopHandler(this._handleRAF) : this._setLoopHandler(this._handleTimeout), this._loop()
    };
    e.getFPS = function () {
        var a = this._times.length - 1;
        return a < 2 ? this._interval : 1E3 / ((this._times[0] - this._times[a]) / a)
    };
    e._handleRAF = function () {
        this._active = null;
        this._loop();
        c() - this._lastTime >= (this._interval - 1) * 0.97 && this._tick()
    };
    e._handleTimeout = function () {
        this._active = null;
        this._loop();
        this._tick()
    };
    e._handleStop = function () {
        this._active = null
    };
    e._loop = function () {
        if (this._active == null) this._useRAF ? (b(this._loopHandler), this._active = true) : (this._active && clearTimeout(this._active), this._active = setTimeout(this._loopHandler, this._interval))
    };
    e._setLoopHandler = function (a) {
        this._loopHandler = a.bind(this)
    };
    e._tick = function () {
        var a = c(),
            b = a - this._lastTime;
        this._lastTime = a;
        this.dispatchEvent("tick", {
            delta: b,
            time: a
        });
        for (this._times.unshift(a) ; this._times.length > 100;) this._times.pop()
    };
    e.toString = function () {
        return "[Ticker]"
    };
    if (!jbeeb.Ticker) jbeeb.Ticker =
        h
})();
this.jbeeb = this.jbeeb || {};
(function () {
    var c, b;
    if (!jbeeb.Browser) {
        var a = {
            ie: null,
            ios: null,
            mac: null,
            webkit: null,
            oldWebkit: false,
            flash: 0,
            touch: false
        };
        c = navigator.userAgent;
        c = c.toLowerCase();
        b = /(chrome)[ \/]([\w.]+)/.exec(c) || /(webkit)[ \/]([\w.]+)/.exec(c) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(c) || /(msie) ([\w.]+)/.exec(c) || c.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(c) || [];
        c = b[1] || "";
        b = b[2] || "0";
        a.version = parseFloat(b);
        a.agent = c;
        b = false;
        c == "chrome" ? b = true : c == "webkit" && (b = true);
        a.webkit = b;
        a.chrome = /chrome/.test(c) ||
            /chromium/.test(c);
        a.moz = /mozilla/.test(c);
        a.opera = /opera/.test(c);
        a.safari = /webkit/.test(c);
        a.ie = /msie/.test(c) && !/opera/.test(c);
        a.android = /android/.test(c);
        b = navigator.platform.toLowerCase();
        a.platform = b;
        a.ios = /iphone/.test(b) || /ipod/.test(b) || /ipad/.test(b);
        a.win = a.windows = b ? /win/.test(b) : /win/.test(c);
        a.mac = b ? /mac/.test(b) : /mac/.test(c);
        a.cssPrefix = "";
        if (a.chrome || a.safari)
            if (a.cssPrefix = "webkit", a.chrome && a.version < 10) a.oldWebkit = true;
            else {
                if (a.safari && a.version < 5.1) a.oldWebkit = true
            } else if (a.opera) a.cssPrefix =
            "o";
            else if (a.moz) a.cssPrefix = "moz";
            else if (a.ie && a.version > 8) a.cssPrefix = "ms";
        if (a.chrome || a.ios || a.android) a.flash = 0;
        c = false;
        b = "Webkit Moz O ms Khtml".split(" ");
        var h = "",
            h = document.createElement("div");
        h.style.animationName && (c = true);
        if (c === false)
            for (var e = 0; e < b.length; e++)
                if (h.style[b[e] + "AnimationName"] !== void 0) {
                    h = b[e];
                    h.toLowerCase();
                    c = true;
                    break
                }
        a.animation = c;
        a.modern = false;
        if (a.moz && a.version > 3) a.modern = true;
        if (a.opera && a.version > 9) a.modern = true;
        if (a.ie && a.version > 9) a.modern = true;
        if (a.chrome ||
            a.safari || a.ios || a.android) a.modern = true;
        a.rgba = true;
        a.quirks = document.compatMode == "CSS1Compat" ? false : true;
        if (a.ie)
            if (a.version < 9) a.rgba = false;
            else {
                if (a.quirks) a.rgba = false, a.version = 8, a.modern = false
            } else if (a.moz && a.version < 3) a.rgba = false;
            else if (a.safari && a.version < 3) a.rgba = false;
            else if (a.opera && a.version < 10) a.rgba = false;
        a.touch = typeof window.ontouchstart === "undefined" ? false : true;
        jbeeb.Browser = a
    }
})();
this.jbeeb = this.jbeeb || {};
(function () {
    jbeeb.PathInfo = function () {
        function c(a, b) {
            var h, k, o, p, v, z, n, m, q, s, r, w, t, y, a = a || "";
            k = a.replace(/\\/g, "/");
            k.match(/:\//) || (m = "", m = b ? d : f, m = c(m, false), k.substr(0, 1) == "/" ? k = m.host + (e ? "" : "/") + k : k.substr(0, 3) == "../" ? (m = m.parenturl.split("/"), k = k.split("../"), o = k.pop(), m.splice(m.length - k.length, k.length, o), k = m.join("/")) : k = m.pathurl + (e ? "" : "/") + k);
            k.substr(-1) == "/" && (k = k.substr(0, k.length - 1));
            h = k.split("://");
            k = h.shift();
            m = (h.shift() || "").replace("//", "/");
            m = m.split("/");
            o = m.shift() || "";
            o.indexOf("@") >
                -1 && (h = o.split("@"), t = h[0].split(":"), w = t[0], t = t[1], o = h[1]);
            o.indexOf(":") > -1 && (h = o.split(":"), p = h[1], o = h[0]);
            m = m.join("/");
            m.indexOf("#") != -1 && (h = m.split("#"), r = h[1], m = h[0]);
            m.indexOf("?") != -1 && (h = m.split("?"), s = h[1], m = h[0]);
            h = m.split("/");
            n = h.pop();
            m = h.join("/");
            n == ".." && (n = "");
            h = n.split(".");
            h.length > 1 && (z = h.pop().toLowerCase(), v = h.join("."));
            y = k + "://" + o + (p ? ":" + p : "");
            m = "/" + m + (m.length > 0 ? "/" : "");
            q = y + m;
            h = y + m + n + (s ? "?" + s : "") + (r ? "#" + r : "");
            var l = m,
                u = q;
            z ? (m += n, q += n) : (m += n + (n != "" ? "/" : ""), q += n + (n != "" ? "/" :
                ""), v = n, !s && !r && h.substr(-1) != "/" && (h += "/"));
            e === false && (l.substr(-1) == "/" && (l = l.substr(0, l.length - 1)), u.substr(-1) == "/" && (u = u.substr(0, u.length - 1)), z || (m.substr(-1) == "/" && (m = m.substr(0, m.length - 1)), q.substr(-1) == "/" && (q = q.substr(0, q.length - 1)), h.substr(-1) == "/" && (h = h.substr(0, h.length - 1))));
            return {
                source: a || null,
                url: h || null,
                protocol: k || null,
                domain: o || null,
                port: p || null,
                basename: v || null,
                ext: z || null,
                filename: n || null,
                path: m || null,
                pathurl: q || null,
                parent: l || null,
                parenturl: u || null,
                query: s || null,
                fragment: r ||
                    null,
                username: w || null,
                password: t || null,
                host: y || null
            }
        }

        function b(a) {
            return (a || "").split("?")[0].split("/").pop()
        }

        function a(a) {
            a = a.split("/");
            a.pop();
            return a.join("/").toString() + (a.length > 0 ? "/" : "")
        }

        function h(b) {
            var h = document.getElementsByTagName("script");
            return (h = h[h.length - 1].getAttribute("src")) ? b ? h.split("?")[0] : a(h.split("?")[0]) : ""
        }
        var e = true,
            d = h(),
            f = a(window.location.href);
        return {
            parse: c,
            filename: b,
            basename: function (a) {
                a = b(a).split(".");
                a.pop();
                return a.join(".")
            },
            basepath: a,
            scriptPath: d,
            getScriptPath: h,
            pagePath: f,
            ext: function (a) {
                return (a || "").split("?")[0].split("/").pop().split(".").pop().toLowerCase()
            }
        }
    }()
})();
this.jbeeb = this.jbeeb || {};
(function () {
    if (!jbeeb.Base) jbeeb.amReady = false, jbeeb.ticker = null, jbeeb.tickerInterval = 80, jbeeb.scriptPath = null, jbeeb.pagePath = "", jbeeb.assetsBasePath = "", jbeeb.focus = null, jbeeb.binit = 0;
    jbeeb.unfocus = function () {
        if (jbeeb.focus) {
            var b = jbeeb.focus;
            b.element && b.element.blur();
            jbeeb.focus = null
        }
    };
    var c = function () { };
    c._nextUID = 0;
    c._stages = [];
    c._readyList = [];
    c.scriptPath = null;
    c._getUID = function () {
        return "jbeeb_" + c._nextUID++
    };
    c._register = function (b) {
        c._readyList.push(b);
        jbeeb.amReady && c._readyListRun()
    };
    c._readyListRun =
        function () {
            var b = c._readyList.length;
            if (b > 0)
                for (; b--;) {
                    var a = c._readyList.splice(b, 1)[0];
                    a && a.init && a.init.call(a)
                }
        };
    c.init = function () {
        if (!jbeeb.amReady) {
            jbeeb.ticker = new jbeeb.Ticker({
                interval: jbeeb.tickerInterval,
                startNow: 1
            });
            if (!jbeeb.assetsBasePath) jbeeb.assetsBasePath = "";
            if (window.location.href.substr(0, 4) != "http") {
                if (!jbeeb.pagePath) jbeeb.pagePath = "";
                if (!jbeeb.scriptPath) jbeeb.scriptPath = ""
            } else {
                if (!jbeeb.pagePath) jbeeb.pagePath = jbeeb.PathInfo.pagePath;
                if (!jbeeb.scriptPath) jbeeb.scriptPath =
                    jbeeb.PathInfo.scriptPath
            }
            jbeeb.FlashDetect && jbeeb.FlashDetect.run();
            jbeeb.amReady = true;
            c._readyListRun()
        }
    };
    if (!jbeeb.Base) jbeeb.Base = c, jbeeb.register = c._register, jbeeb.getUID = c._getUID
})();
if (!jbeeb.binit) jbeeb.binit = 1, jbeeb.ready(function () {
    jbeeb.Base.init()
});
this.jbeeb = this.jbeeb || {};
(function () {
    var c = function (a) {
        this.init(a)
    },
        b = c.prototype;
    b.addEventListener = null;
    b.removeEventListener = null;
    b.removeAllEventListeners = null;
    b.dispatchEvent = null;
    b.hasEventListener = null;
    jbeeb.EventDispatcher.initialize(b);
    b.amStage = null;
    b.element = null;
    b.style = null;
    b._cssStore = null;
    b.alpha = 1;
    b.id = null;
    b.name = null;
    b.parent = null;
    b.stage = null;
    b.rotation = 0;
    b.scale = 1;
    b.scaleX = 1;
    b.scaleY = 1;
    b.stretchX = 1;
    b.stretchY = 1;
    b.skewX = 0;
    b.skewY = 0;
    b.origin = null;
    b.originX = 0;
    b.originY = 0;
    b.originType = "px";
    b.shadow = null;
    b.bevel = null;
    b.outline = null;
    b.inset = null;
    b.visible = true;
    b.overflow = "visible";
    b.autoCenter = null;
    b.x = 0;
    b.y = 0;
    b.width = 0;
    b.height = 0;
    b.flex = "wh";
    b._flexW = 1;
    b._flexH = 1;
    b.pin = null;
    b._pinX = null;
    b._pinY = null;
    b.z = 0;
    b.temp = null;
    b.rounded = null;
    b.fill = null;
    b.stroke = null;
    b.image = null;
    b.gradient = null;
    b._blockDisplay = null;
    b.init = function (a) {
        this.temp = {};
        this.style = null;
        this.alpha = 1;
        this.parent = this.name = this.id = null;
        this.rotation = 0;
        this.scaleY = this.scaleX = this.scale = 1;
        this.skewY = this.skewX = 0;
        this.visible = true;
        this.overflow =
            "visible";
        this.height = this.width = this.y = this.x = 0;
        this.flex = "wh";
        this._flexH = this._flexW = 1;
        this._pinY = this._pinX = this.pin = null;
        this.z = 0;
        this.autoCenter = null;
        this.stroke = {};
        this.fill = {};
        this.inset = this.shadow = null;
        this.gradient = {};
        this.rounded = null;
        this._cssStore = jbeeb.storeCSS ? {} : null;
        var a = a || {},
            b = jbeeb.getUID();
        this.id = b;
        if (a.element) this.element = a.element;
        else if (this.element = document.createElement("div"), this.element.id = b, this.element.style.position = "absolute", this.element.style.overflow = "visible",
            this._cssStore) this._cssStore.position = "absolute", this._cssStore.overflow = "visible";
        if (a.standalone) this.amStage = 1;
        this._blockDisplay = a.inline ? "inline-block" : "block";
        if (a.name) this.name = a.name;
        this.element.id = this.type + "_" + this.element.id;
        b = this.style = this.element.style;
        b.padding = "0px";
        b.margin = "0px";
        b.border = "0px";
        b.fontSize = "100%";
        b.verticalAlign = "baseline";
        b.outline = "0px";
        b.background = "transparent";
        b.WebkitTextSizeAdjust = "100%";
        b.msTextSizeAdjust = "100%";
        b.WebkitBoxSizing = b.MozBoxSizing = b.boxSizing =
            "padding-box";
        b.backgroundClip = "padding-box";
        if (this._cssStore) b = this._cssStore, b.padding = "0px", b.margin = "0px", b.border = "0px", b.fontSize = "100%", b.verticalAlign = "baseline", b.outline = "0px", b.background = "transparent", b.WebkitTextSizeAdjust = "100%", b.msTextSizeAdjust = "100%", b.boxSizing = "padding-box", b.backgroundClip = "padding-box";
        a.editable || this.setSelectable(false);
        this.setCursor("inherit");
        if (a) this.autoCenter = a.center, typeof a.flex != "undefined" && this.setFlex(a.flex), typeof a.pin != "undefined" && this.setPin(a.pin),
            typeof a.overflow != "undefined" && this.setOverflow(a.pin);
        this.setOrigin(0, 0, "px");
        this.applySkin(a, false)
    };
    b.setSelectable = function (a) {
        var b = this.style,
            e = "none",
            d = "-moz-none";
        a && (d = e = "text");
        b.userSelect = b.WebkitUserSelect = b.MozUserSelect = b.OUserSelect = e;
        b.MozUserSelect = d;
        if (this._cssStore) this._cssStore.userSelect = e, this._cssStore.MozUserSelect = d
    };
    b.setBorderRender = function (a) {
        var b = this.style,
            a = a == "outside" ? "content-box" : "border-box";
        b.WebkitBoxSizing = b.MozBoxSizing = b.boxSizing = a;
        if (this._cssStore) this._cssStore.boxSizing =
            a
    };
    b.applySkin = function (a, b) {
        this.stroke = {};
        this.fill = {};
        this.gradient = null;
        this.rounded = 0;
        this.inset = this.outline = this.bevel = this.shadow = this.image = null;
        if (!(b == true && b)) {
            var e = jbeeb.Utils.isNumber(a.x) ? a.x : 0,
                d = jbeeb.Utils.isNumber(a.y) ? a.y : 0;
            this.setXY(e, d);
            a.height && this.setHeight(a.height);
            a.width && this.setWidth(a.width);
            a.h && this.setHeight(a.h);
            a.w && this.setWidth(a.w)
        }
        this.setRounded(a.rounded);
        var e = a.fill,
            c, i;
        if (e) typeof e == "string" ? (c = e, i = 1) : (c = e.color, i = e.alpha);
        this.setFill(c, i);
        var e = a.stroke,
            g = d = i = c = null;
        e && (typeof e == "string" ? (c = e, d = i = 1, g = "solid") : e.color != null && (c = e.color || "#000000", i = jbeeb.Utils.isNumber(e.alpha) ? e.alpha : 1, d = e.weight || 1, g = e.style || "solid"));
        this.setStroke(d, c, i, g);
        this.setStrokeStyle(g);
        var e = a.image,
            j, k;
        if (a.image) typeof e == "string" ? (j = e, k = null) : (j = e.url, k = e.mode);
        this.setImage(j, k);
        this.setShadow(a.shadow);
        this.setBevel(a.bevel);
        this.setOutline(a.outline);
        this.setInset(a.inset)
    };
    b._applyBkgd = function () {
        var a = this.style;
        if (a) {
            var b = "",
                e = "",
                d = "",
                c = "",
                i = "",
                g = 0,
                j = this.fill;
            j && (jbeeb.Utils.isArray(j.color) ? g = 1 : j.color && (e = jbeeb.Utils.makeColor(j.color, j.alpha)));
            if (this.image && this.image.url) {
                b = 'url("' + this.image.url + '")';
                g = this.image.mode || "center";
                if (g != "pattern") {
                    if (g == "fit") d = "100% 100%";
                    else if (g == "contain" || g == "cover") d = "contain";
                    c = "no-repeat";
                    i = "center center"
                }
                g = 0
            }
            if (g) {
                g = j.color;
                if (this._cssStore) this._cssStore.gradient = 1;
                for (var j = j.alpha || "v", k = jbeeb.Browser, o = [], p = [], v = g.length, z = k.oldWebkit, n = 0; n < v; n += 3) {
                    var m = jbeeb.Utils.makeColor(g[n], g[n + 1]),
                        q = g[n + 2];
                    q > 100 ? q = 100 : q < 0 && (q = 0);
                    z ? p.push("color-stop(" + q + "%, " + m + ")") : o.push(m + " " + q + "%")
                }
                if (k.modern) b = k.cssPrefix, b == "" ? (b = "linear-", j = (j == "v" ? "to bottom, " : "to right, ") + o.join(",")) : b == "webkit" && z ? (g = p.join(","), b = "-webkit-", j = j == "v" ? "linear, left top, left bottom, " + g : "linear, left top, right top, " + g) : (b = "-" + b + "-linear-", j = (j == "v" ? "top, " : "left, ") + o.join(",")), b = b + "gradient(" + j + ")";
                else if (k.ie && k.version < 9) {
                    if (j = "progid:DXImageTransform.Microsoft.gradient( gradientType=" + (j == "v" ? "0" : "1") + ", startColorstr='" +
                        g[0] + "', endColorstr='" + g[g.length - 3] + "')", this.style.filter = j, this.style.msFilter = '"' + j + '"', this._cssStore) g = this._cssStore, g.filter = j, g.msFilter = '"' + j + '"'
                } else {
                    b = "";
                    for (n = 0; n < v; n += 3) jbeeb.Utils.makeColor(g[n], g[n + 1]), b += '<stop offset="' + g[n + 2] + '%" stop-color="' + g[n] + '" stop-opacity="' + g[n + 1] + '"/>';
                    g = "0";
                    o = "100";
                    j == "h" && (g = "100", o = "0");
                    j = "jbeeb-grad-" + this.id;
                    p = "";
                    p += '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1 1" preserveAspectRatio="none">';
                    p += '  <linearGradient id="' +
                        j + '" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="' + g + '%" y2="' + o + '%">';
                    p += b;
                    p += "  </linearGradient>";
                    p += '  <rect x="0" y="0" width="1" height="1" fill="url(#' + j + ')" />';
                    p += "</svg>";
                    b = 'url("data:image/svg+xml;base64,' + jbeeb.Base64.encode(p) + '")'
                }
            } else if (this._cssStore) this._cssStore.gradient = 0;
            a.backgroundColor = e || "";
            a.backgroundImage = b || "none";
            a.backgroundSize = d || "";
            a.backgroundRepeat = c || "";
            a.backgroundPosition = i || "";
            if (this._cssStore) g = this._cssStore, g.backgroundColor = e || "", g.backgroundImage =
                b || "none", g.backgroundSize = d || "", g.backgroundRepeat = c || "", g.backgroundPosition = i || ""
        }
    };
    b.setFill = function (a, b) {
        if (!this.fill) this.fill = {};
        this.fill.color = a;
        this.fill.alpha = b;
        this._applyBkgd()
    };
    b.setImage = function (a, b) {
        if (a) {
            if (!this.image) this.image = {};
            this.image.url = a;
            this.image.mode = b
        } else this.image = null;
        this._applyBkgd()
    };
    b.setImageSizing = function (a) {
        if (this.image) this.image.mode = a, this._applyBkgd()
    };
    b.setStroke = function (a, b, e, d) {
        if (!this.stroke) this.stroke = {};
        typeof a == "string" && (b = a, a = 1);
        a >
            0 && (a = Math.round(a));
        var c = e || 1,
            d = d || "solid";
        b == null && (d = c = a = null);
        e = this.stroke;
        e.weight = a;
        e.color = b;
        e.alpha = c;
        e.style = d;
        var i = this.style;
        a ? (e = a + "px", b = jbeeb.Utils.makeColor(b, c), c = -a + "px", a = -a + "px") : a = c = b = e = d = "";
        i.borderStyle = d;
        i.borderWidth = e;
        i.borderColor = b;
        i.marginLeft = c;
        i.marginTop = a;
        if (this._cssStore) i = this._cssStore, i.borderStyle = d, i.borderWidth = e, i.borderColor = b, i.marginLeft = c, i.marginTop = a;
        this._applyRounded()
    };
    b.setStrokeStyle = function (a) {
        a = a || "";
        this.style.borderStyle = a;
        if (this._cssStore) this._cssStore.borderStyle =
            a
    };
    b.setCursor = function (a) {
        this.style.cursor = a;
        if (this._cssStore) this._cssStore.cursor = a
    };
    b.setWidth = function (a) {
        var b = this.style;
        if (b && a > 0 && (this.width = a, b.width = a + "px", this.autoCenter && this.center(this.autoCenter), this.rounded && this._applyRounded(), this._cssStore)) this._cssStore.width = a + "px"
    };
    b.setHeight = function (a) {
        var b = this.style;
        if (b && a > 0 && (this.height = a, b.height = a + "px", this.autoCenter && this.center(this.autoCenter), this.rounded && this._applyRounded(), this._cssStore)) this._cssStore.height = a + "px"
    };
    b.measure = function () {
        var a = this.element,
            b = a.clientWidth,
            a = a.clientHeight;
        this.width = b;
        this.height = a;
        return [b, a]
    };
    b.setSize = function (a, b) {
        var e = this.style;
        if (e && a > 0 && b > 0 && (this.width = a, this.height = b, e.width = a + "px", e.height = b + "px", this.autoCenter && this.center(this.autoCenter), this.rounded && this._applyRounded(), this._cssStore)) this._cssStore.width = a + "px", this._cssStore.height = b + "px"
    };
    b.setXY = function (a, b) {
        this.x = a;
        this.y = b;
        var e = this.style;
        e.left = a + "px";
        e.top = b + "px";
        if (this._cssStore) this._cssStore.left =
            a + "px", this._cssStore.top = b + "px"
    };
    b.setBaseXY = function (a, b) {
        this.setXY(a, b);
        this._baseX = a;
        this._baseY = b
    };
    b.setXYWH = function (a, b, e, d) {
        this.width = e;
        this.height = d;
        this.x = a;
        this.y = b;
        var c = this.style;
        c.width = (e || 0) + "px";
        c.height = (d || 0) + "px";
        c.left = (a || 0) + "px";
        c.top = (b || 0) + "px";
        if (this._cssStore) c = this._cssStore, c.width = (e || 0) + "px", c.height = (d || 0) + "px", c.left = (a || 0) + "px", c.top = (b || 0) + "px"
    };
    b.setX = function (a) {
        this.x = a;
        this.style.left = (a || 0) + "px";
        if (this._cssStore) this._cssStore.left = (a || 0) + "px"
    };
    b.setY =
        function (a) {
            this.y = a;
            this.style.top = (a || 0) + "px";
            if (this._cssStore) this._cssStore.top = (a || 0) + "px"
        };
    b.setTop = function (a) {
        this.y = a;
        this.style.top = a + "px";
        if (this._cssStore) this._cssStore.top = (a || 0) + "px"
    };
    b.setBottom = function (a) {
        this.y = a - this.height;
        this.style.bottom = a + "px";
        if (this._cssStore) this._cssStore.bottom = (a || 0) + "px"
    };
    b.setLeft = function (a) {
        this.x = a;
        this.style.left = (a || 0) + "px";
        if (this._cssStore) this._cssStore.left = (a || 0) + "px"
    };
    b.setRight = function (a) {
        this.x = a = (a || 0) - this.width;
        this.style.right = a +
            "px";
        if (this._cssStore) this._cssStore.right = a + "px"
    };
    b.setZ = function (a) {
        a < 0 && (a = 0);
        this.z = a;
        var b = this.style;
        if (!b) this.style = b = this.element.style;
        b.zIndex = a;
        if (this._cssStore) this._cssStore.zIndex = a
    };
    b.setScale = function (a) {
        this.scaleY = this.scaleX = this.scale = a;
        this._doTransform("scale(" + a + "," + a + ")")
    };
    b.setScaleX = function (a) {
        this.scaleX = a;
        this._doTransform("scale(" + this.scaleX + "," + a + ")")
    };
    b.setScaleY = function (a) {
        this.scaleY = a;
        this._doTransform("scale(" + a + "," + this.scaleY + ")")
    };
    b.stretch = function (a, b) {
        this.stretchX =
            a;
        this.stretchY = b;
        if (a > 0 && b > 0) {
            this._flexW && this.setWidth(this.width * a);
            this._flexH && this.setHeight(this.height * b);
            var e = this.x,
                d = this.y;
            if (this._pinX) {
                if (this._pinX == "r" && this.parent) {
                    if (this._pinRightFirst == null) this._pinRightFirst = this.parent.width - this.x;
                    e = this.parent.width - this._pinRightFirst;
                    this.setX(e)
                }
            } else if (this.originX) {
                var c = this.originX;
                this.setX(c + (e - c) * a)
            } else this.setX(e * a); if (this._pinY) {
                if (this._pinY == "b" && this.parent) {
                    if (this._pinBottomFirst == null) this._pinBottomFirst = this.parent.height -
                        this.y;
                    e = this.parent.height - this._pinBottomFirst;
                    this.setY(e)
                }
            } else this.originY ? (c = this.originY, this.setY(c + (d - c) * b)) : this.setY(d * b)
        }
        this.dispatchEvent("stretch", this.width, this.height)
    };
    b._pinRightFirst = null;
    b._pinBottomFirst = null;
    b.setPin = function (a) {
        this.pin = a;
        this._pinY = this._pinX = 0;
        if (a) {
            a = a.toLowerCase();
            if (a.match(/r/)) this._pinX = "r";
            if (a.match(/l/)) this._pinX = "l";
            if (a.match(/t/)) this._pinY = "t";
            if (a.match(/b/)) this._pinY = "b";
            if (a.match(/s/)) this._pinY = this._pinX = "s"
        }
    };
    b.setFlex = function (a) {
        this._flexH =
            this._flexW = 0;
        if (a) a.toLowerCase(), this._flexW = a.match(/w/) ? 1 : 0, this._flexH = a.match(/h/) ? 1 : 0;
        this.flex = a
    };
    b.setRotation = function (a) {
        this.rotation = a;
        this._doTransform("rotate(" + a + "deg)")
    };
    b.setSkew = function (a, b) {
        this.skewX = a;
        this.skewY = b;
        this._doTransform("skew(" + a + "deg," + b + "deg)")
    };
    b.setOrigin = function (a, b, e) {
        this.originX = a;
        this.originY = b;
        e = (this.originType = e) ? e : "px";
        a = a + e + " " + b + e;
        b = this.style;
        b.transformOrigin = b.WebkitTransformOrigin = b.msTransformOrigin = b.MozTransformOrigin = b.OTransformOrigin = a;
        if (this._cssStore) this._cssStore.transformOrigin = a
    };
    b._doTransform = function (a) {
        var b = this.style;
        b.transform = b.transform = b.msTransform = b.WebkitTransform = b.MozTransform = a;
        if (this._cssStore) this._cssStore.transform = a
    };
    b.center = function (a) {
        if ((this.parent || this.amStage) && this.width && this.height) {
            var b = this.x,
                e = this.y,
                d, c;
            this.amStage ? (d = jbeeb.Utils.getXYWH(this.element.parentNode), c = d.w * 0.5, d = d.h * 0.5) : (d = this.parent, d.width || d.measure(), c = d.width * 0.5, d = d.height * 0.5);
            var i = this.width * 0.5,
                g = this.height *
                0.5;
            a == "v" ? e = d - g : a == "h" ? b = c - i : (b = c - i, e = d - g);
            this.setXY(b, e)
        }
    };
    b.setOverflow = function (a) {
        this.overflow = a;
        var b = "",
            e = "";
        if (a == "x" || a == "y" || !a) a == "x" ? (b = "auto", e = "hidden") : a == "y" && (b = "hidden", e = "auto", jbeeb.Browser.ie && this.setWidth(this.width + 20)), this.style.overflowX = b, this.style.overflowY = e;
        this.style.overflow = a;
        if (this._cssStore) {
            var c = this._cssStore;
            c.overflow = a;
            c.overflowX = b;
            c.overflowY = e
        }
    };
    b.setVisible = function (a) {
        this.visible = a;
        var b = this.style,
            a = a ? this._blockDisplay : "none";
        b.display = a;
        if (this._cssStore) this._cssStore.display =
            a
    };
    b.show = function () {
        this.setVisible(true)
    };
    b.hide = function () {
        this.setVisible(false)
    };
    b.setAlpha = function (a) {
        this.alpha = a;
        if (a !== null) this.style.opacity = "" + a;
        if (this._cssStore) this._cssStore.opacity = "" + a
    };
    b.setRounded = function (a) {
        this.rounded = a;
        this._applyRounded()
    };
    b._applyRounded = function () {
        var a = "",
            b = this.rounded;
        if (b) {
            var e = this.width,
                c = this.height,
                f = 0,
                i = this.stroke;
            if (i) i = i.weight, jbeeb.Utils.isNumber(i) && (f = i * 2);
            e = ((e < c ? e : c) + f) * 0.5;
            jbeeb.Utils.isNumber(b) ? a = e * b + "px" : b && typeof b == "object" && (a +=
                (e * b.tl || 0) + "px " + (e * b.tr || 0) + "px " + (e * b.br || 0) + "px " + (e * b.bl || 0) + "px")
        }
        b = this.style;
        b.borderRadius = b.MozBorderRadius = b.WebkitBorderRadius = b.OBorderRadius = b.msBorderRadius = a;
        if (this._cssStore) this._cssStore.borderRadius = a
    };
    b.onAdded = function () {
        this.autoCenter && this.center(this.autoCenter);
        this.dispatchEvent("added", this)
    };
    b.toFront = function () {
        this.parent && this.parent.toFront(this)
    };
    b.toBack = function () {
        this.parent && this.parent.toBack(this)
    };
    b._updateShadow = function () {
        var a = this.style,
            b = this._makeShadow(),
            e = this._makeBevel(),
            c = this._makeOutline(),
            f = this._makeInset(),
            i = "none";
        if (!(b == [] && e == [] && c == [] && f == [])) {
            for (var b = e.concat(c, f, b), e = b.length, c = [], f = [], g = 0, j = 0; j < e; j++) g == 0 ? b[j] == 1 && f.push("inset") : g < 4 ? f.push(b[j] + "px") : (f.push(jbeeb.Utils.makeColor(b[j], b[j + 1])), c.push(f.join(" ")), f = [], ++j, g = -1), g++;
            c.length > 0 && (i = c.join(","))
        }
        a.boxShadow = a.MozBoxShadow = a.WebkitBoxShadow = a.OBoxShadow = a.msBoxShadow = i;
        if (this._cssStore) this._cssStore.boxShadow = i
    };
    b._makeShadow = function () {
        var a = this.shadow;
        return a ? [0, a.x || 0, a.y || 0, a.s, a.c || "#000000", a.a || 0.4] : []
    };
    b.setShadow = function (a) {
        this.shadow = a;
        this._updateShadow()
    };
    b._makeInset = function () {
        var a = this.inset;
        return a ? [1, a.x || 0, a.y || 0, a.s, a.c || "#000000", a.a || 0.4] : []
    };
    b.setInset = function (a) {
        this.inset = a;
        this._updateShadow()
    };
    b._makeBevel = function () {
        var a = this.bevel;
        return a ? [1, -a.x, -a.y, a.s1, a.c1 || "#FFFFFF", a.a1, 1, a.x, a.y, a.s2, a.c2 || "#000000", a.a2] : []
    };
    b.setBevel = function (a) {
        if (a) jbeeb.Utils.isNumber(a) ? a = {
            x: -a,
            y: -a,
            s1: 0,
            s2: 0,
            c1: "#FFFFFF",
            c2: "#000000",
            a1: 1,
            a2: 1
        } : (a.c1 = a.c1 || "#FFFFFF", a.c2 = a.c2 || "#000000");
        this.bevel = a;
        this._updateShadow()
    };
    b._makeOutline = function () {
        if (this.outline) {
            var a = this.outline;
            return [0, -a.weight, -a.weight, a.spread || 0, a.color || "#000000", a.alpha || 1, 0, a.weight, -a.weight, a.spread || 0, a.color || "#000000", a.alpha || 1, 0, -a.weight, a.weight, a.spread || 0, a.color || "#000000", a.alpha || 1, 0, a.weight, a.weight, a.spread || 0, a.color || "#000000", a.alpha || 1]
        } else return []
    };
    b.setOutline = function (a) {
        this.outline = a;
        this._updateShadow()
    };
    b.setMouseEnabled =
        function (a) {
            a = a === 0 || a === false ? "none" : "auto";
            this.style.pointerEvents = a;
            if (this._cssStore) this._cssStore.pointerEvents = a
        };
    b._MEL = null;
    b.MELbubble = false;
    b.addMEL = function (a, b, e, c, f) {
        this.MELbubble = c;
        if (!this._MEL) this._MEL = new jbeeb.MouseEventListener(this);
        (a == "mouseOver" || a == "mouseOut" || a == "mouseMove") && this._MEL.enableMouseOver(1);
        this.addEventListener(a, b, e, f)
    };
    b.removeMEL = function (a, b) {
        this.removeEventListener(a, b);
        a == "mouseOver" && this._MEL.enableMouseOver(0)
    };
    b.setFloat = function (a) {
        this.style.position =
            "relative";
        this.style.left = "";
        this.style.top = "";
        this.style.cssFloat = a;
        this.style.display = "inline-block";
        if (this._cssStore) this._cssStore.position = "relative", this._cssStore.left = null, this._cssStore.top = null, this._cssStore.cssFloat = a, this._cssStore.display = "inline-block"
    };
    b.destroy = function () {
        this.removeAllEventListeners();
        if (this._MEL) this._MEL.destroy(), this._MEL = null;
        if (this.element && this.element.parentNode) this.element.parentNode.removeChild(this.element), this.element = null;
        if (this.parent) this.parent.removeChild(this),
            this.parent = null;
        this._cssStore = this.element = this.image = this.inset = this.shadow = this.outline = this.bevel = this.gradient = this.fill = this.stroke = this.temp = null
    };
    b.getCSS = function () {
        return this._cssStore
    };
    b.toString = function () {
        return "[Box (name=" + this.name + ")]"
    };
    b.type = "Box";
    jbeeb.Box = c
})();
this.jbeeb = this.jbeeb || {};
(function () {
    var c = function (a) {
        this.init(a)
    },
        b = c.prototype = new jbeeb.Box(null);
    b.textFit = null;
    b.text = "";
    b._previuosText = "";
    b.textSize = null;
    b.textColor = null;
    b.shadowText = null;
    b.bevelText = null;
    b.outlineText = null;
    b.insetText = null;
    b.font = null;
    b.align = null;
    b.textScale = null;
    b.selectable = null;
    b.bold = null;
    b.padding = null;
    b.editable = null;
    b._canEdit = null;
    b.multiline = null;
    b.baselineShift = null;
    b._BLScomp = null;
    b._keyboardHandler = null;
    b._suspendUpdate = false;
    b._TextBox_init = b.init;
    b.init = function (a) {
        if (a) {
            if (a.editable) {
                var b;
                b = a.multiline ? document.createElement("textarea") : document.createElement("input");
                this._canEdit = 1;
                b.id = jbeeb.getUID();
                b.style.position = "absolute";
                b.style.overflow = "visible";
                if (this._cssStore) this._cssStore.position = "absolute", this._cssStore.overflow = "visible";
                if (!a.multiline) b.type = "text";
                a.element = b
            }
            this._TextBox_init(a);
            a.element = null;
            b = this.style;
            b.textDecoration = "none";
            b.zoom = 1;
            b.size = a.h;
            this.text = a.text || "";
            if (this._cssStore) b = this._cssStore, b.fontSmooth = "always", b.WebkitFontSmoothing = "antialiased",
                b.textDecoration = "none", b.zoom = 1, b.size = a.h;
            this.applySkin(a, true)
        }
    };
    b._TextBox_applySkin = b.applySkin;
    b.applySkin = function (a, b) {
        this._suspendUpdate = true;
        if (a.editable) {
            var e = null;
            a.fill && (e = typeof a.fill == "object" ? a.fill.color : a.fill);
            a.stroke = a.stroke || e || {
                weight: 1,
                color: "#000000",
                alpha: 1
            }
        }
        this._TextBox_applySkin(a, b);
        this.textFit = a.textFit || null;
        this.font = a.font || "Arial, Helvetica, sans-serif";
        this.align = a.align || "left";
        this.textScale = a.textScale || 1;
        this.bold = a.bold || 0;
        this.selectable = a.selectable ||
            0;
        this.editable = a.editable || 0;
        this.multiline = a.multiline || 0;
        this.baselineShift = a.baselineShift || 0;
        if (!b) this.text = a.text || "";
        this._previuosText = "";
        this.textColor = {};
        if (a.textSize) this.textSize = a.textSize;
        a.editable == 1 && this.setEditable(1);
        this.setMultiline(this.multiline, true);
        this.setText(this.text);
        if (a.textColor) {
            var e = a.textColor,
                c = {};
            if (typeof e == "string") c = {
                color: e,
                alpha: 1
            };
            else if (c = e, !c.color) c.color = null, c.alpha = null;
            this.setTextColor(c.color || "#000000", c.alpha || 1)
        }
        if (a.shadowText) this.shadowText =
            a.shadowText;
        if (a.insetText) this.insetText = a.insetText;
        if (a.bevelText) this.bevelText = a.bevelText;
        if (a.outlineText) this.outlineText = a.outlineText;
        if (a.shadow) this.shadow = a.shadow;
        if (a.inset) this.insetText = a.inset;
        if (a.bevel) this.bevel = a.bevel;
        if (a.outline) this.outline = a.outline;
        a.padding && this.setPadding(a.padding);
        if (a.alphaNumeric) this.alphaNumeric = 1;
        if (a.numeric) this.numeric = 1;
        this.setBaselineShift(this.baselineShift);
        this._suspendUpdate = false;
        this._update();
        this._updateShadowText()
    };
    b.setMultiline =
        function (a) {
            this.multiline = a;
            var b = this.style;
            if (a) {
                if (!this.textSize) this.textSize = 12;
                a = "normal"
            } else a = "nowrap";
            b.whiteSpace = a;
            if (this._cssStore) this._cssStore.whiteSpace = a;
            this._fit()
        };
    b._canEdit = 0;
    b.setEditable = function (a) {
        a === 1 ? (this.amSM || this.setCursor("text"), this._keyboardHandler ? this._keyboardHandler.removeAllEventListeners() : this._keyboardHandler = new jbeeb.Keyboard(this.element), this._keyboardHandler.addEventListener("keydown", this.keyHandler, this), this._keyboardHandler.addEventListener("keyup",
            this.keyHandler, this), this.setOverflow("hidden"), jbeeb.Utils.bindEvent(this.element, "focus", this.setFocus.bind(this)), jbeeb.Utils.bindEvent(this.element, "blur", this._updateChange.bind(this)), this.addMEL("mouseUp", this.setFocus, this)) : (this.amSM || this.setCursor("default"), this._keyboardHandler && this._keyboardHandler.removeAllEventListeners(), jbeeb.Utils.unbindEvent(this.element, "focus", this.setFocus.bind(this)));
        this.editable = a
    };
    b.numeric = null;
    b.alphaNumeric = null;
    b.keyHandler = function (a, b, c) {
        var d =
            true;
        this.alphaNumeric ? d = this._keyboardHandler.alphaNumeric(b) : this.numeric && (d = this._keyboardHandler.numeric(b));
        if (this.multiline == 0 && (b == 108 || b == 13)) d = false, c == "keyup" && this.dispatchEvent("enter", this, this.text);
        b == 9 && (d = false, c == "keyup" && this.dispatchEvent("tab", this, this.text));
        d ? (this.text = this._canEdit && !this.multiline ? this.element.value : this._textNode.text, c == "keyup" && this.dispatchEvent("change", this, this.text)) : this._keyboardHandler.block(a)
    };
    b._updateChange = function () {
        this.dispatchEvent("change",
            this, this.text)
    };
    b.setPadding = function (a) {
        this.padding = a;
        var b;
        b = this._textNode ? this._textNode.style : this.style;
        var c = "",
            d = "",
            f = "",
            i = "";
        this.multiline ? (c = a + "px", d = a + "px", f = a + "px", i = a + "px") : this.align == "left" ? a && (c = a + "px") : this.align == "right" && a && (d = a + "px");
        b.paddingLeft = c;
        b.paddingRight = d;
        b.paddingTop = f;
        b.paddingBottom = i;
        if (this._cssStore) a = this._cssStore, a.paddingLeft = c, a.paddingRight = d, a.paddingTop = f, a.paddingBottom = i
    };
    b._format = function () {
        var a = this.font,
            b = this.textColor || {},
            b = jbeeb.Utils.makeColor(b.color,
                b.alpha),
            c = this.bold ? "bold" : "normal",
            d = this.style;
        d.fontFamily = a;
        d.color = b;
        d.textAlign = this.align;
        d.fontWeight = c;
        if (this._cssStore) d = this._cssStore, d.fontFamily = a, d.color = b, d.textAlign = this.align, d.fontWeight = c
    };
    b.setFont = function (a) {
        this.font = a;
        this.style.fontFamily = a;
        if (this._textNode) this._textNode.style.fontFamily = this.font;
        if (this._cssStore) this._cssStore.fontFamily = a;
        this._update()
    };
    b.setAlign = function (a) {
        this.align = a;
        this.style.textAlign = a;
        a == "center" && this.setPadding(0);
        if (this._cssStore) this._cssStore.textAlign =
            a
    };
    b.setBold = function (a) {
        this.bold = a ? "bold" : "";
        this.style.fontWeight = this.bold;
        if (this._cssStore) this._cssStore.fontWeight = this.bold;
        this._update()
    };
    b.setBaselineShift = function (a) {
        (this.baselineShift = a) ? a > 1 ? a = 1 : a < -1 && (a = -1) : a = 0;
        a *= -1;
        this._BLScomp = 1 + a;
        this._update()
    };
    b.measureText = function (a) {
        if (this.text || a) {
            var b = document.createElement("div");
            document.body.appendChild(b);
            var c = b.style;
            c.fontSize = this.height * this.textScale + "px";
            c.fontFamily = this.font;
            c.fontWeight = this.bold ? "bold" : "normal";
            c.position =
                "absolute";
            c.left = -1E3;
            c.top = -1E3;
            b.innerHTML = a || this.text;
            a = {
                w: b.clientWidth,
                h: b.clientHeight
            };
            document.body.removeChild(b);
            return a
        } else return 0
    };
    b.setTextColor = function (a, b) {
        if (!this.textColor) this.textColor = {};
        this.textColor.color = a;
        this.textColor.alpha = b;
        var c = jbeeb.Utils.makeColor(a, b);
        this.style.color = c;
        if (this._cssStore) this._cssStore.color = c
    };
    b.setText = function (a) {
        if (this.element) {
            this.text = a = a == "" || !a ? "" : String(a);
            if (this._canEdit && !this.multiline) this.element.value = a;
            else {
                if (!this._textNode) {
                    var b =
                        document.createElement("span");
                    b.style.fontFamily = this.font;
                    this.element.appendChild(b);
                    this._textNode = b
                }
                this._textNode.innerHTML = a
            }
            this._previuosText != a && this._update();
            this._previuosText = a
        }
    };
    b.selectAll = function () {
        if (this._canEdit) jbeeb.focus = this, this.element.focus(), this.element.select()
    };
    b._TextBox_setWidth = b.setWidth;
    b.setWidth = function (a) {
        a != this.width && (this._TextBox_setWidth(a), this._fit())
    };
    b._TextBox_setHeight = b.setHeight;
    b.setHeight = function (a) {
        a != this.height && (this._TextBox_setHeight(a),
            this._fit())
    };
    b._TextBox_setSize = b.setSize;
    b.setSize = function (a, b) {
        if (a != this.width || b != this.height) this._TextBox_setSize(a, b), this._fit()
    };
    b.setTextScale = function (a) {
        this.textScale = a || 1;
        this._fit()
    };
    b.setTextSize = function (a) {
        this.textSize = a;
        this._fit()
    };
    b.setTextFit = function (a) {
        this.textFit = a;
        this._fit()
    };
    b._TextBox_onAdded = b.onAdded;
    b.onAdded = function () {
        this._TextBox_onAdded();
        this._update()
    };
    b.setFocus = function () {
        jbeeb.focus = this;
        this.element.focus()
    };
    b._fit = function () {
        if (this.text != "") {
            var a =
                null,
                b = null,
                c = null;
            if (this.textSize) a = this.textSize, b = "1em", c = a + "px";
            else {
                var d = this.width,
                    f = this.height;
                if (d > 0 && f > 0)
                    if (this.textFit == "wh") a = d < f ? d : f, a = this.textScale > 0 ? a * this.textScale : a;
                    else if (this.textFit == "w") {
                        if (d = this.width / this.measureText().w / 2, jbeeb.Utils.isNumber(d) && d > 0) this.textScale = d, a = f * d
                    } else a = f * this.textScale;
                else a = 0
            }
            a && (b = this.height * this._BLScomp / a + "em", c = a + "px");
            a = this.style;
            a.lineHeight = b;
            a.fontSize = c;
            if (this._cssStore) this._cssStore.lineHeight = b, this._cssStore.fontSize = c
        }
    };
    b.getTextSize = function () {
        return this.style.fontSize || null
    };
    b._update = function () {
        this._suspendUpdate || (this._fit(), this._format())
    };
    b._updateShadowText = function () {
        var a = this._makeShadowText(),
            b = this._makeBevelText(),
            c = this._makeOutlineText(),
            d = this._makeInsetText(),
            f = "none";
        if (!(a == [] && b == [] && c == [] && d == [])) {
            for (var a = b.concat(c, a, d), b = a.length, c = [], d = [], i = 0, g = 0; g < b; g++) i == 0 ? a[g] == 1 && d.push("inset") : i < 4 ? d.push(a[g] + "px") : (d.push(jbeeb.Utils.makeColor(a[g], a[g + 1])), c.push(d.join(" ")), d = [], ++g, i = -1),
                i++;
            c.length > 0 && (f = c.join(","))
        }
        a = this.style;
        a.textShadow = a.MozTextShadow = a.WebkitTextShadow = a.OTextShadow = a.msTextShadow = f;
        if (this._cssStore) this._cssStore.textShadow = f
    };
    b._makeShadowText = function () {
        var a = this.shadowText;
        return a ? [0, a.x, a.y, a.s, a.c, a.a] : []
    };
    b.setShadowText = function (a) {
        this.shadowText = a;
        this._updateShadowText()
    };
    b._makeInsetText = function () {
        var a = this.insetText;
        return a ? [1, a.x, a.y, a.s, a.c, a.a] : []
    };
    b.setInsetText = function (a) {
        this.insetText = a;
        this._updateShadowText()
    };
    b._makeBevelText =
        function () {
            if (this.bevelText) {
                var a = this.bevelText,
                    b = [];
                a.c1 && a.a1 > 0 && (b = [0, -a.x, -a.y, a.s1, a.c1 || "#000000", a.a1]);
                a.c2 && a.a2 > 0 && (b = b.concat([0, a.x, a.y, a.s2, a.c2 || "#FFFFFF", a.a2]));
                return b
            } else return []
        };
    b.setBevelText = function (a) {
        this.bevelText = a;
        this._updateShadowText()
    };
    b._makeOutlineText = function () {
        if (this.outlineText) {
            var a = this.outlineText;
            return [0, -a.weight, -a.weight, a.spread || 0, a.color || "#000000", a.alpha, 0, a.weight, -a.weight, a.spread || 0, a.color || "#000000", a.alpha, 0, -a.weight, a.weight, a.spread ||
                0, a.color || "#000000", a.alpha, 0, a.weight, a.weight, a.spread || 0, a.color || "#000000", a.alpha
            ]
        } else return []
    };
    b.setOutlineText = function (a) {
        this.outlineText = a;
        this._updateShadowText()
    };
    b.toString = function () {
        return "[TextBox (name=" + this.name + ")]"
    };
    b.type = "TextBox";
    jbeeb.TextBox = c
})();
this.jbeeb = this.jbeeb || {};
(function () {
    var c = function (a) {
        this.init(a)
    },
        b = c.prototype = new jbeeb.Box(null);
    b._children = [];
    b.addChild = function (a) {
        if (a == null) return a;
        var b = arguments.length;
        if (b > 0)
            for (var c = 0; c < b; c++) {
                var d = arguments[c];
                d.parent && d.parent.removeChild(d);
                d.parent = this;
                d.stage = this.amStage == 1 ? this : this.stage;
                d.setZ(this._children.length);
                this.element.appendChild(d.element);
                d.onAdded && d.onAdded.call(d);
                this._children.push(d)
            }
    };
    b.removeChild = function (a) {
        var b = arguments.length;
        if (b > 1) {
            for (var c = true; b--;) c = c && this.removeChild(arguments[b]);
            return c
        }
        return this.removeChildAt(this._children.indexOf(a))
    };
    b.removeChildAt = function (a) {
        var b = arguments.length;
        if (b > 1) {
            for (var c = [], d = 0; d < b; d++) c[d] = arguments[d];
            c.sort(function (a, b) {
                return b - a
            });
            for (var f = true, d = 0; d < b; d++) f = f && this.removeChildAt(c[d]);
            return f
        }
        if (a < 0 || a > this._children.length - 1) return false;
        if (b = this._children[a]) b.element && b.element.parentNode && b.element.parentNode.removeChild(b.element), b.parent = null;
        this._children.splice(a, 1);
        this._consolidateZ();
        return true
    };
    b.removeAllChildren =
        function () {
            for (var a = this._children; a.length;) this.removeChildAt(0)
        };
    b._consolidateZ = function () {
        for (var a = this._children.length, b = 0; b < a; b++) {
            var c = this._children[b];
            c && c.setZ(b + 1)
        }
    };
    b.toFront = function (a) {
        if (a) {
            for (var b = this._children.length, c = 0, d = b; d--;)
                if (this._children[d] == a) {
                    c = d;
                    break
                }
            jbeeb.Utils.arrayMove(this._children, c, b - 1);
            this._consolidateZ()
        } else this.parent && this.parent.toFront(this)
    };
    b.toBack = function (a) {
        if (a) {
            for (var b = 0, c = this._children.length; c--;)
                if (this._children[c] == a) {
                    b = c;
                    break
                }
            jbeeb.Utils.arrayMove(this._children,
                b, 0);
            this._consolidateZ()
        } else this.parent && this.parent.toBack(this)
    };
    b._Container_init = b.init;
    b.init = function (a) {
        this._Container_init(a);
        if (a) this.stage = this.amStage == 1 ? this : this.stage, this._children = []
    };
    b._Container_stretch = b.stretch;
    b.stretch = function (a, b) {
        var c = a,
            d = b,
            f = this.flex;
        f && (f.match(/w/) || (c = 1), f.match(/h/) || (d = 1));
        for (f = this._children.length; f--;) {
            var i = this._children[f];
            i && i.stretch(c, d)
        }
        this._Container_stretch(a, b)
    };
    b._Container_setFlex = b.setFlex;
    b.setFlex = function (a) {
        for (var b = this._children.length; b--;) this._children[b].setFlex(a);
        this._Container_setFlex(a)
    };
    b._Container_destroy = b.destroy;
    b.destroy = function () {
        if (this._children)
            for (var a = this._children.length; a--;) this._children[a] && (this._children[a].destroy(), this.removeChild(this._children[a]), this._children[a] = null);
        this._children = null;
        this._Container_destroy()
    };
    b.destroyChildren = function () {
        if (this._children)
            for (var a = this._children.length; a--;) this._children[a] && (this._children[a].destroy(), this.removeChild(this._children[a]), this._children[a] = null);
        this._children.length =
            0;
        this._children = null;
        this._children = []
    };
    b.getChildren = function () {
        return this._children
    };
    b.toString = function () {
        return "[Container (name=" + this.name + ")]"
    };
    b.type = "Container";
    jbeeb.Container = c
})();
this.jbeeb = this.jbeeb || {};
(function () {
    var c = function (a) {
        this._configure(a);
        return this
    },
        b = c.prototype = new jbeeb.Container;
    b.amReady = null;
    b._readyList = null;
    b._configure = function (a) {
        if (a) {
            this.amReady = 0;
            if (a.onReady) this._readyList = [], this._readyList.push(a.onReady);
            this.id = jbeeb.getUID();
            if (a.stage) this.amStage = 0, this._Stage_init(a);
            else {
                this.amStage = 1;
                this.parent = this;
                this.stage = this;
                var b = a.target,
                    c = null,
                    d = 0;
                if (b) (c = typeof b == "string" ? document.getElementById(b) : b) ? c.nodeType === 1 ? (this.element = document.createElement("div"), this.element.id =
                    this.id, c.appendChild(this.element)) : d = 1 : d = 1;
                if (!b || d) document.write('<div id="' + this.id + '"></div>'), this.element = document.getElementById(this.id);
                a.element = this.element;
                this._Stage_init(a);
                this.style = this.element.style;
                this.style.position = "relative";
                this.style.display = a.inline === true || a.inline == "true" || a.inline === 1 ? "inline-block" : "block";
                this.style.verticalAlign = "top";
                this.style.clear = "both";
                this.style.zoom = 1;
                this.setSize(this.width || a.w || 1, this.height || a.h || 1);
                this.setOverflow(a.overflow || "visible");
                this.setCursor("default")
            }
            jbeeb.register(this)
        }
    };
    b._Stage_init = b.init;
    b.init = function () {
        var a = jbeeb.Utils.getXYWH(this.element);
        this.x = a.x;
        this.y = a.y;
        this.width = a.width;
        this.height = a.height;
        setTimeout(this._doReady.bind(this), 50)
    };
    b._doReady = function () {
        this.amReady = 1;
        if (this._readyList)
            for (var a = 0; a < this._readyList.length; a++) this._readyList.pop()()
    };
    b.onReady = function (a) {
        if (this.amReady) a();
        else {
            if (!this._readyList) this._readyList = [];
            this._readyList.push(a)
        }
    };
    b.toString = function () {
        return "[Stage (name=" +
            this.name + ")]"
    };
    b.type = "Stage";
    jbeeb.Stage = c
})();
this.jbeeb = this.jbeeb || {};
(function () {
    var c = function (a) {
        a = a || {};
        this._onComplete = a.onComplete;
        this._userTimezoneOffset = a.timezoneOffset || 0;
        this._digits = a.digits || 2;
        this._truncate = a.truncate || 0;
        this._rangeHi = c._kRange[a.rangeHi] ? c._kRange[a.rangeHi] : c._kYear;
        this._rangeLo = c._kRange[a.rangeLo] ? c._kRange[a.rangeLo] : c._kSecond;
        a.end && this._setTimeEnd(a.end);
        return this
    };
    c._MS_HOUR = 36E5;
    c._MS_DAY = 864E5;
    c._kMs = 0;
    c._kSecond = 1;
    c._kMinute = 2;
    c._kHour = 3;
    c._kDay = 4;
    c._kMonth = 5;
    c._kYear = 6;
    c._kRange = {
        ms: c._kMs,
        second: c._kSecond,
        minute: c._kMinute,
        hour: c._kHour,
        day: c._kDay,
        month: c._kMonth,
        year: c._kYear
    };
    var b = c.prototype;
    b._done = false;
    b._doneFired = false;
    b._onComplete = null;
    b._timeEnd = null;
    b._userTimezoneOffset = 0;
    b._digits = 0;
    b._rangeHi = c._kYear;
    b._rangeLo = c._kMs;
    b._truncate = 0;
    b._setTimeEnd = function (a) {
        var b = new Date;
        if (a instanceof Date) a = new Date(a.getTime());
        else if (typeof a == "object") {
            var b = a.year ? parseInt(a.year) : b.getFullYear(),
                e = a.month ? parseInt(a.month) - 1 : 0,
                d = a.day ? parseInt(a.day) : 0,
                f = a.hour ? parseInt(a.hour) : 0,
                i = a.minute ? parseInt(a.minute) :
                0,
                g = a.second ? parseInt(a.second) : 0,
                a = (a.ampm ? a.ampm : "am").toLowerCase();
            f < 12 && /p/.test(a) && (f += 12);
            a = new Date(b, e, d, f, i, g)
        } else a = new Date(b.getTime() + (parseInt(a) + 1) * 1E3);
        b = 0;
        this._userTimezoneOffset != 0 && (b += this._userTimezoneOffset * c._MS_HOUR);
        b != 0 && (a = a.getTime() + b, a = new Date(a));
        this._timeEnd = a;
        this._doneFired = this._done = false
    };
    b.update = function () {
        return this._calc(new Date)
    };
    b.diff = function (a, b) {
        b && this._setTimeEnd(b);
        return this._calc(a)
    };
    b._calc = function (a) {
        var b = 0,
            e = 0,
            d = 0,
            f = 0,
            i = 0,
            g = 0,
            j = 0,
            k =
            this._timeEnd,
            o = k.getTime() - a.getTime(),
            p = Math.floor,
            v = false;
        if (o > 0) {
            var z = c._MS_HOUR,
                n = this._rangeLo,
                m = this._rangeHi;
            this._truncate && (n = -1, m = 10);
            var q = c._kMs,
                s = c._kSecond,
                r = c._kMinute,
                w = c._kHour,
                t = c._kDay,
                y = c._kMonth,
                l = o / 1E3,
                u = l / 60,
                x = u / 60,
                B = x / 24;
            n < t && (m >= q && (b = p(m == q ? o : o % 1E3)), m >= s && (e = p(m == s ? l : l % 60)), m >= r && (d = p(m == r ? u : u % 60)), m >= w && (f = p(m == w ? x : x % 24)));
            o = a.getUTCFullYear();
            n = a.getUTCMonth();
            l = a.getUTCDate();
            q = k.getUTCFullYear();
            s = k.getUTCMonth();
            r = k.getUTCDate();
            w = l;
            u = 0;
            if (m >= t)
                if (m == t) i = p(B);
                else {
                    var i =
                        a.getUTCHours(),
                        t = a.getUTCMinutes(),
                        a = a.getUTCSeconds(),
                        B = k.getUTCHours(),
                        u = k.getUTCMinutes(),
                        A = k.getUTCSeconds(),
                        k = s + (s == n ? 0 : -1);
                    k < 0 && (k += 12);
                    x = c.getMonthDays(k, q);
                    x = x < l ? c.getMonthDays(k - 1, q) : x;
                    x = x < r ? r : x;
                    k = 0;
                    r > l ? k = r - l - 1 : r < l && (k = l - r - 1);
                    u = (c._MS_DAY - (a + t * 60 + i * 3600) * 1E3 + (A + u * 60 + B * 3600) * 1E3) / z;
                    u < 24 && l++;
                    l += k;
                    i = p((x - l + r + k) % x)
                }
            m >= y && (j = 0, g = (q - o) * 12, g < 0 || o == q && n == s ? g = 0 : (n++, s++, k = 0, s == n ? w <= r && k-- : s > n ? k = s - n - 1 : s < n && (k = 12 - n + s, j--), u < 24 && w++, n >= s && w > r ? k-- : s >= n && w <= r && k++, g += k, g < 0 && (g = 0), g > 11 && (j += p(g / 12), g %=
                12), m == y && (g += j * 12, j = 0)))
        } else v = true;
        b = {
            ms: b,
            second: e,
            minute: d,
            hour: f,
            day: i,
            month: g,
            year: j
        };
        c.pad(b, this._digits);
        if (v && !this._doneFired && this._onComplete) this._doneFired = this._done = true, this._onComplete(this._timeEnd);
        return b
    };
    c._daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    c.getMonthDays = function (a, b) {
        return a == 1 ? b % 400 == 0 || b % 4 == 0 && b % 100 != 0 ? 29 : 28 : c._daysInMonth[a]
    };
    c.pad = function (a, b) {
        if (b)
            for (var c in a) {
                for (var d = String(a[c]), f = c == "ms" ? 3 : b; d.length < f;) d = "0" + d;
                a[c] = d
            }
    };
    Object.defineProperty(b,
        "rangeHi", {
            get: function () {
                return this._rangeHi
            },
            set: function (a) {
                this._rangeHi = c._kRange[a] ? c._kRange[a] : c._kYear
            }
        });
    Object.defineProperty(b, "rangeLo", {
        get: function () {
            return this._rangeLo
        },
        set: function (a) {
            this._rangeLo = c._kRange[a] ? c._kRange[a] : c._kSecond
        }
    });
    jbeeb.TimeDiff = c
})();
var EXTRACT_START = 1,
    CountdownImageFolder = "images/",
    CountdownImageBasename = "flipper",
    CountdownImageExt = "png",
    CountdownImagePhysicalWidth = 41,
    CountdownImagePhysicalHeight = 60,
    CountdownWidth = 400,
    CountdownHeight = 60,
    CountdownLabels = {
        ms: "MS",
        second: "SECONDS",
        minute: "MINUTES",
        hour: "HOURS",
        day: "DAYS",
        month: "MONTHS",
        year: "YEARS"
    },
    CountdownInterval = 76,
    EXTRACT_END = 1;
(function () {
    var c = function (a) {
        this.imageFolder = CountdownImageFolder;
        this.imageBasename = CountdownImageBasename;
        this.imageExt = CountdownImageExt;
        this.imagePhysicalWidth = CountdownImagePhysicalWidth;
        this.imagePhysicalHeight = CountdownImagePhysicalHeight;
        this.totalFlipDigits = 2;
        this._params = a || {};
        var b, c, d, f;
        if (a.bkgd) {
            var i = a.bkgd;
            if (i.color) b = i.color;
            i.stroke && i.strokeColor && (c = {
                weight: i.stroke || 1,
                color: i.strokeColor,
                alpha: i.strokeAlpha
            });
            if (i.shadow) d = i.shadow;
            if (i.rounded) f = i.rounded
        }
        this._stage = new jbeeb.Stage({
            target: a.target,
            inline: a.inline || false,
            w: a.w || a.width || CountdownWidth,
            h: a.h || a.height || CountdownHeight,
            rounded: f || null,
            fill: b || null,
            stroke: c || null,
            shadow: d || null
        });
        jbeeb.register(this)
    },
        b = c.prototype;
    b._params = null;
    b._stage = null;
    b._done = false;
    b._onComplete = null;
    b.id = null;
    b._initDone = false;
    b._style = null;
    b.totalFlipDigits = null;
    b.imageFolder = null;
    b.imageBasename = "flipper";
    b.imageExt = "png";
    b._blocks = null;
    b._store = null;
    b._maxDisplayName = "second";
    b._hideLabels = false;
    b._labelText = null;
    b._hideLine = false;
    b._defaultBlockWidth =
        0;
    b._digitWidth = 0;
    b._blockSpacing = 0;
    b._doublePadding = 0;
    b._orderedBlockList = [];
    b._previousSizes = {};
    b._interval = 0;
    b._intervalCounter = 0;
    b._timeRunnerNow = null;
    b.init = function () {
        this.id = jbeeb.getUID();
        var a = this._params;
        this._initDone = this._done = false;
        this._style = a.style || "boring";
        this.width = a.w || a.width || CountdownWidth;
        this.height = a.h || a.height || CountdownHeight;
        this._onComplete = a.onComplete;
        this._hideLabels = a.hideLabels;
        this._hideLine = a.hideLine;
        this._labelText = a.labelText || CountdownLabels;
        this._interval =
            a.interval || CountdownInterval;
        this._intervalCounter = 0;
        this._timeRunnerNow = {
            year: 0,
            month: 0,
            day: 0,
            hour: 0,
            minute: 0,
            second: 0,
            ms: 0
        };
        var b = "";
        if (this._style == "flip") {
            b = "";
            if (this.imageFolder.substr(1) != "/" && this.imageFolder.substr(4) != "http") b = jbeeb.scriptPath, b != "" && b.substr(4) == "http" && b.substr(-1) != "/" && (b += "/");
            this.imageFolder.substr(-1) != "/" && (this.imageFolder += "/");
            b = b + this.imageFolder + this.imageBasename
        }
        this._store = {
            ms: {
                use: false,
                prev: [null, null],
                ani: [null, null],
                aniCount: [null, null]
            },
            second: {
                use: false,
                prev: [null, null],
                ani: [null, null],
                aniCount: [null, null]
            },
            minute: {
                use: false,
                prev: [null, null],
                ani: [null, null],
                aniCount: [null, null]
            },
            hour: {
                use: false,
                prev: [null, null],
                ani: [null, null],
                aniCount: [null, null]
            },
            day: {
                use: false,
                prev: [null, null],
                ani: [null, null],
                aniCount: [null, null]
            },
            month: {
                use: false,
                prev: [null, null],
                ani: [null, null],
                aniCount: [null, null]
            },
            year: {
                use: false,
                prev: [null, null],
                ani: [null, null],
                aniCount: [null, null]
            }
        };
        for (var c = "ms,second,minute,hour,day,month,year".split(","), d = a.rangeLo ? a.rangeLo : "second",
            f = a.rangeHi ? a.rangeHi : "year", d = d != "ms" && d.substr(-1) == "s" ? d.substr(0, d.length - 1) : d, f = f != "ms" && f.substr(-1) == "s" ? f.substr(0, f.length - 1) : f, i = d, g = f, j = 0; j < c.length; j++) {
            var k = c[j];
            k == d && (d = j);
            k == f && (f = j)
        }
        for (j = 0; j < c.length; j++)
            if (j >= d && j <= f) k = c[j], this._store[k].use = true, this._maxDisplayName = k;
        k = a.padding === 0 ? 0 : a.padding ? a.padding : this._style == "flip" ? 0 : 0.8;
        this._style == "flip" && (k /= 2);
        var o = this.height,
            d = this.width / (f - d + 1),
            f = this._hideLabels ? 0 : d * 0.25,
            p = d * 0.1,
            v = d - p,
            z = o - f,
            n = v * k;
        this._style == "flip" && (n = v *
            (k / this.totalFlipDigits));
        var m = v - n,
            q = this.height - f * 2;
        this._digitWidth = v / this.totalFlipDigits;
        this._blockSpacing = p;
        var s = 0;
        this._style == "flip" && (q = this.height - f, s = o * 0.03);
        this._defaultBlockWidth = v;
        this._digitWidth = m * this.totalFlipDigits;
        this._blockSpacing = p;
        this._doublePadding = n / 2 / this.totalFlipDigits / 2;
        var r = {
            font: "Arial, _sans",
            color: "#FFFFFF",
            weight: "normal",
            bkgd: this._style == "flip" ? null : {
                color: ["#000000", 1, 0, "#686868", 1, 50, "#000000", 1, 50, "#535050", 1, 100],
                alpha: "v"
            },
            rounded: this._style == "flip" ?
                null : 0.18,
            shadow: null
        },
            w = {
                font: "Arial, _sans",
                color: "#303030",
                weight: "bold",
                textScale: 1,
                offset: 0
            };
        if (a.numbers)
            for (var t in r) a.numbers[t] && (r[t] = a.numbers[t]);
        if (a.labels)
            for (t in w) a.labels[t] && (w[t] = a.labels[t]);
        c.reverse();
        this._blocks = {};
        this._orderedBlockList = [];
        for (j = t = 0; j < c.length; j++) {
            var y = c[j];
            if (this._store[y].use) {
                this._blocks[y] = new jbeeb.Container({
                    x: t + p / 2,
                    y: 0,
                    w: v,
                    h: z,
                    rounded: r.rounded || null,
                    fill: jbeeb.Utils.clone(r.bkgd) || null,
                    shadow: r.shadow || null
                });
                var l = this._blocks[y];
                l.store = {
                    name: y
                };
                this._previousSizes[y] = v;
                if (this._style == "flip") {
                    var u = this.imagePhysicalWidth * ((m - s * 2 - n * 2) / this.totalFlipDigits / this.imagePhysicalWidth),
                        x = this.imagePhysicalHeight * (q / this.imagePhysicalHeight);
                    l.time = new jbeeb.Container({
                        x: 0,
                        y: 0,
                        w: u * this.totalFlipDigits,
                        h: x
                    });
                    for (var B = [], A = 0; A < this.totalFlipDigits; A++) {
                        for (var C = new jbeeb.Container({
                            x: u * A + s * A,
                            y: 0,
                            w: u,
                            h: x
                        }), G = [], D = 0; D < 10; D++) {
                            for (var E = new jbeeb.Container({
                                x: 0,
                                y: 0,
                                w: u,
                                h: x
                            }), H = [], F = 0; F < 3; F++) {
                                var I = new jbeeb.Box({
                                    x: 0,
                                    y: 0,
                                    w: u,
                                    h: x,
                                    image: {
                                        url: b +
                                            ("" + D + "" + F) + "." + this.imageExt,
                                        mode: "fit"
                                    }
                                });
                                H[F] = I;
                                E.addChild(I)
                            }
                            E.img = H;
                            G[D] = E;
                            C.addChild(E)
                        }
                        C.num = G;
                        B[A] = C;
                        l.time.addChild(C)
                    }
                    l.time.slot = B;
                    l.addChild(l.time)
                } else if (l.time = new jbeeb.TextBox({
                        x: 0,
                        y: 0,
                        w: v,
                        h: z,
                        text: "00",
                        textScale: k,
                        font: r.font,
                        textColor: r.color,
                        align: "center"
                }), l.addChild(l.time), !this._hideLine) l.line = new jbeeb.Box({
                    x: 0,
                    y: 0,
                    w: v,
                    h: o * 0.03,
                    fill: "#000000"
                }), l.addChild(l.line), l.line.center();
                this._stage.addChild(l);
                if (!this._hideLabels) l.labels = new jbeeb.TextBox({
                    x: t,
                    y: o - f * 0.7 + w.offset,
                    w: d,
                    h: f * 0.7,
                    font: w.font,
                    textScale: w.textScale,
                    textColor: w.color,
                    bold: 1,
                    align: "center",
                    text: this._labelText[y]
                }), this._stage.addChild(l.labels);
                this._orderedBlockList.push(l);
                l.time.center();
                a.numberMarginTop && l.time.setY(a.numberMarginTop);
                t += d
            }
        }
        l = this._blocks;
        this._style == "flip" ? (l.year && this._flipRunner("year", "00"), l.month && this._flipRunner("month", "00"), l.day && this._flipRunner("day", "00"), l.hour && this._flipRunner("hour", "00"), l.minute && this._flipRunner("minute", "00"), l.second && this._flipRunner("second",
            "00"), l.ms && this._flipRunner("ms", "000")) : (l.year && l.year.time.setText("00"), l.month && l.month.time.setText("00"), l.day && l.day.time.setText("00"), l.hour && l.hour.time.setText("00"), l.minute && l.minute.time.setText("00"), l.second && l.second.time.setText("00"), l.ms && l.ms.time.setText("000"), this._reformat());
        this._timediff = new jbeeb.TimeDiff({
            end: a.time ? a.time : {
                year: a.year || a.years,
                month: a.month || a.months,
                day: a.day || a.days,
                hour: a.hour || a.hours,
                minute: a.minute || a.minutes,
                second: a.second || a.seconds,
                ms: a.second ||
                    a.ms,
                ampm: a.ampm || ""
            },
            rangeHi: g,
            rangeLo: i,
            timezoneOffset: a.offset || 0,
            onComplete: this._doWhenDone.bind(this),
            truncate: a.truncate || 0
        });
        this._initDone = true;
        jbeeb.ticker.addEventListener("tick", this.tick, this)
    };
    b.tick = function () {
        this._initDone === true && this._timeRunner()
    };
    b._doWhenDone = function (a) {
        this._onComplete && this._onComplete(a)
    };
    b._calcSize = function (a) {
        return a.toString().length * this._digitWidth
    };
    b._reformat = function () {
        for (var a = false, b = 0; b < this._orderedBlockList.length; b++) {
            var c = this._orderedBlockList[b],
                d = c.store.name,
                f = c.time.text,
                f = this._calcSize(f);
            f >= this._defaultBlockWidth && f != this._previousSizes[d] && (c.setWidth(f + this._doublePadding), this._previousSizes[d] = f + this._doublePadding, a = true)
        }
        if (a)
            for (b = a = 0; b < this._orderedBlockList.length; b++) c = this._orderedBlockList[b], f = c.time.text, this._calcSize(f), c.setX(a), c.time.setWidth(c.width), c.time.center(), c.labels && (c.labels.setX(a), c.labels.setWidth(c.width)), c.line && (c.line.setWidth(c.width), c.line.center()), a += c.width + this._blockSpacing
    };
    b._timeRunner =
        function () {
            this._intervalCounter += jbeeb.ticker.getInterval();
            if (this._intervalCounter > this._interval) this._timeRunnerNow = this._timediff.update(), this._intervalCounter = 0;
            var a = this._blocks,
                b = this._timeRunnerNow;
            this._style == "flip" ? (a.year && this._flipRunner("year", b.year), a.month && this._flipRunner("month", b.month), a.day && this._flipRunner("day", b.day), a.hour && this._flipRunner("hour", b.hour), a.minute && this._flipRunner("minute", b.minute), a.second && this._flipRunner("second", b.second), a.ms && this._flipRunner("ms",
                b.ms)) : (a.year && a.year.time.setText(b.year), a.month && a.month.time.setText(b.month), a.day && a.day.time.setText(b.day), a.hour && a.hour.time.setText(b.hour), a.minute && a.minute.time.setText(b.minute), a.second && a.second.time.setText(b.second), a.ms && a.ms.time.setText(b.ms), this._reformat())
        };
    b._flipRunner = function (a, b) {
        for (var c = 0; c < this.totalFlipDigits; c++) {
            var d = this._blocks[a].time.slot[c],
                f = this._store[a],
                i = String(b).substr(c, 1),
                g = d.num[i];
            if (g) {
                if (f.prev[c] != i) {
                    for (var j = 0; j < 10; j++) d.num[j].hide();
                    g.show();
                    f.ani[c] = true;
                    f.aniCount[c] = 0
                }
                if (f.ani[c]) {
                    for (j = 0; j < 3; j++) g.img[j].hide();
                    this._done ? g.img[2].show() : (g.img[f.aniCount[c]].show(), f.aniCount[c]++, f.aniCount[c] > 2 && (f.ani[c] = false))
                }
                f.prev[c] = i
            }
        }
    };
    window.Countdown = c
})();