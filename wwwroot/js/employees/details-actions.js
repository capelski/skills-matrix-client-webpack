(function() {
    var ajax = window.application.ajax;
    var utils = window.application.utils;
    var htmlNodes = window.application.employee.htmlNodes;
    var updaters = window.application.employee.updaters;

    window.application.employee.actions = {
        addSkill: function (state, event) {
            var skillId = getSkillId(event);
            htmlNodes.addSkillList.empty();
            var skill = state.skills.find(function(skill) {
                return skill.Id === skillId;
            });
            if (skill) {
                state.employee.Skills.push(skill);
                updaters.employeeSkills(state);
            }
        },
        employeeName: function (state, event) {
            var name = event.target.value;
            state.employee.Name = name;
            updaters.employeeName(state);
        },
        removeEmployee: function(state, event) {
            utils.actionModal('<div>Are you sure you want to delete ' + state.employee.Name + '?</div>', 'Delete')
            .then(function() {
                return ajax.remove('/api/employee?id=' + state.employee.Id);
            })
            .then(function (employee) {
                if (employee) {
                    document.location.href = '/employees/';
                }
                else {
                    basicModal.close();
                }
            });
        },
        removeSkill: function (state, event) {
            var skillId = getSkillId(event);
            htmlNodes.addSkillList.empty();
            state.employee.Skills = state.employee.Skills.filter(function(skill) {
                return skill.Id !== skillId;
            });
            updaters.employeeSkills(state);
        },
        save: function(state, event) {
            ajax.save('/api/employee', state.employee)
            .then(function (employee) {
                if (employee) {
                    document.location.href = '/employees/details/' + employee.Id;
                }
            });
        }
    };

    function getSkillId(event) {
        var $element = $(event.target);
        return $element.data('skill-id');
    }
})();
