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
        paginatedList.htmlUpdater(htmlNodes, state.paginatedList);
        paginatedList.fill(htmlNodes, state.employees, {
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
            pageButtons: js.eventLinker(function(state, event) {
                paginatedList.stateUpdaters.pages(state.paginatedList, event);
                _loadEmployees(state);
            }, state),
            pageSizeList: js.eventLinker(function(state, event) {
                paginatedList.stateUpdaters.pageSize(state.paginatedList, event);
                _loadEmployees(state);
            }, state),
            searcher: js.eventLinker(function (state, event) {
                state.paginatedList.keywords = event.target.value;
                state.paginatedList.page = 0;
                state.paginatedList.pageOffset = 0;
                _loadEmployees(state);
            }, state),
            clearKeywords: js.eventDelayer(js.eventLinker(clearKeywords, state))
        };

        paginatedList.attachEvents(htmlNodes, paginatedListEventHandlers);
        $().ready(js.eventLinker(initializeView, state));
    }

    function clearKeywords(state, event) {
        state.paginatedList.keywords = '';
        state.paginatedList.page = 0;
        state.paginatedList.pageOffset = 0;
        _loadEmployees(state);
    }

    function initializeView(state, event) {
        _loadEmployees(state);
    }

    function _loadEmployees(state) {
        js.longOperation(employeesPromise, htmlNodes.loader);

        function employeesPromise() {
            return ajax.get('/api/employee', {
                keywords: state.paginatedList.keywords,
                page: state.paginatedList.page + state.paginatedList.pageOffset,
                pageSize: state.paginatedList.pageSize
            }, paginatedList.defaultInstance)
            .then(function(paginatedList) {
                state.employees = paginatedList.Items;
                state.paginatedList.totalPages = paginatedList.TotalPages;
                update.employees(state);
            });
        }
    }

    window.application.employeesList.attachEvents = attachEvents;
})();

// Model
(function() {
    var state = {
        employees: [],
        paginatedList: paginatedList.getState()
    };

    window.application.employeesList.attachEvents(state);
    window.application.employeesList.state = state;
})();
