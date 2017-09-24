(function (js, store, views) {

    function navigate(htmlNodeId, viewData) {
        store.dispatch({
            type: 'loading',
            reason: 'navigation-started'
        });
        var view = views.find(view => view.htmlNodeId == htmlNodeId);
        js.stallPromise(view.loader(viewData, store), 500)
        .then(() => {
            store.dispatch({
                type: 'loaded',
                reason: 'navigation-finished',
                htmlNodeId
            });
        });
    };

    window.Navigate = navigate;

    navigate(views[0].htmlNodeId);

})(window.JsCommons, window.Store, window.Views || []);
