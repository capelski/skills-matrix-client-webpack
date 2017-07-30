(function(js, ajax, paginatedListService) {

    function employeesFetcher(state) {
        return js.stallPromise(ajax.get('/api/employee', {
            keywords: state.keywords,
            page: state.page + state.pageOffset,
            pageSize: state.pageSize
        }, paginatedListService.getDefaultData()), 1500);
    }

    var employeesList = paginatedListService.create('employees', employeesFetcher, {
        elementDrawer: function (employee) {
            return '<li class="list-group-item"><a class="reset" href="/employees/details?id=' + employee.Id + '">' + employee.Name + '</a></li>';
        },
        noResultsHtml: '<i>No employees found</i>'
    });

    var reducer = paginatedListService.getReducer(employeesList);
    var store = Redux.createStore(reducer, Redux.applyMiddleware(thunk));
    
    // Use this store declaration for Time Travel debug through DevTools Redux Extension
    //var store = createTimeTravelStore(reducer, [thunk]);

    document.addEventListener("DOMContentLoaded", function() {

        function render(state) {
            paginatedListService.render(employeesList, state, state);
        }

        paginatedListService.attachActions(employeesList, store);

        store.subscribe(function() {
            render(store.getState());
        });

        store.dispatch(function(dispatch) {
            dispatch({
                type: employeesList.listId + ':initialize',
                config: {
                    hasSearcher: true,
                    hasPagination: true
                }
            });
            employeesList.fetcher(store.getState())
            .then(function(listResults) {
                dispatch({
                    type: employeesList.listId + ':updateResults',
                    listResults: listResults
                });
            });
        });
    });

})(window.JsCommons, window.Ajax, window.PaginatedListService);
