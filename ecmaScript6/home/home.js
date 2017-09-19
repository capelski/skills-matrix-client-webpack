(function(ajax, paginatedListUtils) {

    function viewDetails(state, action) {
        if (typeof state === 'undefined') {
            state = {
                visible: false
            };
        }
        switch (action.type) {
            case 'navigation-loading':
                return {
                    ...state,
                    visible: false
                };
            case 'navigation-changed':
                return {
                    ...state,
                    visible: action.pageId == 'home'
                };
            default:
                return state;
        }
    };

    window.reducers = window.reducers || {};
    window.reducers.home = Redux.combineReducers({
        viewDetails,
        employees: paginatedListUtils.getReducer('employees'),
        skills: paginatedListUtils.getReducer('skills'),
    });

    var employeesListRenderer = paginatedListUtils.getRenderer('home-employees-list', '<i>No employees found</i>',
    function (employee) {
        return '<li class="list-group-item"><a class="reset" href="/employees/details?id=' +
        employee.Id + '">' + employee.Name +
        '<span class="badge floating">' + employee.Skills.length + '</span></a></li>';
    });
    var skillsListRenderer = paginatedListUtils.getRenderer('home-skills-list', '<i>No skills found</i>',
    function (skill) {
        return '<li class="list-group-item"><a class="reset" href="/skills/details?id=' + skill.Id + '">' + skill.Name +
        '<span class="badge floating">' + skill.Employees.length + '</span></a></li>';
    });

    window.renderers = window.renderers || {};
    window.renderers.home = function(state) {
        if (state.viewDetails.visible) {
            $('#home-section').addClass('visible');
            employeesListRenderer(state.employees);
            skillsListRenderer(state.skills);
        }
        else {
            $('#home-section').removeClass('visible');
        }
    };

    // This view does not define action binders because it does not trigger events

    window.pages = window.pages || [];
    window.pages.push({
        id: 'home',
        loader: function(dispatch, pageData) {
        
            dispatch({
                type: 'paginatedListInitialize',
                listId: 'employees'
            });
            dispatch({
                type: 'paginatedListInitialize',
                listId: 'skills'
            });

            var employeesPromise = ajax.get('/api/employee/getMostSkilled', {}, [])
            .then(function(employees) {
                dispatch({
                    type: 'paginatedListResults',
                    listId: 'employees',
                    results: {
                        Items: employees,
                        TotalPages: 0
                    }
                });
            });

            var skillsPromise = ajax.get('/api/skill/getRearest', {}, [])
            .then(function(skills) {
                dispatch({
                    type: 'paginatedListResults',
                    listId: 'skills',
                    results: {
                        Items: skills,
                        TotalPages: 0
                    }
                });
            });

            return Promise.all([employeesPromise, skillsPromise]);
        }
    });

})(window.Ajax, window.PaginatedListUtils);
