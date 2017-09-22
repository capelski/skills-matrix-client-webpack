(function (js, store, pages) {

    function navigate(pageId, pageData) {
        store.dispatch({
            type: 'navigation-loading'
        });
        var page = pages.find(page => page.id == pageId);
        js.stallPromise(page.loader(pageData, store), 500)
        .then(() => {
            store.dispatch({
                type: 'navigation-changed',
                pageId
            });
        });
    };

    window.Navigate = navigate;

})(window.JsCommons, window.Store, window.pages || []);
