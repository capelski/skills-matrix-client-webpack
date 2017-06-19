(function() {
    window.application = window.application || {};
    window.application.utils = {
        longOperation: function (promiseBuilder, loader) {
            loader.parent().css({
                height: 0
            });
            return loader.fadeIn().promise().done(function() {
                return promiseBuilder().always(function() {
                    loader.parent().css({
                        height: 'auto'
                    });
                    return loader.delay(400).fadeOut().promise();
                });
            });
        }
    };
    window.application.ajax = {
        get: function(url, handler, defaultValue) {
            return function() {
                return $.ajax({
                    type: 'GET',
                    url: url
                })
                .then(handler)
                .fail(function(response) {
                    toastr.error('An error ocurred', 'Oops!', {timeOut: 5000});
                    handler(defaultValue);
                });
            }
        }
    };
})();