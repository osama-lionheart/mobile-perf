define(function(require) {
    'use strict';

    var _ = require('underscore'),
        $ = require('jquery'),
        $body = $(document.body),
        currentPanel = null;

    var Panel = function(el) {
        this.$el = $(el);
    };

    _.extend(Panel.prototype, {
        render: function(view) {
            view.render();

            if (this.currentView !== view) {
                var subPanels = this.$el.find('.sub-panel');

                if (subPanels.length) {
                    subPanels.detach();
                    this.$el.html(view.$el.addClass('panel-inner'));
                    this.$el.append(subPanels);
                } else {
                    this.$el.html(view.$el.addClass('panel-inner'));
                }

                this.currentView = view;
            }

            return this;
        },

        open: function() {
            if (currentPanel === this) {
                return this;
            }

            if (currentPanel) {
                currentPanel.scrollTop = $body.scrollTop();
                currentPanel.$el.removeClass('in push-out animating');
                currentPanel.$el.find('.panel-inner').empty();
                currentPanel.currentView = null;
            }

            this.$el.addClass('in');
            $body.scrollTop(this.scrollTop || 0);

            currentPanel = this;

            return this;
        },

        cleanupAfterTransition: function() {
            this.$el.closest('.panel')
                .on('webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd', function(event) {
                    $(this).removeClass('animating');
                    $(this).off(event);
                });
        },

        openPush: function() {
            var $panel = this.$el.closest('.panel');

            this.cleanupAfterTransition();
            $panel.addClass('animating no-trans');

            $panel.outerWidth();
            $panel.removeClass('no-trans');

            _.delay(function() {
                $panel.addClass('push-out');
            }, 50);

            if (!$panel.find('.panel-inner > .panel-dismiss').length) {
                $('<div/>').addClass('panel-dismiss').appendTo($panel.find('> .panel-inner'))
                    .on('click', function() {
                        this.closePush();
                    }.bind(this));
            }
        },

        closePush: function() {
            var $panel = this.$el.closest('.panel');

            if ($panel.hasClass('push-out')) {

                this.cleanupAfterTransition();

                $panel.addClass('animating');
                $panel.outerWidth();
                $panel.removeClass('push-out').find('.panel-dismiss').remove();
            }
        }
    });

    $.fn.panel = function(option, options) {
        var $this = $(this),
            data = $this.data('panel');

        options = options || (typeof option === 'object' && option);

        if (!data) {
            $this.data('panel', (data = new Panel(this)));
        }

        if (typeof option === 'string') {
            data[option].apply(data, Array.prototype.slice.call(arguments, 1));
        } else {
            return data;
        }

        return this;
    };

    $.fn.panel.Constructor = Panel;

    return Panel;
});
