(function(ajax, paginatedListUtils) {

    var viewName = 'homeSection';
    var employeeslistReduxId = 'home-employees';
    var employeeslistHtmlId = 'home-employees-list';
    var skillsListReduxId = 'home-skills';
    var skillsListHtmlId = 'home-skills-list';

    var viewReducer = Redux.combineReducers({
        employees: paginatedListUtils.getReducer(employeeslistReduxId),
        skills: paginatedListUtils.getReducer(skillsListReduxId),
    });

    var employeesListRenderer = paginatedListUtils.getRenderer(employeeslistHtmlId, '<i>No employees found</i>',
        function (employee) {
            return `<li class="list-group-item">
                        <a class="reset" onclick="window.Navigate('employee-details-section',
                        { employeeId: ${ employee.Id }, readOnly: true });" href="#">
                            ${ employee.Name }
                            <span class="badge floating">${ employee.Skills.length }</span>
                        </a>
                    </li>`;
        });
    var skillsListRenderer = paginatedListUtils.getRenderer(skillsListHtmlId, '<i>No skills found</i>',
        function (skill) {
            return `<li class="list-group-item">
                        <a class="reset" onclick="window.Navigate('skill-details-section',
                        { skillId: ${ skill.Id }, readOnly: true});" href="#">
                            ${ skill.Name }
                            <span class="badge floating">${ skill.Employees.length }</span>
                        </a>
                    </li>`;
        });

    var viewRenderer = function(state) {
        employeesListRenderer(state.employees);
        skillsListRenderer(state.skills);
    };

    var viewLoader = function(viewData, dispatch) {
        dispatch({
            type: 'paginatedListInitialize',
            listId: employeeslistReduxId
        });
        dispatch({
            type: 'paginatedListInitialize',
            listId: skillsListReduxId
        });

        var employeesPromise = ajax.get('/api/employee/getMostSkilled', {}, [])
        .then(function(employees) {
            dispatch({
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
            dispatch({
                type: 'paginatedListResults',
                listId: skillsListReduxId,
                results: {
                    Items: skills,
                    TotalPages: 0
                }
            });
        });

        return Promise.all([employeesPromise, skillsPromise]);
    };

    window.Views = window.Views || [];
    window.Views.push({
        name: viewName,
        htmlNodeId: 'home-section',
        reducer: viewReducer,
        renderer: viewRenderer,
        loader: viewLoader
    });

})(window.Ajax, window.PaginatedListUtils);
