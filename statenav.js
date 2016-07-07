(function ($) {

    window.statenav = {

        container: "body",

        initialize: function (container) {
            if (typeof container !== 'undefined') {
				if(typeof container === 'string') {
					container = $(container);
				}
                window.statenav.container = container;
            }
        },
		
		attachElements: function() {
			var sn = window.statenav;

            $("a.statenav,a.pjax").each(function() {
				var e = $(this);
				e.click(function(ev) {
					ev.preventDefault();

					var b = $(this),
						link = b.attr("href");
					history.pushState(link, "", link);

					window.statenav.nav(link);
				});
			});
		},

        nav: function(link) {
            window.statenav.container.trigger("sn-start-load");
            $.ajax({
                url: link,
                dataType: "html",
                method: "GET",
                headers: {
                    'X-SN': 'true',
                    'X-PJAX': 'true',
                    'X-SN-Container': window.statenav.container.selector,
                    'X-PJAX-Container': window.statenav.container.selector
                }
            }).done(function (data) {
                window.statenav.container.html(data);
                window.statenav.container.trigger("sn-finish-load", [{ success: true }]);
				window.statenav.attachElements();
            }).fail(function (a, b, c) {
                alert("Error de conexión con el servidor.");
                console.log([a, b, c]);
                window.statenav.container.trigger("sn-finish-load", [{ success: false, a: a, b: b, c: c }]);
            });
        }
    };

    window.onpopstate = function (event) {
        console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
        window.statenav.nav(document.location);
    };

    if (typeof $ !== 'undefined') {
        $(function () {
            window.statenav.attachElements();
        });
    }

})(jQuery);