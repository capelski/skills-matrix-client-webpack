(function() {
    window.application = window.application || {};
    window.application.utils = {
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
    window.application.ajax = {
        get: function(url, defaultValue) {
            return new Promise(function(resolve, reject) {
                var result = defaultValue;
                $.ajax({
                    type: 'GET',
                    url: url
                })
                .then(function(data) {
                    result = data;
                })
                .fail(function(response) {
                    toastr.error('An error ocurred', 'Oops!', {timeOut: 5000});
                })
                .always(function(data) {
                    resolve(result);
                });
            });
        },
        remove: function(url) {
            return new Promise(function(resolve, reject) {
                var result = null;
                $.ajax({
                    type: 'DELETE',
                    url: url
                })
                .then(function(data) {
                    result = data;
                })
                .fail(function(response) {
                    toastr.error('An error ocurred', 'Oops!', {timeOut: 5000});
                })
                .always(function(data) {
                    resolve(result);
                });
            });
        },
        save: function(url, entitity) {
            return new Promise(function(resolve, reject) {
                var result = null;
                var request = {
                    type: 'POST',
                    url: url,
                    contentType: 'application/json',
                    data: JSON.stringify(entitity)
                };

                if (entitity.Id !== 0) {
                    request.type = 'PUT';
                }

                $.ajax(request)
                .then(function(data) {
                    result = data;
                })
                .fail(function(response) {
                    toastr.error('An error ocurred', 'Oops!', {timeOut: 5000});
                })
                .always(function(data) {
                    resolve(result);
                });
            });
        }
    };
})();