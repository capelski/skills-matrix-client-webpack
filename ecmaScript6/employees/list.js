(function (ajax, paginatedListUtils) {

    var employeeslistReduxId = 'employees-list';
    var employeeslistHtmlId = 'employees-list-wrapper';

    function employeesFetcher(state) {
        return ajax.get('/api/employee', {
            keywords: state.keywords,
            page: state.page + state.pageOffset,
            pageSize: state.pageSize
        }, paginatedListUtils.getDefaultResults());
    }

    window.reducers = window.reducers || {};
    window.reducers.employeesList = paginatedListUtils.getReducer(employeeslistReduxId);

    var employeesListRenderer = paginatedListUtils.getRenderer(employeeslistHtmlId, '<i>No employees found</i>',
    function (employee) {
        return '<li class="list-group-item"><a class="reset" href="/employees/details?id=' +
        employee.Id + '">' + employee.Name + '</a></li>';
    });

    window.renderers = window.renderers || {};
    window.renderers.employeesList = employeesListRenderer;

    window.actionBinders = window.actionBinders || [];
    window.actionBinders.push(function(store) {
        var htmlNodes = paginatedListUtils.getHtmlNodes(employeeslistHtmlId);
        var actionDispatchers = paginatedListUtils.getActionDispatchers(
            store,
            employeeslistReduxId,
            employeesFetcher,
            'employeesList'
        );
        paginatedListUtils.bindDefaultEventHandlers(htmlNodes, actionDispatchers);
    });

    window.pages = window.pages || [];
    window.pages.push({
        id: 'employees-list-section',
        loader: function(pageData, store) {            
            store.dispatch({
                type: 'paginatedListInitialize',
                listId: employeeslistReduxId,
                config: {
                    hasSearcher: true,
                    hasPagination: true
                }
            });

            return employeesFetcher(store.getState().employeesList)
            .then(function(results) {
                store.dispatch({
                    type: 'paginatedListResults',
                    listId: employeeslistReduxId,
                    results
                });
            });
        }
    });

})(window.Ajax, window.PaginatedListUtils);
