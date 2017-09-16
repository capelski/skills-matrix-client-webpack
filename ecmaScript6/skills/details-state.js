(function(paginatedListService, elements, render, actions) {

    function viewDetails(state, action) {
        if (typeof state === "undefined") {
            state = {
                skill: {
                    Id: -1,
                    Name: '',
                    Employees: []
                },
                loadPhase: 'not-loaded',
                loadPhases: ['not-loaded', 'loading', 'loaded'],
                readOnly: true
            };
        }

        switch (action.type) {
            case 'skillLoaded':
                return {
                    ...state,
                    loadPhase: 'loaded',
                    readOnly: action.readOnly,
                    skill: action.skill
                };
            case 'skillName':
                return {
                    ...state,
                    skill: {
                        ...state.skill,
                        Name: action.name
                    }
                };
            case 'skillEmployees':
                return {
                    ...state,
                    skill: {
                        ...state.skill,
                        Employees: action.employees
                    }
                };
            case 'processing':
                return {
                    ...state,
                    loadPhase: 'loading'
                };
            case 'processed':
                return {
                    ...state,
                    loadPhase: 'loaded'
                };
            default:
                return state;
        }
    }

    var reducer = Redux.combineReducers({
        skillEmployeesList: paginatedListService.getReducer(elements.skillEmployeesList),
        addEmployeesList: paginatedListService.getReducer(elements.addEmployeesList),
        viewDetails
    });
    //var store = Redux.createStore(reducer, Redux.applyMiddleware(thunk));

    // Use this store declaration for Time Travel debug through DevTools Redux Extension
    var store = createTimeTravelStore(reducer, [thunk]);

    document.addEventListener("DOMContentLoaded", function() {
        
        function getEmployeeId(event) {
            var $element = $(event.target);
            if ($element.hasClass('fa')) {
                $element = $element.parent();
            }
            var employeeId = $element.data('employee-id');
            return employeeId;
        }

        elements.htmlNodes.elementName.on('blur', function(event) {
            store.dispatch(actions.skillName(event.target.value));
        });

        elements.htmlNodes.deleteButton.on('click', function(event) {
            store.dispatch(actions.deleteSkill(store));
        });

        elements.htmlNodes.saveButton.on('click', function(event) {
            store.dispatch(actions.saveSkill(store));
        });

        elements.htmlNodes.addEmployeesList.list.on('click', '.add-employee', function(event) {
            var state = store.getState();
            var employeeId = getEmployeeId(event);
            var employee = state.addEmployeesList.results.find(function(employee) {
                return employee.Id === employeeId;
            });
            if (employee) {
                var employees = state.viewDetails.skill.Employees.concat([employee]);
                store.dispatch(actions.skillEmployees(employees));
                store.dispatch(actions.skillEmployeesList(employees, elements.skillEmployeesList.listId));
            }
            store.dispatch(actions.addEmployeesListEmpty(elements.addEmployeesList.listId));
        });

        elements.htmlNodes.skillEmployeesList.list.on('click', '.remove-employee', function(event) {
            var state = store.getState();
            var employeeId = getEmployeeId(event);
            var employees = state.viewDetails.skill.Employees.filter(function(employee) {
                return employee.Id !== employeeId;
            });
            store.dispatch(actions.skillEmployees(employees));
            store.dispatch(actions.addEmployeesListFill(elements.skillEmployeesList.listId, employees));
        });

        paginatedListService.attachActions(elements.addEmployeesList, store)

        store.subscribe(function() {
            render(store.getState());
        });

        store.dispatch(actions.loadSkill(store, elements));
    });

})(window.PaginatedListService, window.skillDetails.elements,
    window.skillDetails.render, window.skillDetails.actions);
