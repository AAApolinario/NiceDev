function _i18n(txt) {
	return txt;
}

function _(key) {
	var data = $.localize.data;

	var keys, value, _i, _len;
	keys = key.split(/\./);
	value = data;
	for (_i = 0, _len = keys.length; _i < _len; _i++) {
		key = keys[_i];
		value = value != null ? value[key] : null;
	}

	var args = Array.prototype.slice.call(arguments, 1);

	args.forEach(function (element, idx) {
        value = value.replace('{' + (idx) + '}', element);
    });

	return value;
}

function loadjscssfile(filename, filetype) {
    if (filetype == "js") { //if filename is a external JavaScript file
        var fileref = document.createElement('script')
        fileref.setAttribute("type", "text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype == "css") { //if filename is an external CSS file
        var fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}

function setCookie(c_name, value, exdays) {
    exdays = exdays == undefined ? 1 : exdays;
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value)
                    + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

newExcitingAlerts = (function () {

    window.focus();
    var oldTitle = document.title;
    var i = 0;
    var timeoutId;
    var blink = function () {

        document.title = document.title == '*' ? oldTitle : '*';

        var icon = 'favicon.ico';
        if (i % 2 == 0) {
            icon = 'faviconblink.ico';
        }
        (function () {
            var link = document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'shortcut icon';
            link.href = getPath() + icon;
            document.getElementsByTagName('head')[0].appendChild(link);
        }());
        i++;
    };
    var clear = function () {
        clearInterval(timeoutId);
        window.onmousemove = null;
        timeoutId = null;

        document.title = oldTitle;

        (function () {
            var link = document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'shortcut icon';
            link.href = getPath() + 'favicon.ico';
            document.getElementsByTagName('head')[0].appendChild(link);
        }());
    };
    return function () {
        if (!timeoutId) {
            timeoutId = setInterval(blink, 500);
            window.onmousemove = clear;
        }
    };
}());

if (!window.console) console = { 'log': function () { }, 'error': function () { }, 'warn': function () { } };

var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
		    val = String(val);
		    len = len || 2;
		    while (val.length < len) val = "0" + val;
		    return val;
		};

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
			    d: d,
			    dd: pad(d),
			    ddd: dF.i18n.dayNames[D],
			    dddd: dF.i18n.dayNames[D + 7],
			    m: m + 1,
			    mm: pad(m + 1),
			    mmm: dF.i18n.monthNames[m],
			    mmmm: dF.i18n.monthNames[m + 12],
			    yy: String(y).slice(2),
			    yyyy: y,
			    h: H % 12 || 12,
			    hh: pad(H % 12 || 12),
			    H: H,
			    HH: pad(H),
			    M: M,
			    MM: pad(M),
			    s: s,
			    ss: pad(s),
			    l: pad(L, 3),
			    L: pad(L > 99 ? Math.round(L / 10) : L),
			    t: H < 12 ? "a" : "p",
			    tt: H < 12 ? "am" : "pm",
			    T: H < 12 ? "A" : "P",
			    TT: H < 12 ? "AM" : "PM",
			    Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
			    o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
			    S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

function removeSpecialChars(chars) {
    var str = chars;
    str = str.replace(/à|á|â|ã|ä|å/g, "a");
    str = str.replace(/ò|ó|ô|õ|ö|ø/g, "o");
    str = str.replace(/è|é|ê|ë|ð/g, "e");
    str = str.replace("ç", "c");
    str = str.replace(/ì|í|î|ï/g, "i");
    str = str.replace(/ù|ú|û|ü/g, "u");
    str = str.replace("ñ", "n");
    str = str.replace("š", "s");
    str = str.replace(/ù|ú|û|ü/g, "u");
    str = str.replace(/ÿ|ý/g, "y");
    str = str.replace(/ž/g, "z");
    return str;
}

function escapeHtml(string) {

    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}

function validateEmail(email) {
    var emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

    if (!(email.search(emailRegEx) == -1)) {
        return true;
    }

    return false;
}

function eliminateDuplicates(arr) {
    var a = arr;
    var b = {};
    var c = [];
    for (var i = 0; i < a.length; i++) {
        b[a[i].Group + "" + a[i].MemberID] = a[i];
    }
    i = 0;
    for (var key in b) {
        c[i++] = b[key];
    }
    return c;
}

function compare(a, b) {

    //var search = $('#contactsSearch').val();
    var addressA = a.Name.toUpperCase();
    var addressB = b.Name.toUpperCase();

    if (addressA < addressB) {
        return -1;
    }
    if (addressA > addressB) {
        return 1;
    }
    return 0;
}