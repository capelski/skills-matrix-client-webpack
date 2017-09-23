(function(paginatedListService, elements, render, actions) {

    function viewDetails(state, action) {
        if (typeof state === "undefined") {
            state = {
                employee: {
                    Id: -1,
                    Name: '',
                    Skills: []
                },
                loadPhase: 'not-loaded',
                loadPhases: ['not-loaded', 'loading', 'loaded'],
                readOnly: true
            };
        }

        switch (action.type) {
            case 'employeeLoaded':
                return {
                    ...state,
                    loadPhase: 'loaded',
                    readOnly: action.readOnly,
                    employee: action.employee
                };
            case 'employeeName':
                return {
                    ...state,
                    employee: {
                        ...state.employee,
                        Name: action.name
                    }
                };
            case 'employeeSkills':
                return {
                    ...state,
                    employee: {
                        ...state.employee,
                        Skills: action.skills
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
        employeeSkillsList: paginatedListService.getReducer(elements.employeeSkillsList),
        addSkillsList: paginatedListService.getReducer(elements.addSkillsList),
        viewDetails
    });
    //var store = Redux.createStore(reducer, Redux.applyMiddleware(thunk));

    // Use this store declaration for Time Travel debug through DevTools Redux Extension
    var store = createTimeTravelStore(reducer, [thunk]);

    document.addEventListener("DOMContentLoaded", function() {
        
        function getSkillId(event) {
            var $element = $(event.target);
            if ($element.hasClass('fa')) {
                $element = $element.parent();
            }
            var skillId = $element.data('skill-id');
            return skillId;
        }

        elements.htmlNodes.elementName.on('blur', function(event) {
            store.dispatch(actions.employeeName(event.target.value));
        });

        elements.htmlNodes.deleteButton.on('click', function(event) {
            store.dispatch(actions.deleteEmployee(store));
        });

        elements.htmlNodes.saveButton.on('click', function(event) {
            store.dispatch(actions.saveEmployee(store));
        });

        elements.htmlNodes.addSkillsList.list.on('click', '.add-skill', function(event) {
            var state = store.getState();
            var skillId = getSkillId(event);
            var skill = state.addSkillsList.results.find(function(skill) {
                return skill.Id === skillId;
            });
            if (skill) {
                var skills = state.viewDetails.employee.Skills.concat([skill]);
                store.dispatch(actions.employeeSkills(skills));
                store.dispatch(actions.employeeSkillsList(skills, elements.employeeSkillsList.listId));
            }
            store.dispatch(actions.addSkillsListEmpty(elements.addSkillsList.listId));
        });

        elements.htmlNodes.employeeSkillsList.list.on('click', '.remove-skill', function(event) {
            var state = store.getState();
            var skillId = getSkillId(event);
            var skills = state.viewDetails.employee.Skills.filter(function(skill) {
                return skill.Id !== skillId;
            });
            store.dispatch(actions.employeeSkills(skills));
            store.dispatch(actions.addSkillsListFill(elements.employeeSkillsList.listId, skills));
        });

        paginatedListService.attachActions(elements.addSkillsList, store);

        store.subscribe(function() {
            render(store.getState());
        });

        store.dispatch(actions.loadEmployee(store, elements));
    });

})(window.PaginatedListService, window.employeeDetails.elements,
    window.employeeDetails.render, window.employeeDetails.actions);
