(function() {
    var js = window.application.jsCommons;
    var ajax = window.application.ajax;
    var paginatedList = window.application.paginatedList;
    var htmlNodes = window.application.employee.htmlNodes;
    var update = window.application.employee.update;

    window.application.employee.attachEvents = function (state) {
        htmlNodes.elementName.on('blur', js.eventLinker(employeeName, state));
        htmlNodes.deleteButton.on('click', js.eventLinker(removeEmployee, state));
        htmlNodes.saveButton.on('click', js.eventLinker(save, state));
        htmlNodes.addSkillsKeywords.on('keyup', js.eventDelayer(js.eventLinker(getSkills, state)));
        htmlNodes.addSkillsList.on('click', '.add-skill', js.eventLinker(addSkill, state));
        htmlNodes.skillsList.on('click', '.remove-skill', js.eventLinker(removeSkill, state));
        $().ready(js.eventLinker(initializeView, state));
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
        js.longOperation(skillsPromise, htmlNodes.addSkillsLoader);

        function skillsPromise() {
            var listPromise = Promise.resolve(paginatedList.defaultInstance);
            if (state.searchKeywords.length > 0) {
                listPromise = ajax.get('/api/skill?keywords=' + state.searchKeywords, paginatedList.defaultInstance);
            }
            return listPromise.then(function(paginatedList) {
                state.foundSkills = js.arrayDifference(paginatedList.Items, state.employee.Skills, 'Id');
                update.foundSkills(state);
            });
        }
    }

    function initializeView(state, event) {
        var employeePromise = createPromise;
        if (state.employee.Id != 0) {
            employeePromise = getPromise;
        }
        js.longOperation(employeePromise, htmlNodes.loader);

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
        js.actionModal('<div>Are you sure you want to delete ' + state.employee.Name + '?</div>', 'Delete')
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
