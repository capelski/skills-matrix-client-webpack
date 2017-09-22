(function(ajax, paginatedListUtils) {

    var employeeslistReduxId = 'home-employees';
    var employeeslistHtmlId = 'home-employees-list';
    var skillsListReduxId = 'home-skills';
    var skillsListHtmlId = 'home-skills-list';

    window.reducers = window.reducers || {};
    window.reducers.home = Redux.combineReducers({
        employees: paginatedListUtils.getReducer(employeeslistReduxId),
        skills: paginatedListUtils.getReducer(skillsListReduxId),
    });

    var employeesListRenderer = paginatedListUtils.getRenderer(employeeslistHtmlId, '<i>No employees found</i>',
        function (employee) {
            return '<li class="list-group-item"><a class="reset" href="/employees/details?id=' +
            employee.Id + '">' + employee.Name +
            '<span class="badge floating">' + employee.Skills.length + '</span></a></li>';
        });
    var skillsListRenderer = paginatedListUtils.getRenderer(skillsListHtmlId, '<i>No skills found</i>',
        function (skill) {
            return '<li class="list-group-item"><a class="reset" href="/skills/details?id=' +
            skill.Id + '">' + skill.Name +
            '<span class="badge floating">' + skill.Employees.length + '</span></a></li>';
        });

    window.renderers = window.renderers || {};
    window.renderers.home = function(state) {
        employeesListRenderer(state.employees);
        skillsListRenderer(state.skills);
    };

    // This view does not define action binders because it does not trigger events

    window.pages = window.pages || [];
    window.pages.push({
        id: 'home-section',
        loader: function(pageData, store) {
        
            store.dispatch({
                type: 'paginatedListInitialize',
                listId: employeeslistReduxId
            });
            store.dispatch({
                type: 'paginatedListInitialize',
                listId: skillsListReduxId
            });

            var employeesPromise = ajax.get('/api/employee/getMostSkilled', {}, [])
            .then(function(employees) {
                store.dispatch({
                    type: 'paginatedListResults',
                    listId: employeeslistReduxId,
                    results: {
                        Items: employees,
                        TotalPages: 0
                    }
                });
            });

            var skillsPromise = ajax.get('/api/skill/getRearest', {}, [])
            .then(function(skills) {
                store.dispatch({
                    type: 'paginatedListResults',
                    listId: skillsListReduxId,
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
