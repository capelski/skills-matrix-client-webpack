(function(js, ajax, paginatedList) {

    var htmlNodes = {
        addSkillsList: paginatedList.getHtmlNodes('add-skills'),
        loader : $('#loader'),
        elementId : $('#model-id'),
        readOnly : $('#read-only'),
        pageTitle : $('#page-title'),
        elementName : $('#model-name'),
        skillsList : $('#skills-list'),
        editButton : $('#edit-button'),
        deleteButton : $('#delete-button'),
        saveButton : $('#save-button'),
        cancelButton : $('#cancel-button'),
        viewWrapper : $('#view-wrapper')
    };

    function render(state) {
        render.readOnly(state);
        render.foundSkills(state);
        render.employeeName(state);
    }

    render.foundSkills = function (state) {
        paginatedList.htmlUpdater(htmlNodes.addSkillsList, state.addSkillsList, {
            elementDrawer: function (skill) {
                return '<li class="list-group-item"><span class="add-skill" data-skill-id="' + skill.Id + '"><i class="fa fa-plus text-success"></i> '
                + skill.Name + '</span></li>';
            },
            noResultsHtml: '<i>No skills found</i>'
        });
    };

    render.employeeName = function(state) {
        htmlNodes.elementName.val(state.employee.Name);
    };

    render.employeeSkills = function(state) {
        htmlNodes.skillsList.empty();
        if (state.employee.Skills.length === 0) {
            htmlNodes.skillsList.append('<i>No skills assigned yet</i>');
        }
        for (var key in state.employee.Skills) {
            var skill = state.employee.Skills[key];
            var html = '<li class="list-group-item"><a class="reset" href="/skills/details?id=' + skill.Id + '">' + skill.Name + '</a></li>';
            if (!state.readOnly) {
                html = '<li class="list-group-item"><span class="remove-skill" data-skill-id="' + skill.Id + '"><i class="fa fa-times text-danger"></i> '
                + skill.Name + '</span></li>';
            }
            htmlNodes.skillsList.append(html);
        }
    };

    render.readOnly = function(state) {
        htmlNodes.addSkillsList.wrapper.hide();
        htmlNodes.editButton.hide();
        htmlNodes.editButton.attr('href', '#');
        htmlNodes.deleteButton.hide();
        htmlNodes.pageTitle.text('Employee not found');            
        htmlNodes.saveButton.hide();
        htmlNodes.cancelButton.hide();
        htmlNodes.cancelButton.attr('href', '#');

        if (state.readOnly) {
            htmlNodes.elementName.attr('disabled', 'disabled');
            if (state.employee.Id > 0) {
                htmlNodes.pageTitle.text(state.employee.Name);
                htmlNodes.editButton.attr('href', '/employees/edit?id=' + state.employee.Id);
                htmlNodes.editButton.show();
                htmlNodes.deleteButton.show();
            }
        }
        else {
            htmlNodes.elementName.removeAttr('disabled');                
            if (state.employee.Id >= 0) {
                htmlNodes.pageTitle.text('New employee');
                htmlNodes.addSkillsList.wrapper.show();
                htmlNodes.saveButton.show();
                htmlNodes.cancelButton.show();
                htmlNodes.cancelButton.attr('href', '/employees/');

                if (state.employee.Id > 0) {
                    htmlNodes.pageTitle.text(state.employee.Name);
                    htmlNodes.cancelButton.attr('href', '/employees/details?id=' + state.employee.Id);
                }
            }
        }

        render.employeeSkills(state);
    };

    render.viewWrapper = function (state) {
        htmlNodes.viewWrapper.css({
            visibility: 'visible'
        });
    };

    function attachEvents(state) {
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
                render.foundSkills(state);
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
            render.employeeSkills(state);
        }
        render.foundSkills(state);
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
        render.employeeName(state);
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
            render(state);
            render.viewWrapper(state);
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
        render.employeeSkills(state);
    }

    function save(state, event) {
        ajax.save('/api/employee', state.employee)
        .then(function (employee) {
            if (employee) {
                document.location.href = '/employees/details/' + employee.Id;
            }
        });
    }

    var state = {
        addSkillsList: paginatedList.getState(),
        employee: {
            Id: parseInt(htmlNodes.elementId.val()),
            Name: '',
            Skills: []
        },
        readOnly: htmlNodes.readOnly.val() == 'true'
    };

    attachEvents(state);

})(JsCommons, Ajax, PaginatedList);
