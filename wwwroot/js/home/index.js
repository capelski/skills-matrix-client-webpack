window.application = window.application || {};
window.application.home = window.application.home || {};

var js = window.application.jsCommons;
var ajax = window.application.ajax;
var paginatedList = window.application.paginatedList;

// View
(function() {
    var htmlNodes = {
        employeesList:  paginatedList.getHtmlNodes('employees'),
        skillsList:  paginatedList.getHtmlNodes('skills')
    };

    function update(state) {
        for (var key in update) {
            var updater = update[key];
            updater(state);
        }
    }

    update.employees = function (state) {
        paginatedList.fill(htmlNodes.employeesList, state.employees, {
            elementDrawer: function (employee) {
                return '<li class="list-group-item"><a class="reset" href="/employees/details?id=' + employee.Id + '">' + employee.Name +
                '<span class="badge floating">' + employee.Skills.length + '</span></a></li>';
            },
            noResultsHtml: '<i>No employees found</i>'
        });
    };

    update.skills = function (state) {
        paginatedList.fill(htmlNodes.skillsList, state.skills, {
            elementDrawer: function (skill) {
                return '<li class="list-group-item"><a class="reset" href="/skills/details?id=' + skill.Id + '">' + skill.Name +
                '<span class="badge floating">' + skill.Employees.length + '</span></a></li>';
            },
            noResultsHtml: '<i>No skills found</i>'
        });
    };

    window.application.home.htmlNodes = htmlNodes;
    window.application.home.update = update;
})();

// Actions
(function() {
    var htmlNodes = window.application.home.htmlNodes;
    var update = window.application.home.update;

    function attachEvents(state) {
        $().ready(function(event) {
            initializeView(state, event);
        });
    }

    function initializeView(state, event) {
        _loadSkills(state);
        _loadEmployees(state);
    }

    function _loadEmployees(state) {
        js.longOperation(ajax.get('/api/employee/getMostSkilled', {}, []), htmlNodes.employeesList.loader)
        .then(function(employees) {
            state.employees = employees;
            update.employees(state);
        });
    }

    function _loadSkills(state) {
        js.longOperation(ajax.get('/api/skill/getRearest', {}, []), htmlNodes.skillsList.loader)
        .then(function(skills) {
            state.skills = skills;
            update.skills(state);
        });
    }

    window.application.home.attachEvents = attachEvents;
})();

// Model
(function() {
    var state = {
        employees: [],
        skills: []
    };

    window.application.home.attachEvents(state);
    window.application.home.state = state;
})();
