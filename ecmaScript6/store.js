(function (reducers, renderers, actionBinders) {

    reducers.loader = function(state, action) {        
        if (typeof state ==='undefined') {
            state = true;
        }
        switch(action.type) {
            case 'navigation-loading':
                return true;
            case 'navigation-changed':
                return false;
            default:
                return state;
        }
    };

    renderers.loader = function(state) {
        if (state) {
            $('#page-wrapper').removeClass('loaded').addClass('loading');
        }
        else {
            $('#page-wrapper').removeClass('loading').addClass('loaded');
        }
    };

    //var store = Redux.createStore(Redux.combineReducers(reducers), Redux.applyMiddleware(thunk));
    // Use this store declaration for Time Travel debug through DevTools Redux Extension
    var store = createTimeTravelStore(Redux.combineReducers(reducers), [thunk]);

    store.subscribe(function() {
        var state = store.getState();
        for (var key in renderers) {
            renderers[key](state[key]);
        }
    });

    // Provides the store dispatch function to each view, so they can dispatch actions on event handlers
    actionBinders.forEach(binder => binder(store.dispatch.bind(store)));

    window.Store = store;

})(window.reducers || {}, window.renderers || {}, window.actionBinders || []);
