"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || Redux.compose;
function createTimeTravelStore(reducer, middleware) {
    var _Redux;

    return Redux.createStore(reducer, composeEnhancers((_Redux = Redux).applyMiddleware.apply(_Redux, _toConsumableArray(middleware))));
}

// Usage example
// var store = createTimeTravelStore(reducer, [thunk]);