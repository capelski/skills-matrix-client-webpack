window.application = window.application || {};
window.application.employeesList = window.application.employeesList || {};

var js = window.application.jsCommons;
var ajax = window.application.ajax;
var paginatedList = window.application.paginatedList;
    
// View
(function() {
    var htmlNodes = paginatedList.getHtmlNodes('employees');

    function update(state) {
        for (var key in update) {
            var updater = update[key];
            updater(state);
        }
    }

    update.employees = function (state) {
        paginatedList.htmlUpdater(htmlNodes, state, {
            elementDrawer: function (employee) {
                return '<li class="list-group-item"><a class="reset" href="/employees/details?id=' + employee.Id + '">' + employee.Name + '</a></li>';
            },
            noResultsHtml: '<i>No employees found</i>'
        });
    };

    window.application.employeesList.htmlNodes = htmlNodes;
    window.application.employeesList.update = update;
})();

// Actions
(function() {
    var htmlNodes = window.application.employeesList.htmlNodes;
    var update = window.application.employeesList.update;

    function attachEvents(state) {
        var paginatedListEventHandlers = {
            pageButtons: function(event) {
                paginatedList.stateUpdaters.pages(state, event);
                _loadEmployees(state);
            },
            pageSizeList: function(event) {
                paginatedList.stateUpdaters.pageSize(state, event);
                _loadEmployees(state);
            },
            searcher: function(event) {
                state.keywords = event.target.value;
                state.page = 0;
                state.pageOffset = 0;
                _loadEmployees(state);
            },
            clearKeywords: function(event) {
                state.keywords = '';
                state.page = 0;
                state.pageOffset = 0;
                _loadEmployees(state);
            }
        };

        paginatedList.attachEvents(htmlNodes, paginatedListEventHandlers);
        $().ready(function(event) {
            initializeView(state, event);
        });
    }

    function initializeView(state, event) {
        _loadEmployees(state);
    }

    function _loadEmployees(state) {
        js.longOperation(employeesPromise, htmlNodes.loader);

        function employeesPromise() {
            return ajax.get('/api/employee', {
                keywords: state.keywords,
                page: state.page + state.pageOffset,
                pageSize: state.pageSize
            }, paginatedList.defaultInstance)
            .then(function(paginatedList) {
                state.results = paginatedList.Items;
                state.totalPages = paginatedList.TotalPages;
                update.employees(state);
            });
        }
    }

    window.application.employeesList.attachEvents = attachEvents;
})();

// Model
(function() {
    var state = paginatedList.getState();

    window.application.employeesList.attachEvents(state);
    window.application.employeesList.state = state;
})();
