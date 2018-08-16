'use strict';

(function ($, $$) {

    $$.$({
        offcanvas: {
            options: {
                selector: '[data-toggle="offcanvas"]'
            },
            bind: function () {
                $(this.options.selector).bind('click', function () {
                    $(this).toggleClass('is-active');
                    $('.offcanvas-collapse').toggleClass('open');
                });
                return true;
            },
            unbind: function () {
                $(this.options.selector).unbind('click');
                return true;
            },
            ready: function () {
                this.bind();
            }
        }

    });

})(jQuery, MP);

