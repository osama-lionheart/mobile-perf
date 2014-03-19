define(function(require) {
    'use strict';

    var $ = require('jquery'),
        kb = require('knockback');

    return {
        initRenderer: function() {
            if (this.templateName && this.template) {
                if (!$('script#' + this.templateName).length) {
                    $(document.body).append('<script type="text/html" id="' + this.templateName + '">' + this.template + '</script>');
                }
            }
        },

        $: function(selector) {
            return this.$el.find(selector);
        },

        render: function() {
            if (this.templateName && this.template) {
                this.initRenderer();

                this.el = kb.renderTemplate(this.templateName, this);
                this.$el = $(this.el);
            }

            return this;
        }
    };
});
