export default createStore;

function createStore(views, enableTimeTravel) {

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

    var store;
    if (enableTimeTravel) {
        var composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || Redux.compose;
        store = Redux.createStore(Redux.combineReducers(reducers), composeEnhancers(
            Redux.applyMiddleware(...[thunk])
        ));
    }
    else {
        store = Redux.createStore(Redux.combineReducers(reducers), Redux.applyMiddleware(thunk));    
    }    

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

    return store;
}
