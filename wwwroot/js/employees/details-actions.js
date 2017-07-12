(function() {
    var js = window.JsCommons;
    var ajax = window.Ajax;
    var paginatedList = window.PaginatedList;
    var htmlNodes = window.application.employee.htmlNodes;
    var update = window.application.employee.update;

    window.application.employee.attachEvents = function (state) {
        var addSkillsListEventHandlers = {
            searcher: js.eventDelayer(function(event) {
                state.addSkillsList.keywords = event.target.value;
                state.addSkillsList.page = 0;
                state.addSkillsList.pageOffset = 0;
                _getSkills(state);
            }),
            clearKeywords: function(event) {
                state.addSkillsList.keywords = '';
                state.addSkillsList.page = 0;
                state.addSkillsList.pageOffset = 0;
                _getSkills(state);
            }
        };

        htmlNodes.elementName.on('blur', function(event) {
            employeeName(state, event);
        });
        htmlNodes.deleteButton.on('click', function(event) {
            removeEmployee(state, event);
        });
        htmlNodes.saveButton.on('click', function(event) {
            save(state, event);
        });
        paginatedList.attachEvents(htmlNodes.addSkillsList, addSkillsListEventHandlers);
        htmlNodes.addSkillsList.list.on('click', '.add-skill', function(event) {
            addSkill(state, event);
        });
        htmlNodes.skillsList.on('click', '.remove-skill', function(event) {
            removeSkill(state, event);
        });
        $().ready(function(event) {
            initializeView(state, event);
        });
    };

    function _getSkills(state) {
        var skillsPromise = Promise.resolve(paginatedList.defaultInstance);
        if (state.addSkillsList.keywords.length > 0) {
            skillsPromise = js.longOperation(ajax.get('/api/skill', {
                keywords: state.addSkillsList.keywords
            }, paginatedList.defaultInstance), htmlNodes.addSkillsList.loader);
        }

        skillsPromise.then(function(paginatedList) {
            state.addSkillsList.results = js.arrayDifference(paginatedList.Items, state.employee.Skills, 'Id');
            update.foundSkills(state);
        });
    }

    function addSkill (state, event) {
        var skillId = getSkillId(event);
        var skill = state.addSkillsList.results.find(function(skill) {
            return skill.Id === skillId;
        });
        state.addSkillsList.results = [];
        state.addSkillsList.keywords = '';
        if (skill) {
            state.employee.Skills.push(skill);
            update.employeeSkills(state);
        }
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

    function initializeView(state, event) {
        var employeePromise = Promise.resolve(state.employee);
        if (state.employee.Id != 0) {
            employeePromise = ajax.get('/api/employee/getById', {
                id : state.employee.Id
            });
        }

        js.longOperation(employeePromise, htmlNodes.loader)
        .then(function(employee) {
            if (employee) {
                state.employee = employee;
            }
            else {
                state.employee.Id = -1;
                state.readOnly = true;
            }
            update(state);
            update.viewWrapper(state);
        });
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
