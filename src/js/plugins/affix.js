(function ($, $$) {

    $$.$({
        affix: {

            bind: function (_options) {
                var options = $.extend({}, {
                    target: 'body',
                    cssClass: 'affix',
                    offset: 0
                }, _options);

                $(window).scroll(function () {
                    if ($(this).scrollTop() >= options.offset) {
                        $(options.target).addClass(options.cssClass);
                    } else if ($(this).scrollTop() < options.offset) {
                        $(options.target).removeClass(options.cssClass);
                    }
                });
            },
            init: function () {
                if ($('.js--section-navbar-quickaccess').length) {
                    $('body').scrollspy({target: '.js--navbar-quickaccess'});
                    this.bind({
                        target: 'body',
                        cssClass: 'js--affix-section-navbar-quickaccess',
                        offset: 504
                    });

                    // Call new navBarQuickAccess
                    // this.bind({target: '.target'});
                }
            },
            ready: function () {
                this.init();
            }
        }
    });
})(jQuery, MP);


