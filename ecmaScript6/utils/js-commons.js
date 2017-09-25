(function() {
    var JsCommons = {
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
        delay: function(time) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    resolve();
                }, time);
            });
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
        injectLoader: function(loaderSelector) {
            loaderSelector = loaderSelector || '.loader';
            $(loaderSelector).html(
                `<div class="sk-chasing-dots">
                    <div class="sk-child sk-dot1"></div>
                    <div class="sk-child sk-dot2"></div>
                </div>`
            );
        },
        stallPromise: function(promise, minimumTime) {
            return Promise.all([promise, JsCommons.delay(minimumTime)])
            .then(function(results) {
                return results[0];
            });
        }
    };
    window.JsCommons = JsCommons;
})();
