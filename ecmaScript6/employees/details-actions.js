(function(js, ajax, paginatedListService, elements) {

    function addSkillsListEmpty(listId) {
        return {
            type: listId + ':updateResults',
            listResults: paginatedListService.getDefaultData(),
            keywords: ''
        };
    }

    function addSkillsListFill(listId, skills) {
        return {
            type: elements.employeeSkillsList.listId + ':updateResults',
            listResults: {
                Items: skills,
                TotalPages: 0
            }
        };
    }

    function deleteEmployee(store) {
        return function (dispatch) {
            var state = store.getState();

            js.actionModal('<div>Are you sure you want to delete ' + state.viewDetails.employee.Name + '?</div>',
            'Delete')
            .then(function() {
                dispatch({
                    type: 'processing'
                });
                return ajax.remove('/api/employee?id=' + state.viewDetails.employee.Id);
            })
            .then(function (employee) {
                if (employee) {
                    document.location.href = '/employees/';
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

    function employeeName(name) {
        return {
            type: 'employeeName',
            name: name
        };
    }

    function employeeSkills(skills) {
        return {
            type: 'employeeSkills',
            skills
        };
    }

    function employeeSkillsList(skills, listId) {
        return {
            type: listId + ':updateResults',
            listResults: {
                Items: skills,
                TotalPages: 0
            }
        };
    }

    function loadEmployee(store, elements) {
        return function(dispatch) {
            dispatch({
                type: elements.employeeSkillsList.listId + ':initialize',
                loadPhase: 'none'
            });
            dispatch({
                type: elements.addSkillsList.listId + ':initialize',
                config: {
                    hasSearcher: true,
                    searcherPlaceholder: "Add skills..."
                },
                loadPhase: 'none'
            });

            var state = store.getState();
            var employeeId = parseInt(elements.htmlNodes.elementId.val());
            var readOnly = elements.htmlNodes.readOnly.val() == 'true';

            var employeePromise = Promise.resolve(state.viewDetails.employee);
            if (employeeId > 0) {
                employeePromise = ajax.get('/api/employee/getById', {
                    id: employeeId
                }, state.viewDetails.employee);
            }

            js.stallPromise(employeePromise, 1500)
            .then(function(employee) {
                if (employeeId == 0 && !readOnly) {
                    employee.Id = employeeId;
                    employee.Name = 'New employee';
                }
                else if (employee.Id == -1) {
                    employee.Name = 'Employee not found';
                    readOnly = true;
                }
                dispatch({
                    type: 'employeeLoaded',
                    employee,
                    readOnly
                });
                dispatch({
                    type: elements.employeeSkillsList.listId + ':updateResults',
                    listResults: {
                        Items: employee.Skills,
                        TotalPages: 0
                    },
                    loadPhase: 'none'
                });
            });
        };
    }

    function saveEmployee(store) {
        return function (dispatch) {
            dispatch({
                type: 'processing'
            });
            var state = store.getState();
            
            ajax.save('/api/employee', state.viewDetails.employee)
            .then(function (employee) {
                if (employee) {
                    document.location.href = '/employees/details/' + employee.Id;
                }
                else {
                    dispatch({
                        type: 'processed'
                    });
                }
            });
        };
    }

    window.employeeDetails = window.employeeDetails || {};
    window.employeeDetails.actions = {
        addSkillsListEmpty,
        addSkillsListFill,
        deleteEmployee,
        employeeName,
        employeeSkills,
        employeeSkillsList,
        loadEmployee,
        saveEmployee
    };
    
})(window.JsCommons, window.Ajax,window.PaginatedListService, window.employeeDetails.elements);
