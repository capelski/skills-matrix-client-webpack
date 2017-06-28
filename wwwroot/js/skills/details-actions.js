(function() {
    var ajax = window.application.ajax;
    var utils = window.application.utils;
    var htmlNodes = window.application.skill.htmlNodes;
    var update = window.application.skill.update;

    window.application.skill.attachEvents = function (state) {
        htmlNodes.elementName.on('blur', utils.eventLinker(skillName, state));
        htmlNodes.deleteButton.on('click', utils.eventLinker(removeSkill, state));
        htmlNodes.saveButton.on('click', utils.eventLinker(save, state));
        htmlNodes.addEmployeesKeywords.on('keyup', utils.eventDelayer(utils.eventLinker(getEmployees, state)));
        htmlNodes.addEmployeesList.on('click', 'li.add-employee', utils.eventLinker(addEmployee, state));
        htmlNodes.employeesList.on('click', 'li.remove-employee', utils.eventLinker(removeEmployee, state));
        $().ready(utils.eventLinker(initializeView, state));
    };    

    function addEmployee (state, event) {
        var employeeId = getEmployeeId(event);
        htmlNodes.addEmployeesList.empty();
        htmlNodes.addEmployeesKeywords.val('');
        // state.foundEmployees = []; INSTEAD
        // state.searchKeywords = '';
        var employee = state.foundEmployees.find(function(employee) {
            return employee.Id === employeeId;
        });
        if (employee) {
            state.skill.Employees.push(employee);
            update.skillEmployees(state);
        }
    }

    function getEmployeeId(event) {
        var $element = $(event.target);
        return $element.data('employee-id');
    }

    function getEmployees(state, event) {
        state.searchKeywords = event.target.value;
        utils.longOperation(employeesPromise, htmlNodes.addEmployeesLoader);

        function employeesPromise() {
            var listPromise = Promise.resolve([]);
            if (state.searchKeywords.length > 0) {
                listPromise = ajax.get('/api/employee?keywords=' + state.searchKeywords, []);
            }
            return listPromise.then(function(employees) {
                state.foundEmployees = utils.arrayDifference(employees, state.skill.Employees, 'Id');
                update.addEmployeesList(state);
            });
        }
    }

    function initializeView(state, event) {
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
            update(state);
        }
    }

    function removeEmployee(state, event) {
        var employeeId = getEmployeeId(event);
        htmlNodes.addEmployeesList.empty();
        htmlNodes.addEmployeesKeywords.val('');
        state.skill.Employees = state.skill.Employees.filter(function(employee) {
            return employee.Id !== employeeId;
        });
        update.skillEmployees(state);
    }

    function removeSkill(state, event) {
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
    }
    
    function save(state, event) {
        ajax.save('/api/skill', state.skill)
        .then(function (skill) {
            if (skill) {
                document.location.href = '/skills/details/' + skill.Id;
            }
        });
    }

    function skillName (state, event) {
        var name = event.target.value;
        state.skill.Name = name;
        update.skillName(state);
    }
})();
