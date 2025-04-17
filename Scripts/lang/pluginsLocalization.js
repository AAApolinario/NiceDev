function addLanguageToPickers(lang) {

    switch (lang) {
        case "pt":
            $.datepicker.regional['pt'] = {
                prevText: 'Anterior',
                nextText: 'Próximo',
                monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
                dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
                dayNamesMin: ["Do", "Se", "Te", "Qu", "Qu", "Se", "Sa"],
                dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
                timeText: 'Hora',
                hourText: 'Horas',
                minuteText: 'Minutos',
                currentText: 'Agora',
                closeText: 'Fechar',
                timeFormat: 'hh:mm',
                amNames: ['a.m.', 'AM', 'A'],
                pmNames: ['p.m.', 'PM', 'P'],
                isRTL: false
            };

            $.timepicker.regional['pt'] = {
                timeOnlyTitle: 'Escolha uma hora',
                timeText: 'Hora',
                hourText: 'Horas',
                minuteText: 'Minutos',
                secondText: 'Segundos',
                millisecText: 'Milissegundos',
                timezoneText: 'Fuso horário',
                currentText: 'Agora',
                closeText: 'Fechar',
                timeFormat: 'hh:mm',
                amNames: ['a.m.', 'AM', 'A'],
                pmNames: ['p.m.', 'PM', 'P'],
                ampm: false
            };

            jQuery.timeago.settings.strings = {
                suffixAgo: "atrás",
                suffixFromNow: "a partir de agora",
                seconds: "menos de um minuto",
                minute: "cerca de um minuto",
                minutes: "%d minutos",
                hour: "cerca de uma hora",
                hours: "cerca de %d horas",
                day: "um dia",
                days: "%d dias",
                month: "cerca de um mês",
                months: "%d meses",
                year: "cerca de um ano",
                years: "%d anos"
            };

            $.datepicker.setDefaults($.datepicker.regional['pt']);
            $.timepicker.setDefaults($.timepicker.regional['pt']);

            break;
        case "br":
            $.datepicker.regional['br'] = {
                prevText: 'Anterior',
                nextText: 'Próximo',
                monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
                dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
                dayNamesMin: ["Do", "Se", "Te", "Qu", "Qu", "Se", "Sa"],
                dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
                timeText: 'Hora',
                hourText: 'Horas',
                minuteText: 'Minutos',
                currentText: 'Agora',
                closeText: 'Fechar',
                timeFormat: 'hh:mm',
                amNames: ['a.m.', 'AM', 'A'],
                pmNames: ['p.m.', 'PM', 'P'],
                isRTL: false
            };

            $.timepicker.regional['br'] = {
                timeOnlyTitle: 'Escolha uma hora',
                timeText: 'Hora',
                hourText: 'Horas',
                minuteText: 'Minutos',
                secondText: 'Segundos',
                millisecText: 'Milissegundos',
                timezoneText: 'Fuso horário',
                currentText: 'Agora',
                closeText: 'Fechar',
                timeFormat: 'hh:mm',
                amNames: ['a.m.', 'AM', 'A'],
                pmNames: ['p.m.', 'PM', 'P'],
                ampm: false
            };

            jQuery.timeago.settings.strings = {
                suffixAgo: "atrás",
                suffixFromNow: "a partir de agora",
                seconds: "menos de um minuto",
                minute: "cerca de um minuto",
                minutes: "%d minutos",
                hour: "cerca de uma hora",
                hours: "cerca de %d horas",
                day: "um dia",
                days: "%d dias",
                month: "cerca de um mês",
                months: "%d meses",
                year: "cerca de um ano",
                years: "%d anos"
            };

            $.datepicker.setDefaults($.datepicker.regional['br']);
            $.timepicker.setDefaults($.timepicker.regional['br']);

            break;
        case "pl":
            $.datepicker.regional['pl'] = {
                prevText: 'Poprzedni',
                nextText: 'Następny',
                monthNames: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj",
                "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
                dayNames: ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'],
                dayNamesMin: ["N", "Pn", "Wt", "Śr", "Cz", "Pt", "So"],
                dayNamesShort: ["Nie", "Pn", "Wt", "Śrar", "Czw", "Pt", "So"],
                timeText: 'Czas',
                hourText: 'Godzina',
                minuteText: 'Minuta',
                currentText: 'Teraz',
                closeText: 'Gotowe',
                timeFormat: 'hh:mm tt',
                amNames: ['AM', 'A'],
                pmNames: ['PM', 'P'],
                isRTL: false
            };

            $.timepicker.regional['pl'] = {
                timeOnlyTitle: 'Wybierz godzinę',
                timeText: 'Czas',
                hourText: 'Godzina',
                minuteText: 'Minuta',
                secondText: 'Sekunda',
                millisecText: 'Milisekunda',
                timezoneText: 'Strefa czasowa',
                currentText: 'Teraz',
                closeText: 'Gotowe',
                timeFormat: 'hh:mm tt',
                amNames: ['AM', 'A'],
                pmNames: ['PM', 'P'],
                ampm: false
            };

            (function () {
                function numpf(n, s, t) {
                    // s - 2-4, 22-24, 32-34 ...
                    // t - 5-21, 25-31, ...
                    var n10 = n % 10;
                    if ((n10 > 1) && (n10 < 5) && ((n > 20) || (n < 10))) {
                        return s;
                    } else {
                        return t;
                    }
                }

                jQuery.timeago.settings.strings = {
                    prefixAgo: null,
                    prefixFromNow: "za",
                    suffixAgo: "temu",
                    suffixFromNow: null,
                    seconds: "mniej niż minutę",
                    minute: "minutę",
                    minutes: function (value) { return numpf(value, "%d minuty", "%d minut"); },
                    hour: "godzinę",
                    hours: function (value) { return numpf(value, "%d godziny", "%d godzin"); },
                    day: "dzień",
                    days: "%d dni",
                    month: "miesiąc",
                    months: function (value) { return numpf(value, "%d miesiące", "%d miesięcy"); },
                    year: "rok",
                    years: function (value) { return numpf(value, "%d lata", "%d lat"); }
                };
            })();

            $.datepicker.setDefaults($.datepicker.regional['pl']);
            $.timepicker.setDefaults($.timepicker.regional['pl']);

            break;
        case "es":
            $.datepicker.regional['es'] = {
                prevText: '&#x3C;Ant',
                nextText: 'Sig&#x3E;',
                monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
	            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
                dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
                dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
                isRTL: false
            };

            $.timepicker.regional['es'] = {
                timeOnlyTitle: 'Elegir una hora',
                timeText: 'Hora',
                hourText: 'Horas',
                minuteText: 'Minutos',
                secondText: 'Segundos',
                millisecText: 'Milisegundos',
                timezoneText: 'Huso horario',
                currentText: 'Ahora',
                closeText: 'Cerrar',
                timeFormat: 'hh:mm',
                amNames: ['a.m.', 'AM', 'A'],
                pmNames: ['p.m.', 'PM', 'P'],
                ampm: false
            };

            jQuery.timeago.settings.strings = {
                prefixAgo: "hace",
                prefixFromNow: "dentro de",
                suffixAgo: "",
                suffixFromNow: "",
                seconds: "menos de un minuto",
                minute: "un minuto",
                minutes: "unos %d minutos",
                hour: "una hora",
                hours: "%d horas",
                day: "un día",
                days: "%d días",
                month: "un mes",
                months: "%d meses",
                year: "un año",
                years: "%d años"
            };

            $.datepicker.setDefaults($.datepicker.regional['es']);
            $.timepicker.setDefaults($.timepicker.regional['es']);

            break;
        case "fr":
            $.datepicker.regional['fr'] = {
                prevText: 'Précédent',
                nextText: 'Suivant',
                monthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
                "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
                dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
                dayNamesMin: ["D", "L", "Ma", "Me", "J", "V", "S"],
                dayNamesShort: ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."],
                isRTL: false
            };

            $.timepicker.regional['fr'] = {
                timeOnlyTitle: 'Choisir une heure',
                timeText: 'Heure',
                hourText: 'Heures',
                minuteText: 'Minutes',
                secondText: 'Secondes',
                millisecText: 'Millisecondes',
                timezoneText: 'Fuseau horaire',
                currentText: 'Maintenant',
                closeText: 'Terminé',
                timeFormat: 'hh:mm',
                amNames: ['AM', 'A'],
                pmNames: ['PM', 'P'],
                ampm: false
            };

            jQuery.timeago.settings.strings = {
                // environ ~= about, it's optional
                prefixAgo: "il y a",
                prefixFromNow: "d'ici",
                seconds: "moins d'une minute",
                minute: "environ une minute",
                minutes: "environ %d minutes",
                hour: "environ une heure",
                hours: "environ %d heures",
                day: "environ un jour",
                days: "environ %d jours",
                month: "environ un mois",
                months: "environ %d mois",
                year: "un an",
                years: "%d ans"
            };

            $.datepicker.setDefaults($.datepicker.regional['fr']);
            $.timepicker.setDefaults($.timepicker.regional['fr']);

            break;
        case "de":
            $.datepicker.regional['de'] = {
                prevText: '&#x3C;Zurück',
                nextText: 'Vor&#x3E;',
                monthNames: ["Januar", "Februar", "März", "April", "Mai", "Juni",
	            "Juli", "August", "September", "Oktober", "November", "Dezember"],
                dayNames: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
                dayNamesMin: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
                dayNamesShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
                isRTL: false
            };

            $.timepicker.regional['de'] = {
                timeOnlyTitle: 'Zeit Wählen',
                timeText: 'Zeit',
                hourText: 'Stunde',
                minuteText: 'Minute',
                secondText: 'Sekunde',
                millisecText: 'Millisekunde',
                timezoneText: 'Zeitzone',
                currentText: 'Jetzt',
                closeText: 'Fertig',
                timeFormat: 'hh:mm tt',
                amNames: ['vorm.', 'AM', 'A'],
                pmNames: ['nachm.', 'PM', 'P'],
                ampm: false
            };

            jQuery.timeago.settings.strings = {
                prefixAgo: "vor",
                prefixFromNow: "in",
                suffixAgo: "",
                suffixFromNow: "",
                seconds: "wenigen Sekunden",
                minute: "etwa einer Minute",
                minutes: "%d Minuten",
                hour: "etwa einer Stunde",
                hours: "%d Stunden",
                day: "etwa einem Tag",
                days: "%d Tagen",
                month: "etwa einem Monat",
                months: "%d Monaten",
                year: "etwa einem Jahr",
                years: "%d Jahren"
            };

            $.datepicker.setDefaults($.datepicker.regional['de']);
            $.timepicker.setDefaults($.timepicker.regional['de']);
            break;
        case "nl":
            $.datepicker.regional['nl'] = {
                prevText: '←',
                nextText: '→',
                monthNames: ["januari", "februari", "maart", "april", "mei", "juni",
	            "juli", "augustus", "september", "oktober", "november", "december"],
                dayNames: ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"],
                dayNamesMin: ["zo", "ma", "di", "wo", "do", "vr", "za"],
                dayNamesShort: ["zon", "maa", "din", "woe", "don", "vri", "zat"],
                isRTL: false
            };

            $.timepicker.regional['nl'] = {
                timeOnlyTitle: 'Tijdstip',
                timeText: 'Tijd',
                hourText: 'Uur',
                minuteText: 'Minuut',
                secondText: 'Seconde',
                millisecText: 'Milliseconde',
                timezoneText: 'Tijdzone',
                currentText: 'Vandaag',
                closeText: 'Sluiten',
                timeFormat: 'hh:mm tt',
                amNames: ['AM', 'A'],
                pmNames: ['PM', 'P'],
                ampm: false
            };

            jQuery.timeago.settings.strings = {
                prefixAgo: null,
                prefixFromNow: "over",
                suffixAgo: "geleden",
                suffixFromNow: null,
                seconds: "minder dan een minuut",
                minute: "ongeveer een minuut",
                minutes: "%d minuten",
                hour: "ongeveer een uur",
                hours: "ongeveer %d uur",
                day: "een dag",
                days: "%d dagen",
                month: "ongeveer een maand",
                months: "%d maanden",
                year: "ongeveer een jaar",
                years: "%d jaar",
                wordSeparator: " ",
                numbers: []
            };

            $.datepicker.setDefaults($.datepicker.regional['nl']);
            $.timepicker.setDefaults($.timepicker.regional['nl']);
            break;
        default:
            $.datepicker.regional['en'] = {
                prevText: 'Previous',
                nextText: 'Next',
                monthNames: ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"],
                dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                isRTL: false
            };

            $.timepicker.regional['en'] = {
                currentText: 'Now',
                closeText: 'Done',
                amNames: ['AM', 'A'],
                pmNames: ['PM', 'P'],
                timeFormat: 'HH:mm',
                timeSuffix: '',
                timeOnlyTitle: 'Choose Time',
                timeText: 'Time',
                hourText: 'Hour',
                minuteText: 'Minute',
                secondText: 'Second',
                millisecText: 'Millisecond',
                timezoneText: 'Time Zone',
                isRTL: false
            };

            jQuery.timeago.settings.strings = {
                prefixAgo: null,
                prefixFromNow: null,
                suffixAgo: "ago",
                suffixFromNow: "from now",
                seconds: "less than a minute",
                minute: "about a minute",
                minutes: "%d minutes",
                hour: "about an hour",
                hours: "about %d hours",
                day: "a day",
                days: "%d days",
                month: "about a month",
                months: "%d months",
                year: "about a year",
                years: "%d years",
                wordSeparator: " ",
                numbers: []
            };

            $.datepicker.setDefaults($.datepicker.regional['en']);
            $.timepicker.setDefaults($.timepicker.regional['en']);

            break;

    }
}