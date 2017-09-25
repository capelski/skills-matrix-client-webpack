(function (js, store, views) {

    var loadMinimumTime = 500;
    var previousPage;

    function _navigate(view, viewData, dispatch) {
        js.stallPromise(view.loader(viewData, dispatch, () => store.getState()[view.name]), loadMinimumTime)
        .then(() => {
            dispatch({
                type: 'loaded',
                reason: 'navigation-finished',
                htmlNodeId: view.htmlNodeId
            });
        });
    }

    function _navigationError(dispatch) {
        setTimeout(() => {
            dispatch({
                type: 'loaded',
                reason: 'navigation-finished',
                htmlNodeId: 'error-page'
            });
        }, loadMinimumTime);
    }

    function navigate(htmlNodeId, viewData) {

        store.dispatch(function(dispatch) {
            dispatch({
                type: 'loading',
                reason: 'navigation-started'
            });
    
            if (htmlNodeId == '_previous' && previousPage) {
                return _navigate(previousPage.view, previousPage.viewData, dispatch);
            }
            
            try {
                var view = views.find(view => view.htmlNodeId == htmlNodeId);
                _navigate(view, viewData, dispatch);
                previousPage = {
                    view,
                    viewData
                };
            }
            catch (exception) {
                _navigationError(dispatch);
            }
        });
    };

    window.Navigate = navigate;

    navigate(views[0].htmlNodeId);

})(window.JsCommons, window.Store, window.Views || []);
