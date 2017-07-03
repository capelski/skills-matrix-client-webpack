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
        eventLinker: function (action, state) {
            return function(event) {
                action(state, event);
            };
        },
        longOperation: function (promiseBuilder, loader) {
            return new Promise(function(resolve, reject) {
                loader.parent().addClass('loading');
                loader.fadeIn(400).promise().done(function() {
                    promiseBuilder().then(function() {
                        loader.delay(400).fadeOut().promise().done(function() {
                            loader.parent().removeClass('loading');
                            resolve();
                        });
                    });
                });
            });
        }
    };
})();