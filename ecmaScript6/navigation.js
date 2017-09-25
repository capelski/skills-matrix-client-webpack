(function (js, store, views) {

    var loadMinimumTime = 500;
    var previousPage;

    function _navigate(view, viewData) {
        js.stallPromise(view.loader(viewData, store), loadMinimumTime)
        .then(() => {
            store.dispatch({
                type: 'loaded',
                reason: 'navigation-finished',
                htmlNodeId: view.htmlNodeId
            });
        });
    }

    function _navigationError() {
        setTimeout(() => {
            store.dispatch({
                type: 'loaded',
                reason: 'navigation-finished',
                htmlNodeId: 'error-page'
            });
        }, loadMinimumTime);
    }

    function navigate(htmlNodeId, viewData) {

        store.dispatch({
            type: 'loading',
            reason: 'navigation-started'
        });

        if (htmlNodeId == '_previous' && previousPage) {
            return _navigate(previousPage.view, previousPage.viewData);
        }
        
        var view = views.find(view => view.htmlNodeId == htmlNodeId);
        if (view) {
            _navigate(view, viewData);
            previousPage = {
                view,
                viewData
            };
        }
        else {
            _navigationError();
        }
    };

    window.Navigate = navigate;

    navigate(views[0].htmlNodeId);

})(window.JsCommons, window.Store, window.Views || []);
