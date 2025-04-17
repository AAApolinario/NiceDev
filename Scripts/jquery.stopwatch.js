(function( $ ){

    function incrementer(ct, increment) {
        return function() { ct+=increment; return ct; };
    }
    
    function pad2(number) {
         return (number < 10 ? '0' : '') + number;
    }

    function defaultFormatMilliseconds(millis) {
        var x, seconds, minutes, hours;
        x = millis / 1000;
        seconds = Math.floor(x % 60);
        x /= 60;
        minutes = Math.floor(x % 60);
        x /= 60;
        hours = Math.floor(x % 24);
        // x /= 24;
        // days = Math.floor(x);
        return [pad2(hours), pad2(minutes), pad2(seconds)].join(':');
    }

    //NOTE: This is a the 'lazy func def' pattern described at http://michaux.ca/articles/lazy-function-definition-pattern
    function formatMilliseconds(millis, data) {
        // Use jintervals if available, else default formatter
        var formatter;
        if (typeof jintervals == 'function') {
            formatter = function(millis, data){return jintervals(millis/1000, data.format);};
        } else {
            formatter = defaultFormatMilliseconds;
        }
        formatMilliseconds = function(millis, data) {
            return formatter(millis, data);
        };
        return formatMilliseconds(millis, data);
    }

    var methods = {
        
        init: function(options) {
            var defaults = {
                updateInterval: 1000,
                startTime: 0,
                format: '{HH}:{MM}:{SS}',
                formatter: formatMilliseconds
            };
            
            // if (options) { $.extend(settings, options); }
            
            return this.each(function() {
                var $this = $(this),
                    data = $this.data('stopwatch');
                
                // If the plugin hasn't been initialized yet
                if (!data) {
                    // Setup the stopwatch data
                    var settings = $.extend({}, defaults, options);
                    data = settings;
                    data.active = false;
                    data.target = $this;
                    data.elapsed = settings.startTime;
                    // create counter
                    data.incrementer = incrementer(data.startTime, data.updateInterval);
                    data.tick_function = function() {
                        var millis = data.incrementer();
                        data.elapsed = millis;
                        data.target.trigger('tick.stopwatch', [millis]);
                        data.target.stopwatch('render');
                    };
                    $this.data('stopwatch', data);
                }
                
            });
        },
        
        start: function() {
            return this.each(function() {
                var $this = $(this),
                    data = $this.data('stopwatch');
                // Mark as active
                data.active = true;
                data.timerID = setInterval(data.tick_function, data.updateInterval);
                $this.data('stopwatch', data);
            });
        },
        
        stop: function() {
            return this.each(function() {
                var $this = $(this),
                    data = $this.data('stopwatch');
                clearInterval(data.timerID);
                data.active = false;
                $this.data('stopwatch', data);
            });
        },
        
        destroy: function() {
            return this.each(function(){
                var $this = $(this),
                    data = $this.data('stopwatch');
                $this.stopwatch('stop').unbind('.stopwatch').removeData('stopwatch');
            });
        },
        
        render: function() {
            var $this = $(this),
                data = $this.data('stopwatch');
            $this.html(data.formatter(data.elapsed, data));
        },

        getTime: function() {
            var $this = $(this),
                data = $this.data('stopwatch');
            return data.elapsed;
        },
        
        toggle: function() {
            return this.each(function() {
                var $this = $(this);
                var data = $this.data('stopwatch');
                if (data.active) {
                    $this.stopwatch('stop');
                } else {
                    $this.stopwatch('start');
                }
            });
        },
        
        reset: function() {
            return this.each(function() {
                var $this = $(this);
                    data = $this.data('stopwatch');
                data.incrementer = incrementer(data.startTime, data.updateInterval);
                data.elapsed = data.startTime;
                $this.data('stopwatch', data);
            });
        }
    };
    
    
    // Define the function
    $.fn.stopwatch = function( method ) {
        if (methods[method]) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.stopwatch' );
        }
    };

})(jQuery);


