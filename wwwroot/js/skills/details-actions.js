(function() {
    var js = window.application.jsCommons;
    var ajax = window.application.ajax;
    var paginatedList = window.application.paginatedList;
    var htmlNodes = window.application.skill.htmlNodes;
    var update = window.application.skill.update;

    window.application.skill.attachEvents = function (state) {
        var addEmployeesListEventHandlers = {
            searcher: js.eventDelayer(js.eventLinker(searchEmployees, state)),
            clearKeywords: js.eventDelayer(js.eventLinker(clearKeywords, state))
        };

        htmlNodes.elementName.on('blur', js.eventLinker(skillName, state));
        htmlNodes.deleteButton.on('click', js.eventLinker(removeSkill, state));
        htmlNodes.saveButton.on('click', js.eventLinker(save, state));
        paginatedList.attachEvents(htmlNodes.addEmployeesList, addEmployeesListEventHandlers);
        htmlNodes.addEmployeesList.list.on('click', '.add-employee', js.eventLinker(addEmployee, state));
        htmlNodes.employeesList.on('click', '.remove-employee', js.eventLinker(removeEmployee, state));
        $().ready(js.eventLinker(initializeView, state));
    };

    function _getEmployees(state) {
        js.longOperation(employeesPromise, htmlNodes.addEmployeesList.loader);

        function employeesPromise() {
            var listPromise = Promise.resolve(paginatedList.defaultInstance);
            if (state.addEmployeesList.keywords.length > 0) {
                listPromise = ajax.get('/api/employee', {
                    keywords: state.addEmployeesList.keywords
                }, paginatedList.defaultInstance);
            }
            return listPromise.then(function(paginatedList) {
                state.addEmployeesList.results = js.arrayDifference(paginatedList.Items, state.skill.Employees, 'Id');
                update.foundEmployees(state);
            });
        }
    }

    function addEmployee (state, event) {
        var employeeId = getEmployeeId(event);
        var employee = state.addEmployeesList.results.find(function(employee) {
            return employee.Id === employeeId;
        });
        state.addEmployeesList.results = [];
        state.addEmployeesList.keywords = '';
        if (employee) {
            state.skill.Employees.push(employee);
            update.skillEmployees(state);
        }
        update.foundEmployees(state);
    }

    function clearKeywords(state, event) {
        state.addEmployeesList.keywords = '';
        state.addEmployeesList.page = 0;
        state.addEmployeesList.pageOffset = 0;
        _getEmployees(state);
    }

    function getEmployeeId(event) {
        var $element = $(event.target);
        if ($element.hasClass('fa')) {
            $element = $element.parent();
        }
        var employeeId = $element.data('employee-id');
        return employeeId;
    }

    function searchEmployees(state, event) {
        state.addEmployeesList.keywords = event.target.value;
        state.addEmployeesList.page = 0;
        state.addEmployeesList.pageOffset = 0;
        _getEmployees(state);
    }

    function initializeView(state, event) {
        var skillPromise = createPromise;
        if (state.skill.Id != 0) {
            skillPromise = getPromise;
        }
        js.longOperation(skillPromise, htmlNodes.loader);

        function createPromise() {
            return Promise.resolve(state.skill)
            .then(loadHandler);
        }

        function getPromise() {
            return ajax.get('/api/skill/getById', {
                id: state.skill.Id
            })
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
        state.skill.Employees = state.skill.Employees.filter(function(employee) {
            return employee.Id !== employeeId;
        });
        update.skillEmployees(state);
    }

    function removeSkill(state, event) {
        js.actionModal('<div>Are you sure you want to delete ' + state.skill.Name + '?</div>', 'Delete')
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
