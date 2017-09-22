(function (reducers, renderers, actionBinders) {

    reducers.loader = function(state, action) {        
        if (typeof state ==='undefined') {
            state = {
                loading: true,
                pageId: 'home-section'
            };
        }
        switch(action.type) {
            case 'navigation-loading':
                return {
                    loading: true,
                    pageId: state.pageId
                };
            case 'navigation-changed':
                return {
                    loading: false,
                    pageId: action.pageId
                };
            default:
                return state;
        }
    };

    renderers.loader = function(state) {
        if (state.loading) {
            $('.navigation-section').removeClass('visible');
            $('#page-wrapper').removeClass('loaded').addClass('loading');
        }
        else {
            $('#page-wrapper').removeClass('loading').addClass('loaded');
            $('#' + state.pageId).addClass('visible');
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

    // Provides the store to each view, so they can dispatch actions on event handlers
    actionBinders.forEach(binder => binder(store));

    window.Store = store;

})(window.reducers || {}, window.renderers || {}, window.actionBinders || []);
