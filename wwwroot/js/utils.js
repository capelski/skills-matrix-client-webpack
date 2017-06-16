(function() {
    var isLoaderVisible = false;
    var lastLoaderPromise = Promise.resolve();
    
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
})();