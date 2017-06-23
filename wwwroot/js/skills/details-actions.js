(function() {
    var ajax = window.application.ajax;
    var utils = window.application.utils;
    var htmlNodes = window.application.skill.htmlNodes;
    var updaters = window.application.skill.updaters;

    window.application.skill.actions = {
        addEmployee: function (state, event) {
            var employeeId = getEmployeeId(event);
            htmlNodes.addEmployeesList.empty();
            htmlNodes.addEmployeesKeywords.val('');
            var employee = state.employees.find(function(employee) {
                return employee.Id === employeeId;
            });
            if (employee) {
                state.skill.Employees.push(employee);
                updaters.skillEmployees(state);
            }
        },
        removeSkill: function(state, event) {
            utils.actionModal('<div>Are you sure you want to delete ' + state.skill.Name + '?</div>', 'Delete')
            .then(function() {
                return ajax.remove('/api/skill?id=' + state.skill.Id);
            })
            .then(function (skill) {
                if (skill) {
                    document.location.href = '/skills/';
                }
                else {
                    basicModal.close();
                }
            });
        },
        removeEmployee: function (state, event) {
            var employeeId = getEmployeeId(event);
            htmlNodes.addEmployeesList.empty();
            state.skill.Employees = state.skill.Employees.filter(function(employee) {
                return employee.Id !== employeeId;
            });
            updaters.skillEmployees(state);
        },
        save: function(state, event) {
            ajax.save('/api/skill', state.skill)
            .then(function (skill) {
                if (skill) {
                    document.location.href = '/skills/details/' + skill.Id;
                }
            });
        },
        skillName: function (state, event) {
            var name = event.target.value;
            state.skill.Name = name;
            updaters.skillName(state);
        }
    };

    function getEmployeeId(event) {
        var $element = $(event.target);
        return $element.data('employee-id');
    }
})();
