(function(js, ajax, paginatedListService) {

    var employeesList = paginatedListService.create('employees', null, {
        elementDrawer: function (employee) {
            return '<li class="list-group-item"><a class="reset" href="/employees/details?id=' +
            employee.Id + '">' + employee.Name +
            '<span class="badge floating">' + employee.Skills.length + '</span></a></li>';
        },
        noResultsHtml: '<i>No employees found</i>'
    });

    var skillsList = paginatedListService.create('skills', null, {
        elementDrawer: function (skill) {
            return '<li class="list-group-item"><a class="reset" href="/skills/details?id=' + skill.Id + '">' + skill.Name +
            '<span class="badge floating">' + skill.Employees.length + '</span></a></li>';
        },
        noResultsHtml: '<i>No skills found</i>'
    });

    var reducer = Redux.combineReducers({
        employeesList: paginatedListService.getReducer(employeesList),
        skillsList: paginatedListService.getReducer(skillsList)
    });

    var store = Redux.createStore(reducer, Redux.applyMiddleware(thunk));

    // Use this store declaration for Time Travel debug through DevTools Redux Extension
    //var store = createTimeTravelStore(reducer, [thunk]);

    document.addEventListener("DOMContentLoaded", function() {

        function render(state) {
            paginatedListService.render(employeesList, state, state.employeesList);
            paginatedListService.render(skillsList, state, state.skillsList);
        };

        store.subscribe(function() {
            render(store.getState());
        });

        store.dispatch(function(dispatch) {
            dispatch({
                type: employeesList.listId + ':initialize'
            });
            js.stallPromise(ajax.get('/api/employee/getMostSkilled', {}, []), 1500)
            .then(function(employees) {
                dispatch({
                    type: employeesList.listId + ':updateResults',
                    listResults: {
                        Items: employees,
                        TotalPages: 0
                    }
                });
            });
        });
        
        store.dispatch(function(dispatch) {
            dispatch({
                type: skillsList.listId + ':initialize'
            });
            js.stallPromise(ajax.get('/api/skill/getRearest', {}, []), 1500)
            .then(function(skills) {
                dispatch({
                    type: skillsList.listId + ':updateResults',
                    listResults: {
                        Items: skills,
                        TotalPages: 0
                    }
                });
            });
        });

    });

})(window.JsCommons, window.Ajax, window.PaginatedListService);
