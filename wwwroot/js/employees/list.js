(function(js, ajax, paginatedList) {

    function EmployeesList(options) {
        var self = this;
        self.htmlNodes = options.htmlNodes;
        self.store = options.store;
        self.initialize = function() {
            self.store.dispatch(function(dispatch) {
                dispatch({
                    config: {
                        hasSearcher: true,
                        hasPagination: true
                    },
                    type: 'initialize'
                });
                getEmployees(self.store.getState(), dispatch);
            });
        };

        function getEmployees(state, dispatch) {
            js.stallPromise(ajax.get('/api/employee', {
                keywords: state.keywords,
                page: state.page + state.pageOffset,
                pageSize: state.pageSize
            }, paginatedList.defaultInstance), 1500)
            .then(function(paginatedList) {
                dispatch({
                    paginatedList: paginatedList,
                    type: 'updateResults'
                });
            });
        }

        function render() {
            paginatedList.render(self.htmlNodes, self.store.getState(), {
                elementDrawer: function (employee) {
                    return '<li class="list-group-item"><a class="reset" href="/employees/details?id=' + employee.Id + '">' + employee.Name + '</a></li>';
                },
                noResultsHtml: '<i>No employees found</i>'
            });
        };

        PaginatedList.attachActions(self.store, self.htmlNodes, getEmployees);

        self.store.subscribe(render);
    }

    var store = Redux.createStore(paginatedList.reducer, Redux.applyMiddleware(thunk));

    document.addEventListener("DOMContentLoaded", function() {
        var employeesList = new EmployeesList({
            htmlNodes: paginatedList.getHtmlNodes('employees'),
            store: store
        });
        employeesList.initialize();
    });

})(window.JsCommons, window.Ajax, window.PaginatedList);