var jintervals = (function () {
    function jintervals(seconds, format) {
        return Interpreter.evaluate(new Time(seconds), Parser.parse(format));
    };

    /**
    * Parses format string into data structure,
    * that can be interpreted later.
    */
    var Parser = {
        parse: function (format) {
            var unparsed = format;
            var result = [];
            while (unparsed.length > 0) {
                // leave plain text untouched
                var textMatch = /^([^\\{]+)([\\{].*|)$/.exec(unparsed);
                if (textMatch) {
                    result.push(textMatch[1]);
                    unparsed = textMatch[2];
                }

                // parse jintervals {Code} separately
                var match = /^([{].*?(?:[}]|$))(.*)$/i.exec(unparsed);
                if (match) {
                    result.push(this.parseCode(match[1]));
                    unparsed = match[2];
                }

                // backslash escapes next character
                // transform \{ --> {
                // transform \\ --> \
                if (unparsed.charAt(0) === "\\") {
                    result.push(unparsed.charAt(1));
                    unparsed = unparsed.slice(2);
                }
            }
            return result;
        },

        // parses single {Code} in format string
        // Returns object representing the code or false when incorrect format string
        parseCode: function (code) {
            var re = /^[{]([smhdg])([smhdg]*)?(ays?|ours?|inutes?|econds?|reatests?|\.)?(\?(.*))?[}]$/i;
            var matches = re.exec(code);
            if (!matches) {
                return false;
            }

            return {
                // single-letter uppercase name of the type
                type: matches[1].toUpperCase(),
                // when code begins with lowercase letter, then set showing limited amount to true
                limited: (matches[1].toLowerCase() == matches[1]),
                paddingLength: (matches[2] || "").length + 1,
                format: (matches[3] || "") == "" ? false : (matches[3] == "." ? "letter" : "full"),
                optional: !!matches[4],
                optionalSuffix: matches[5] || ""
            };
        }

    };

    /**
    * Evaluates parse tree in the context of given time object
    */
    var Interpreter = {
        evaluate: function (time, parseTree) {
            var smallestUnit = this.smallestUnit(parseTree);
            var result = "";
            while (parseTree.length > 0) {
                var code = parseTree.shift();
                // leave plain text untouched
                if (typeof code === "string") {
                    result += code;
                }

                // evaluate the code
                else if (typeof code === "object") {
                    var unit = (code.type == "G") ? time.getGreatestUnit() : code.type;
                    var smallest = (code.type == "G") ? unit : smallestUnit;
                    var value = time.get(unit, code.limited, smallest);
                    var suffix = code.format ? Localization.translate(code.format, unit, value) : "";

                    // show when not optional or totalvalue is non-zero
                    if (!code.optional || time.get(unit) != 0) {
                        result += this.zeropad(value, code.paddingLength) + suffix + code.optionalSuffix;
                    }
                }

                // otherwise we have error
                else {
                    result += "?";
                }
            }
            return result;
        },

        /**
        * Finds the smallest unit from parse tree.
        * 
        * For example when parse tree contains "d", "m", "h" then returns "m"
        */
        smallestUnit: function (parseTree) {
            var unitOrder = {
                "S": 0,
                "M": 1,
                "H": 2,
                "D": 3
            };

            var smallest = "D";
            for (var i = 0; i < parseTree.length; i++) {
                if (typeof parseTree[i] === "object") {
                    var type = parseTree[i].type;
                    if (type !== "G" && unitOrder[type] < unitOrder[smallest]) {
                        smallest = type;
                    }
                }
            }

            return smallest;
        },

        // utility function to pad number with leading zeros
        zeropad: function (nr, decimals) {
            var padLength = decimals - ("" + nr).length;
            return (padLength > 0) ? this.repeat("0", padLength) + nr : nr;
        },

        // utility function to repeat string
        repeat: function (string, times) {
            var result = "";
            for (var i = 0; i < times; i++) {
                result += string;
            }
            return result;
        }
    };

    /**
    * Time class that deals with the actual computation of time units.
    */
    var Time = function (s) {
        this.seconds = s;
    };
    Time.prototype = {
        nextUnit: { D: "H", H: "M", M: "S", S: "S" },

        /**
        * Returns the value of time in given unit
        * 
        * @param {String} unit  Either "S", "M", "H" or "D"
        * @param {Boolean} limited  When true 67 seconds will become just 7 seconds (defaults to false)
        * @param {String} smallest  The name of smallest unit.  Defaults to next unit.
        * For example for "D" it will be "H", for "H" it will be "M" and so on...
        */
        get: function (unit, limited, smallest) {
            if (!this[unit]) {
                return "?";
            }
            smallest = smallest || this.nextUnit[unit];
            return this[unit](limited, smallest);
        },

        // functions for each unit

        S: function (limited, smallest) {
            return limited ? this.seconds - this.M(false, smallest) * 60 : this.seconds;
        },

        M: function (limited, smallest) {
            var minutes = this.seconds / 60;
            minutes = (smallest === "M") ? Math.round(minutes) : Math.floor(minutes);
            if (limited) {
                minutes = minutes - this.H(false, smallest) * 60;
            }
            return minutes;
        },

        H: function (limited, smallest) {
            var hours = this.M(false, smallest) / 60;
            hours = (smallest === "H") ? Math.round(hours) : Math.floor(hours);
            if (limited) {
                hours = hours - this.D(false, smallest) * 24;
            }
            return hours;
        },

        D: function (limited, smallest) {
            var days = this.H(false, smallest) / 24;
            return (smallest === "D") ? Math.round(days) : Math.floor(days);
        },

        /**
        * Returns the name of greatest time unit.
        * 
        * For example when we have 2 hours, 30 minutes, and 7 seconds,
        * then the greatest unit is hour and "H" is returned.
        */
        getGreatestUnit: function () {
            if (this.seconds < 60) {
                return "S";
            }
            else if (this.M(false, "M") < 60) {
                return "M";
            }
            else if (this.H(false, "H") < 24) {
                return "H";
            }
            else {
                return "D";
            }
        }
    };

    var Localization = {
        translate: function (format, lcType, value) {
            var loc = this.locales[this.currentLocale];
            var translation = loc[format][lcType];
            if (typeof translation === "string") {
                return translation;
            }
            else {
                return translation[loc.plural(value)];
            }
        },

        locale: function (loc) {
            if (loc) {
                this.currentLocale = loc;
            }
            return this.currentLocale;
        },

        currentLocale: "en_US",

        locales: {
            en_US: {
                letter: {
                    D: "d",
                    H: "h",
                    M: "m",
                    S: "s"
                },
                full: {
                    D: [" day", " days"],
                    H: [" hour", " hours"],
                    M: [" minute", " minutes"],
                    S: [" second", " seconds"]
                },
                plural: function (nr) {
                    return (nr == 1) ? 0 : 1;
                }
            },
            et_EE: {
                letter: {
                    D: "p",
                    H: "h",
                    M: "m",
                    S: "s"
                },
                full: {
                    D: [" p\u00E4ev", " p\u00E4eva"],
                    H: [" tund", " tundi"],
                    M: [" minut", " minutit"],
                    S: [" sekund", " sekundit"]
                },
                plural: function (nr) {
                    return (nr == 1) ? 0 : 1;
                }
            },
            lt_LT: {
                letter: {
                    D: "d",
                    H: "h",
                    M: "m",
                    S: "s"
                },
                full: {
                    D: [" dieną", " dienas", " dienų"],
                    H: [" valandą", " valandas", " valandų"],
                    M: [" minutę", " minutes", " minučių"],
                    S: [" sekundę", " sekundes", " sekundžų"]
                },
                plural: function (n) {
                    return (n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
                }
            },
            ru_RU: {
                letter: {
                    D: "д",
                    H: "ч",
                    M: "м",
                    S: "с"
                },
                full: {
                    D: [" день", " дня", " дней"],
                    H: [" час", " часа", " часов"],
                    M: [" минута", " минуты", " минут"],
                    S: [" секунда", " секунды", " секунд"]
                },
                plural: function (n) {
                    return (n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
                }
            },
            fi_FI: {
                letter: {
                    D: "p",
                    H: "h",
                    M: "m",
                    S: "s"
                },
                full: {
                    D: [" päivä", " päivää"],
                    H: [" tunti", " tuntia"],
                    M: [" minuutti", " minuuttia"],
                    S: [" sekunti", " sekunttia"]
                },
                plural: function (nr) {
                    return (nr == 1) ? 0 : 1;
                }
            }
        }
    };

    // Changing and getting current locale
    jintervals.locale = function (loc) {
        return Localization.locale(loc);
    };
    jintervals.Time = Time;

    return jintervals;
})();
