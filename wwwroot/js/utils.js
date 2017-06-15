(function() {
    var loaderPromise = null;
    
    window.application = window.application || {};
    window.application.utils = {
        loader: {
            show: function(loader) {
                if (loaderPromise) {
                    return loaderPromise.done(function() {
                        loader.fadeIn().promise();
                    });
                } else {
                    return loader.fadeIn().promise();
                }
            },
            hide: function(loader) {
                loaderPromise = loader.delay(200).fadeOut().promise();
                return loaderPromise;
            }
        }
    };
})();