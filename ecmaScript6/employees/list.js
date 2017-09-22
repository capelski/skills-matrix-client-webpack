// (function(js, ajax, paginatedListService) {

//     function employeesFetcher(state) {
//         return js.stallPromise(ajax.get('/api/employee', {
//             keywords: state.keywords,
//             page: state.page + state.pageOffset,
//             pageSize: state.pageSize
//         }, paginatedListService.getDefaultData()), 1500);
//     }

//     var employeesList = paginatedListService.create('employees', employeesFetcher, {
//         elementDrawer: function (employee) {
//             return '<li class="list-group-item"><a class="reset" href="/employees/details?id=' + employee.Id + '">' + employee.Name + '</a></li>';
//         },
//         noResultsHtml: '<i>No employees found</i>'
//     });

//     var reducer = paginatedListService.getReducer(employeesList);
//     var store = Redux.createStore(reducer, Redux.applyMiddleware(thunk));
    
//     // Use this store declaration for Time Travel debug through DevTools Redux Extension
//     //var store = createTimeTravelStore(reducer, [thunk]);

//     document.addEventListener("DOMContentLoaded", function() {

//         function render(state) {
//             paginatedListService.render(employeesList, state, state);
//         }

//         paginatedListService.attachActions(employeesList, store);

//         store.subscribe(function() {
//             render(store.getState());
//         });

//         store.dispatch(function(dispatch) {
//             dispatch({
//                 type: employeesList.listId + ':initialize',
//                 config: {
//                     hasSearcher: true,
//                     hasPagination: true
//                 }
//             });
//             employeesList.fetcher(store.getState())
//             .then(function(listResults) {
//                 dispatch({
//                     type: employeesList.listId + ':updateResults',
//                     listResults: listResults
//                 });
//             });
//         });
//     });

// })(window.JsCommons, window.Ajax, window.PaginatedListService);

(function(ajax, paginatedListUtils) {

        function employeesFetcher(state) {
            return ajax.get('/api/employee', {
                keywords: state.keywords,
                page: state.page + state.pageOffset,
                pageSize: state.pageSize
            }, paginatedListUtils.getDefaultResults());
        }
    
        window.reducers = window.reducers || {};
        window.reducers.employeesList = paginatedListUtils.getReducer('employees-list');
    
        var employeesListRenderer = paginatedListUtils.getRenderer('employees-list-wrapper', '<i>No employees found</i>',
        function (employee) {
            return '<li class="list-group-item"><a class="reset" href="/employees/details?id=' +
            employee.Id + '">' + employee.Name + '</a></li>';
        });
    
        window.renderers = window.renderers || {};
        window.renderers.employeesList = function(state) {
            employeesListRenderer(state);
        };
    
        window.actionBinders = window.actionBinders || [];
        window.actionBinders.push(function(dispatch) {

        });
    
        window.pages = window.pages || [];
        window.pages.push({
            id: 'employees-list-section',
            loader: function(pageData, store) {            
                store.dispatch({
                    type: 'paginatedListInitialize',
                    listId: 'employees-list',
                    config: {
                        hasSearcher: true,
                        hasPagination: true
                    }
                });
    
                return employeesFetcher(store.getState().employeesList)
                .then(function(results) {
                    store.dispatch({
                        type: 'paginatedListResults',
                        listId: 'employees-list',
                        results
                    });
                });
            }
        });
    
    })(window.Ajax, window.PaginatedListUtils);
    