(function() {
    window.application = window.application || {};
    window.application.jsCommons = {
        actionModal: function(text, actionName) {
            return new Promise(function(resolve, reject) {
                basicModal.show({
                    body: text,
                    buttons: {
                        cancel: {
                            title: 'Cancel',
                            fn: function() {
                                basicModal.close();
                            }
                        },
                        action: {
                            title: actionName,
                            fn: resolve
                        }
                    }
                });
            });
        },
        arrayDifference: function(first, second, propertyName) {
            var result = first.filter(function(firstArrayElement) {
                return second.filter(function(secondArrayElement) {
                    return firstArrayElement[propertyName] === secondArrayElement[propertyName];
                }).length === 0;
            });
            return result;
        },
        eventDelayer: function(eventHandler, delay) {
            var timeOut = null;
            delay = delay || 300;
            return function (event) {
                if (timeOut) {
                    clearTimeout(timeOut);
                }
                timeOut = setTimeout(function() {
                    timeOut = null;
                    eventHandler(event);
                }, delay);
            }
        },
        longOperation: function (promise, loader) {
            return new Promise(function(resolve, reject) {
                var delayTime = 500;
                var parent = loader.parent();
                var loadingPromise = parent.removeClass('finished').addClass('loading').delay(delayTime).promise();
                Promise.all([promise, loadingPromise])
                .then(function(results) {
                    resolve(results[0]);
                    parent.removeClass('loading').delay(delayTime).promise().done(function() {
                        parent.addClass('finished');
                    });
                })
            });
        }
    };
})();