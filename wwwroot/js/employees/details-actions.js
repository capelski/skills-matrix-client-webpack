(function() {
    var ajax = window.application.ajax;
    var utils = window.application.utils;
    var htmlNodes = window.application.employee.htmlNodes;
    var update = window.application.employee.update;

    window.application.employee.attachEvents = function (state) {
        htmlNodes.elementName.on('blur', utils.eventLinker(employeeName, state));
        htmlNodes.deleteButton.on('click', utils.eventLinker(removeEmployee, state));
        htmlNodes.saveButton.on('click', utils.eventLinker(save, state));
        htmlNodes.addSkillsKeywords.on('keyup', utils.eventDelayer(utils.eventLinker(getSkills, state)));
        htmlNodes.addSkillsList.on('click', '.add-skill', utils.eventLinker(addSkill, state));
        htmlNodes.skillsList.on('click', '.remove-skill', utils.eventLinker(removeSkill, state));
        $().ready(utils.eventLinker(initializeView, state));
    };  

    function addSkill (state, event) {
        var skillId = getSkillId(event);
        var skill = state.foundSkills.find(function(skill) {
            return skill.Id === skillId;
        });
        state.foundSkills = [];
        state.searchKeywords = '';
        if (skill) {
            state.employee.Skills.push(skill);
            update.employeeSkills(state);
        }
        update.searchKeywords(state);
        update.foundSkills(state);
    }

    function employeeName (state, event) {
        var name = event.target.value;
        state.employee.Name = name;
        update.employeeName(state);
    }

    function getSkillId(event) {
        var $element = $(event.target);
        if ($element.hasClass('fa')) {
            $element = $element.parent();
        }
        var skillId = $element.data('skill-id');
        return skillId;
    }

    function getSkills(state, event) {
        state.searchKeywords = event.target.value;
        utils.longOperation(skillsPromise, htmlNodes.addSkillsLoader);

        function skillsPromise() {
            var listPromise = Promise.resolve([]);
            if (state.searchKeywords.length > 0) {
                listPromise = ajax.get('/api/skill?keywords=' + state.searchKeywords, []);
            }
            return listPromise.then(function(skills) {
                state.foundSkills = utils.arrayDifference(skills, state.employee.Skills, 'Id');
                update.foundSkills(state);
            });
        }
    }

    function initializeView(state, event) {
        var employeePromise = createPromise;
        if (state.employee.Id != 0) {
            employeePromise = getPromise;
        }
        utils.longOperation(employeePromise, htmlNodes.loader);

        function createPromise() {
            return Promise.resolve(state.employee)
            .then(loadHandler);
        }

        function getPromise() {
            return ajax.get('/api/employee/getById?id=' + state.employee.Id)
            .then(loadHandler);
        }

        function loadHandler(employee) {
            if (employee) {
                state.employee = employee;
            }
            else {
                state.employee.Id = -1;
                state.readOnly = true;
            }
            update(state);
        }
    }
    
    function removeEmployee(state, event) {
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
    }

    function removeSkill(state, event) {
        var skillId = getSkillId(event);
        state.employee.Skills = state.employee.Skills.filter(function(skill) {
            return skill.Id !== skillId;
        });
        update.employeeSkills(state);
    }

    function save(state, event) {
        ajax.save('/api/employee', state.employee)
        .then(function (employee) {
            if (employee) {
                document.location.href = '/employees/details/' + employee.Id;
            }
        });
    }
})();
