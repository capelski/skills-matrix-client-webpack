(function() {
    var ajax = window.application.ajax;
    var utils = window.application.utils;
    var htmlNodes = window.application.employee.htmlNodes;
    var updateAll = window.application.employee.updateAll;
    var actions = window.application.employee.actions;
    var state = {
        employee: {
            Id: parseInt(htmlNodes.elementId.val()),
            Name: '',
            Skills: []
        },
        readOnly: htmlNodes.readOnly.val() == 'true',
        skills: []
    };

    htmlNodes.elementName.on('blur', utils.eventLinker(actions.employeeName, state));
    htmlNodes.deleteButton.on('click', utils.eventLinker(actions.removeEmployee, state));
    htmlNodes.saveButton.on('click', utils.eventLinker(actions.save, state));
    htmlNodes.addSkillList.on('click', 'li.add-skill', utils.eventLinker(actions.addSkill, state));
    htmlNodes.skillsList.on('click', 'li.remove-skill', utils.eventLinker(actions.removeSkill, state));
    window.application.Searcher(htmlNodes.addSkillKeywords, htmlNodes.addSkillList, htmlNodes.addSkillLoader, skillsListPromise, skillsListDrawer);

    initialize();

    window.application.employee.state = state;

    function initialize() {
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
            updateAll(state);
        }
    }

    function skillsListDrawer(skill) {
        return '<li class="list-group-item add-skill" data-skill-id="' + skill.Id + '"><i class="fa fa-plus text-success"></i> ' + skill.Name + '</li>';
    }

    function skillsListPromise(keywords) {
        var listPromise = Promise.resolve([]);
        if (keywords.length > 0) {
            listPromise = ajax.get('/api/skill?keywords=' + keywords, [])
            .then(function(skills) {
                state.skills = utils.arrayDifference(skills, state.employee.Skills, 'Id');
                return state.skills;
            });
        }
        return listPromise;
    }
})();
