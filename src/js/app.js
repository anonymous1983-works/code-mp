'use strict';

(function (window, document, $) {
    var EVENTS = {
        o: $({}),
        init: function () {
            $.each({
                trigger: 'publish',
                on: 'subscribe',
                off: 'unsubscribe'
            }, function (key, val) {
                jQuery[val] = function () {
                    EVENTS.o[key].apply(EVENTS.o, arguments);
                };
            });
        }
    };

    window.EVENTS = EVENTS.init();

})(window, window.document, jQuery);


(function (window, $) {

    var $$ = {
        $: function (obj) {
            $.extend($$, obj);
        },
        ready: function () {


            $.each(this, function (index, obj) {
                if (index !== '$' && index !== 'ready' && index !== 'fn' && index !== 'plugins') {
                    obj.ready();
                }
            });
        }
    };
    $(document).ready(function () {
        $$.ready();
    });

    window.MP = $$;

})(window, jQuery);
