(function ($) {

    if (window.statenav)
        return;

    var initialPop = true;
    var initialState = window.history.state;

    window.statenav = {

        xhr: null,
        state: null,
        args: null,

        container: "body",

        initialize: function (container, listen) {

            // Initialize statenav.state if possible
            // Happens when reloading a page and coming forward from a different
            // session history.
            if (initialState && initialState.container) {
                window.statenav.state = initialState;
            } else {
                var link = document.location+"";
                history.replaceState(link, "", link);
            }

            // Non-webkit browsers don't fire an initial popstate event
            if ('state' in window.history) {
                initialPop = false;
            }

            //  Initialize

            if (typeof container !== 'undefined') {
				if(typeof container === 'string') {
					container = $(container);
				}
                window.statenav.container = container;
            }

            if (listen) {
                setInterval(function() {
                    window.statenav.attachElements();
                }, typeof listen === 'number' ? listen : 1000);
            }
        },
		
		attachElements: function(e) {
		    var elements = e || $("a.statenav,a.pjax");

		    elements.each(function () {
                var e = $(this);
                if (e.data("statenav"))
                    return;
                e.data("statenav", true);
				e.click(function(ev) {
					ev.preventDefault();

					var b = $(this),
						link = b.attr("href");
					window.statenav.nav(link, true);
				});
			});
		},

		nav: function (link, push) {

		    window.statenav.args = {
		        link: link,
		        push: push
		    };

            if (!initialPop && window.statenav.xhr) {
                window.statenav.xhr.abort();
                window.statenav.xhr = null;
            }

            window.statenav.container.trigger("sn-start-load");
		    window.statenav.xhr = $.ajax({
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
                if (window.statenav.args.push) {
                    history.pushState(window.statenav.args.link, "", window.statenav.args.link);
                }
            }).fail(function (a, b, c) {
                alert("Error de conexión con el servidor.");
                console.log([a, b, c]);
                window.statenav.container.trigger("sn-finish-load", [{ success: false, a: a, b: b, c: c }]);
            });
        }
    };

    window.onpopstate = function (event) {
        //var previousState = window.statenav.state;
        var state = event.state;

        if (state) {
            window.statenav.nav(document.location);
        } else {
            console.log("Nav. Cancelado");
        }

        initialPop = false;
    };

    if (typeof $ !== 'undefined') {
        $(function () {
            window.statenav.attachElements();
        });
    }

})(jQuery);