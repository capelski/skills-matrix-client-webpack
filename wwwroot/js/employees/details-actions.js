(function() {
    var js = window.application.jsCommons;
    var ajax = window.application.ajax;
    var paginatedList = window.application.paginatedList;
    var htmlNodes = window.application.employee.htmlNodes;
    var update = window.application.employee.update;

    window.application.employee.attachEvents = function (state) {
        var addSkillsListEventHandlers = {
            searcher: js.eventDelayer(js.eventLinker(searchSkills, state)),
            clearKeywords: js.eventDelayer(js.eventLinker(clearKeywords, state))
        };

        htmlNodes.elementName.on('blur', js.eventLinker(employeeName, state));
        htmlNodes.deleteButton.on('click', js.eventLinker(removeEmployee, state));
        htmlNodes.saveButton.on('click', js.eventLinker(save, state));
        paginatedList.attachEvents(htmlNodes.addSkillsList, addSkillsListEventHandlers);
        htmlNodes.addSkillsList.list.on('click', '.add-skill', js.eventLinker(addSkill, state));
        htmlNodes.skillsList.on('click', '.remove-skill', js.eventLinker(removeSkill, state));
        $().ready(js.eventLinker(initializeView, state));
    };

    function _getSkills(state) {
        js.longOperation(skillsPromise, htmlNodes.addSkillsList.loader);

        function skillsPromise() {
            var listPromise = Promise.resolve(paginatedList.defaultInstance);
            if (state.addSkillsList.keywords.length > 0) {
                listPromise = ajax.get('/api/skill', {
                    keywords: state.addSkillsList.keywords
                }, paginatedList.defaultInstance);
            }
            return listPromise.then(function(paginatedList) {
                state.addSkillsList.results = js.arrayDifference(paginatedList.Items, state.employee.Skills, 'Id');
                update.foundSkills(state);
            });
        }
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

    function clearKeywords(state, event) {
        state.addSkillsList.keywords = '';
        state.addSkillsList.page = 0;
        state.addSkillsList.pageOffset = 0;
        _getSkills(state);
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

    function searchSkills(state, event) {
        state.addSkillsList.keywords = event.target.value;
        state.addSkillsList.page = 0;
        state.addSkillsList.pageOffset = 0;
        _getSkills(state);
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
            return ajax.get('/api/employee/getById', {
                id : state.employee.Id
            })
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
