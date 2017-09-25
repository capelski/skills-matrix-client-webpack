
var composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || Redux.compose;
function createTimeTravelStore(reducer, middleware) {
    return Redux.createStore(reducer, composeEnhancers(
        Redux.applyMiddleware(...middleware)
    ));
}

// Usage example
// var store = createTimeTravelStore(reducer, [thunk]);
