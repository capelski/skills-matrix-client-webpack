window.application = window.application || {};
window.application.employeesList = window.application.employeesList || {};
    
// View
(function() {
    var utils = window.application.utils;
    var htmlNodes = {
        keywords : $('#employees-keywords'),
        loader : $('#employees-loader'),
        list : $('#employees-list'),
        paginationBar: utils.paginatedList.getHtmlNodes('employees')
    };

    function update(state) {
        for (var key in update) {
            var updater = update[key];
            updater(state);
        }
    }

    update.employees = function (state) {
        utils.fillList(htmlNodes.list, state.employees, {
            elementDrawer: function (employee) {
                return '<li class="list-group-item"><a class="reset" href="/employees/details?id=' + employee.Id + '">' + employee.Name + '</a></li>';
            },
            noResultsHtml: '<i>No employees found</i>'
        });
    };

    update.keywords = function (state) {
        htmlNodes.keywords.val(state.keywords);
    };

    update.paginationBar = function(state) {
        utils.paginatedList.htmlUpdater(htmlNodes.paginationBar, state)
    };

    window.application.employeesList.htmlNodes = htmlNodes;
    window.application.employeesList.update = update;
})();

// Actions
(function() {
    var ajax = window.application.ajax;
    var utils = window.application.utils;
    var htmlNodes = window.application.employeesList.htmlNodes;
    var update = window.application.employeesList.update;

    function attachEvents(state) {
        var paginationBarEventHandlers = {
            pageButtons: utils.eventLinker(function(state, event) {
                utils.paginatedList.stateUpdaters.pages(state, event);
                _loadEmployees(state);
            }, state),
            pageSizeList: utils.eventLinker(function(state, event) {
                utils.paginatedList.stateUpdaters.pageSize(state, event);
                _loadEmployees(state);
            }, state)
        };

        htmlNodes.keywords.on('keyup', utils.eventDelayer(utils.eventLinker(getEmployees, state)));
        utils.paginatedList.attachEvents(htmlNodes.paginationBar, paginationBarEventHandlers);
        $().ready(utils.eventLinker(initializeView, state));
    }

    function getEmployees(state, event) {
        state.keywords = event.target.value;
        _loadEmployees(state);
    }

    function initializeView(state, event) {
        _loadEmployees(state);
    }

    function _loadEmployees(state) {
        utils.longOperation(employeesPromise, htmlNodes.loader);

        function employeesPromise() {
            return ajax.get('/api/employee?keywords=' + state.keywords + '&page=' + (state.paginatedList.page + state.paginatedList.pageOffset) +
            '&pageSize=' + state.paginatedList.pageSize, utils.paginatedList.default)
            .then(function(paginatedList) {
                state.employees = paginatedList.Items;
                state.paginatedList.totalPages = paginatedList.TotalPages;
                update.paginationBar(state);
                update.employees(state);
            });
        }
    }

    window.application.employeesList.attachEvents = attachEvents;
})();

// Model
(function() {
    var utils = window.application.utils;    
    var state = {
        employees: [],
        keywords: '',
        paginatedList: utils.paginatedList.getState()
    };

    window.application.employeesList.attachEvents(state);
    window.application.employeesList.state = state;
})();
