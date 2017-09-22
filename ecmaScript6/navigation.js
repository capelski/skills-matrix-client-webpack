(function (js, store, views) {

    function navigate(htmlNodeId, viewData) {
        store.dispatch({
            type: 'navigation-loading'
        });
        var view = views.find(view => view.htmlNodeId == htmlNodeId);
        js.stallPromise(view.loader(viewData, store), 500)
        .then(() => {
            store.dispatch({
                type: 'navigation-changed',
                htmlNodeId
            });
        });
    };

    window.Navigate = navigate;

})(window.JsCommons, window.Store, window.Views || []);
