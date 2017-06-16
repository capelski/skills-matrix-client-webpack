(function() {
    var isLoaderVisible = false;
    var lastLoaderPromise = Promise.resolve();
    
    window.application = window.application || {};
    window.application.utils = {
        longOperation: function (promiseBuilder, loader) {
            loader.fadeIn().promise().done(function() {
                return promiseBuilder().always(function() {
                    return loader.delay(400).fadeOut().promise();
                });
            });
        }
    };
})();