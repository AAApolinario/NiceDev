(function ($) {

    var config = window.NotifierjsConfig = {
        defaultTimeOut: 5000,
        position: ["bottom", "right"],
        notificationStyles: {
            position: "center",
            padding: "12px 18px",
            backgroundColor: "#000",
            opacity: 0.8,
            color: "#fff",
            font: "normal 13px 'Droid Sans', sans-serif",
            borderRadius: "3px",
            boxShadow: "#999 0 0 12px",
            width: "250px"
        },
        notificationStylesHover: {
            opacity: 1,
            boxShadow: "#000 0 0 12px"
        },
        container: $("<div id='notificationsArea'></div>")
    };

    $(document).ready(function () {
        config.container.css("position", "absolute");
        config.container.css("z-index", 9999);
        config.container.css(config.position[0], "12px");
        config.container.css(config.position[1], "12px");
        $("body").append(config.container);
    });

    function getNotificationElement() {
        return $("<div class='notification'>").css(config.notificationStyles).hover(function () {
            $(this).css(config.notificationStylesHover);
        }, function () {
            $(this).css(config.notificationStyles);
        });
    }

    var Notifier = window.Notifier = {};

    Notifier.notify = function (message, title, iconUrl, timeOut) {

        var notificationElement = getNotificationElement();

        timeOut = timeOut || config.defaultTimeOut;

        var textElement = $("<div/>").css({
            display: 'inline-block',
            verticalAlign: 'middle',
        });

        var titleElement = $("<div/>");

        if (iconUrl) {
            var iconElement = $("<img/>", {
                src: iconUrl,
                css: {
                    width: 15,
                    height: 15,
                    display: "inline-block",
                    verticalAlign: "top",
                    margin: "0 5px 0 0"
                }
            });
            titleElement.append(iconElement);
        }


        if (title) {
            titleElement.append(document.createTextNode(title));
            titleElement.css("font-weight", "bold");
            textElement.append(titleElement);
        }

        if (message) {
            var messageElement = $("<div/>");
            messageElement.append(document.createTextNode(message));
            textElement.append(messageElement);
        }

        notificationElement.bind("click", function () {
            notificationElement.hide();
        });

        notificationElement.append(textElement);
        notificationElement.css('display', 'none');
        config.container.children().remove();
        config.container.prepend(notificationElement);
        notificationElement.slideDown();
        notificationElement.delay(timeOut).slideUp(function () {
            notificationElement.remove();
        });
    };

    Notifier.oneAgent = function (message) {
        Notifier.notify(message, _("agentweb.settings.messagewindow"), getPath() + "/Content/images/1logo_transp.png");
    };

}(jQuery));