(function(js, ajax, paginatedListService, elements) {

    function addEmployeesListEmpty(listId) {
        return {
            type: listId + ':updateResults',
            listResults: paginatedListService.getDefaultData(),
            keywords: ''
        };
    }

    function addEmployeesListFill(listId, employees) {
        return {
            type: elements.skillEmployeesList.listId + ':updateResults',
            listResults: {
                Items: employees,
                TotalPages: 0
            }
        };
    }

    function deleteSkill(store) {
        return function (dispatch) {
            var state = store.getState();

            js.actionModal('<div>Are you sure you want to delete ' + state.viewDetails.skill.Name + '?</div>',
            'Delete')
            .then(function() {
                dispatch({
                    type: 'processing'
                });
                return ajax.remove('/api/skill?id=' + state.viewDetails.skill.Id);
            })
            .then(function (skill) {
                if (skill) {
                    document.location.href = '/skills/';
                }
                else {
                    basicModal.close();
                    dispatch({
                        type: 'processed'
                    });
                }
            });
        }
    }

    function skillName(name) {
        return {
            type: 'skillName',
            name: name
        };
    }

    function skillEmployees(employees) {
        return {
            type: 'skillEmployees',
            employees
        };
    }

    function skillEmployeesList(employees, listId) {
        return {
            type: listId + ':updateResults',
            listResults: {
                Items: employees,
                TotalPages: 0
            }
        };
    }

    function loadSkill(store, elements) {
        return function(dispatch) {
            dispatch({
                type: elements.skillEmployeesList.listId + ':initialize',
                loadPhase: 'none'
            });
            dispatch({
                type: elements.addEmployeesList.listId + ':initialize',
                config: {
                    hasSearcher: true,
                    searcherPlaceholder: "Add employees..."
                },
                loadPhase: 'none'
            });

            var state = store.getState();
            var skillId = parseInt(elements.htmlNodes.elementId.val());
            var readOnly = elements.htmlNodes.readOnly.val() == 'true';

            var skillPromise = Promise.resolve(state.viewDetails.skill);
            if (skillId > 0) {
                skillPromise = ajax.get('/api/skill/getById', {
                    id: skillId
                }, state.viewDetails.skill);
            }

            js.stallPromise(skillPromise, 1500)
            .then(function(skill) {
                if (skillId == 0 && !readOnly) {
                    skill.Id = skillId;
                    skill.Name = 'New skill';
                }
                else if (skill.Id == -1) {
                    skill.Name = 'Skill not found';
                    readOnly = true;
                }
                dispatch({
                    type: 'skillLoaded',
                    skill,
                    readOnly
                });
                dispatch({
                    type: elements.skillEmployeesList.listId + ':updateResults',
                    listResults: {
                        Items: skill.Employees,
                        TotalPages: 0
                    },
                    loadPhase: 'none'
                });
            });
        };
    }

    function saveSkill(store) {
        return function (dispatch) {
            dispatch({
                type: 'processing'
            });
            var state = store.getState();
            
            ajax.save('/api/skill', state.viewDetails.skill)
            .then(function (skill) {
                if (skill) {
                    document.location.href = '/skills/details/' + skill.Id;
                }
                else {
                    dispatch({
                        type: 'processed'
                    });
                }
            });
        };
    }

    window.skillDetails = window.skillDetails || {};
    window.skillDetails.actions = {
        addEmployeesListEmpty,
        addEmployeesListFill,
        deleteSkill,
        skillName,
        skillEmployees,
        skillEmployeesList,
        loadSkill,
        saveSkill
    };
    
})(window.JsCommons, window.Ajax,window.PaginatedListService, window.skillDetails.elements);
