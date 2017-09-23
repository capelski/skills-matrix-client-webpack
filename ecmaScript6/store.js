(function (views) {

    var reducers = views.reduce((reduced, view) => {
        reduced[view.name] = view.reducer;
        return reduced;
    }, {});
    reducers.loader = function(state, action) {        
        if (typeof state ==='undefined') {
            state = {
                loading: true,
                htmlNodeId: views[0].htmlNodeId
            };
        }
        switch(action.type) {
            case 'loading':
                return {
                    loading: true,
                    htmlNodeId: state.htmlNodeId
                };
            case 'loaded':
                return {
                    loading: false,
                    htmlNodeId: action.reason == 'navigation-finished' ? action.htmlNodeId : state.htmlNodeId
                };
            default:
                return state;
        }
    };

    //var store = Redux.createStore(Redux.combineReducers(reducers), Redux.applyMiddleware(thunk));
    // Use this store declaration for Time Travel debug through DevTools Redux Extension
    var store = createTimeTravelStore(Redux.combineReducers(reducers), [thunk]);

    function renderLoader(state) {
        if (state.loading) {
            $('.navigation-section').removeClass('visible');
            $('#page-wrapper').removeClass('loaded').addClass('loading');
        }
        else {
            $('#page-wrapper').removeClass('loading').addClass('loaded');
            $('#' + state.htmlNodeId).addClass('visible');
        }
    };

    store.subscribe(function() {
        var state = store.getState();
        views.forEach(view => view.renderer(state[view.name]));
        renderLoader(state.loader);
    });

    views
    .filter(view => view.actionBinders != null)
    .map(view => view.actionBinders)
    .forEach(actionBinders => actionBinders(store));

    window.Store = store;

})(window.Views || []);
