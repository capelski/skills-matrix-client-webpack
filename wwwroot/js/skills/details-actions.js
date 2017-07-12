(function() {
    var js = window.JsCommons;
    var ajax = window.Ajax;
    var paginatedList = window.PaginatedList;
    var htmlNodes = window.application.skill.htmlNodes;
    var update = window.application.skill.update;

    window.application.skill.attachEvents = function (state) {
        var addEmployeesListEventHandlers = {
            searcher: js.eventDelayer(function(event) {
                state.addEmployeesList.keywords = event.target.value;
                state.addEmployeesList.page = 0;
                state.addEmployeesList.pageOffset = 0;
                _getEmployees(state);
            }),
            clearKeywords: function(event) {
                state.addEmployeesList.keywords = '';
                state.addEmployeesList.page = 0;
                state.addEmployeesList.pageOffset = 0;
                _getEmployees(state);
            }
        };

        htmlNodes.elementName.on('blur', function(event) {
            skillName(state, event);
        });
        htmlNodes.deleteButton.on('click', function(event) {
            removeSkill(state, event);
        });
        htmlNodes.saveButton.on('click', function(event) {
            save(state, event);
        });
        paginatedList.attachEvents(htmlNodes.addEmployeesList, addEmployeesListEventHandlers);
        htmlNodes.addEmployeesList.list.on('click', '.add-employee', function(event) {
            addEmployee(state, event);
        });
        htmlNodes.employeesList.on('click', '.remove-employee', function(event) {
            removeEmployee(state, event);
        });
        $().ready(function(event) {
            initializeView(state, event);
        });
    };

    function _getEmployees(state) {
        var listPromise = Promise.resolve(paginatedList.defaultInstance);
        if (state.addEmployeesList.keywords.length > 0) {
            listPromise = js.longOperation(ajax.get('/api/employee', {
                keywords: state.addEmployeesList.keywords
            }, paginatedList.defaultInstance), htmlNodes.addEmployeesList.loader);
        }
        
        listPromise.then(function(paginatedList) {
            state.addEmployeesList.results = js.arrayDifference(paginatedList.Items, state.skill.Employees, 'Id');
            update.foundEmployees(state);
        });
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

    function getEmployeeId(event) {
        var $element = $(event.target);
        if ($element.hasClass('fa')) {
            $element = $element.parent();
        }
        var employeeId = $element.data('employee-id');
        return employeeId;
    }

    function initializeView(state, event) {
        var skillPromise = Promise.resolve(state.skill);
        if (state.skill.Id != 0) {
            skillPromise = ajax.get('/api/skill/getById', {
                id: state.skill.Id
            });
        }
        js.longOperation(skillPromise, htmlNodes.loader)
        .then(function(skill) {
            if (skill) {
                state.skill = skill;
            }
            else {
                state.skill.Id = -1;
                state.readOnly = true;
            }
            update(state);
            update.viewWrapper(state);
        });
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
