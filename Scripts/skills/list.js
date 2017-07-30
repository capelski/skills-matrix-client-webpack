(function(js, ajax, paginatedListService) {

    function skillsFetcher(state) {
        return js.stallPromise(ajax.get('/api/skill', {
            keywords: state.keywords,
            page: state.page + state.pageOffset,
            pageSize: state.pageSize
        }, paginatedListService.getDefaultData()), 1500);
    }

    var skillsList = paginatedListService.create('skills', skillsFetcher, {
        elementDrawer: function (skill) {
            return '<li class="list-group-item"><a class="reset" href="/skills/details?id=' + skill.Id + '">' + skill.Name + '</a></li>';
        },
        noResultsHtml: '<i>No skills found</i>'
    });

    var reducer = paginatedListService.getReducer(skillsList);
    var store = Redux.createStore(reducer, Redux.applyMiddleware(thunk));
    
    // Use this store declaration for Time Travel debug through DevTools Redux Extension
    //var store = createTimeTravelStore(reducer, [thunk]);

    document.addEventListener("DOMContentLoaded", function() {

        function render(state) {
            paginatedListService.render(skillsList, state, state);
        }

        paginatedListService.attachActions(skillsList, store);

        store.subscribe(function() {
            render(store.getState());
        });

        store.dispatch(function(dispatch) {
            dispatch({
                type: skillsList.listId + ':initialize',
                config: {
                    hasSearcher: true,
                    hasPagination: true
                }
            });
            skillsList.fetcher(store.getState())
            .then(function(listResults) {
                dispatch({
                    type: skillsList.listId + ':updateResults',
                    listResults: listResults
                });
            });
        });
    });

})(window.JsCommons, window.Ajax, window.PaginatedListService);
