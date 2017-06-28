window.application = window.application || {};
window.application.employeesList = window.application.employeesList || {};
    
// View
(function() {
    var htmlNodes = {
        keywords : $('#employees-keywords'),
        loader : $('#employees-loader'),
        list : $('#employees-list')
    };
    var utils = window.application.utils;

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
        htmlNodes.keywords.on('keyup', utils.eventDelayer(utils.eventLinker(getEmployees, state)));
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
            return ajax.get('/api/employee?keywords=' + state.keywords + '&page=' + state.page + '&pageSize=' + state.pageSize, [])
            .then(function(employees) {
                state.employees = employees;
                update.employees(state);
            });
        }
    }

    window.application.employeesList.attachEvents = attachEvents;
})();

// Model
(function() {
    var state = {
        keywords: '',
        page: 0,
        pageSize: 10,
        employees: []
    };

    window.application.employeesList.attachEvents(state);
    window.application.employeesList.state = state;
})();
