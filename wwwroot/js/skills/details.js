(function() {
    var ajax = window.application.ajax;
    var utils = window.application.utils;
    var htmlNodes = window.application.skill.htmlNodes;
    var updateAll = window.application.skill.updateAll;
    var actions = window.application.skill.actions;
    var state = {
        skill: {
            Id: parseInt(htmlNodes.elementId.val()),
            Name: '',
            Employees: []
        },
        readOnly: htmlNodes.readOnly.val() == 'true',
        employees: []
    };

    htmlNodes.elementName.on('blur', utils.eventLinker(actions.skillName, state));
    htmlNodes.deleteButton.on('click', utils.eventLinker(actions.removeSkill, state));
    htmlNodes.saveButton.on('click', utils.eventLinker(actions.save, state));
    htmlNodes.addEmployeesList.on('click', 'li.add-employee', utils.eventLinker(actions.addEmployee, state));
    htmlNodes.employeesList.on('click', 'li.remove-employee', utils.eventLinker(actions.removeEmployee, state));

    var searchList = new window.application.SearchList('add-employees', employeesListPromise, {
        elementDrawer: employeesListDrawer,
        noResultsHtml: '<i>No employees found</i>'
    });

    initialize();

    window.application.skill.state = state;

    function initialize() {
        var skillPromise = createPromise;
        if (state.skill.Id != 0) {
            skillPromise = getPromise;
        }
        utils.longOperation(skillPromise, htmlNodes.loader);

        function createPromise() {
            return Promise.resolve(state.skill)
            .then(loadHandler);
        }

        function getPromise() {
            return ajax.get('/api/skill/getById?id=' + state.skill.Id)
            .then(loadHandler);
        }

        function loadHandler(skill) {
            if (skill) {
                state.skill = skill;
            }
            else {
                state.skill.Id = -1;
                state.readOnly = true;
            }
            updateAll(state);
        }
    }

    function employeesListDrawer(employee) {
        return '<li class="list-group-item add-employee" data-employee-id="' + employee.Id + '"><i class="fa fa-plus text-success"></i> ' + employee.Name + '</li>';
    }

    function employeesListPromise(keywords) {
        var listPromise = Promise.resolve([]);
        if (keywords.length > 0) {
            listPromise = ajax.get('/api/employee?keywords=' + keywords, [])
            .then(function(employees) {
                state.employees = utils.arrayDifference(employees, state.skill.Employees, 'Id');
                return state.employees;
            });
        }
        return listPromise;
    }
})();
