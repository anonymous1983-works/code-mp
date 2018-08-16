'use strict';

(function ($, $$) {

    $$.$({
        slick: {
            options: {
                selector: '[data-toggle="slick"]',
                setting: {}
            },
            init: function (selector, setting) {
                $(selector).slick(setting);
                return true;
            },
            ready: function () {
                this.init(this.options.selector, this.options.setting);
            }
        }

    });

})(jQuery, MP);

