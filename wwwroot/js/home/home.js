(function(js, ajax, paginatedList) {

    function loadEmployees(state, dispatch) {
        js.stallPromise(ajax.get('/api/employee/getMostSkilled', {}, []), 1500)
        .then(function(employees) {
            dispatch({
                target: 'employees',
                paginatedList: {
                    Items: employees,
                    TotalPages: 0
                },
                type: 'updateResults'
            });
        });
    }

    function loadSkills(state, dispatch) {
        js.stallPromise(ajax.get('/api/skill/getRearest', {}, []), 1500)
        .then(function(skills) {
            dispatch({
                target: 'skills',
                paginatedList: {
                    Items: skills,
                    TotalPages: 0
                },
                type: 'updateResults'
            });
        });
    }

    function Home(options) {
        var self = this;
        self.htmlNodes = options.htmlNodes;
        self.store = options.store;
        self.initialize = function() {
            self.store.dispatch(function(dispatch) {
                dispatch({
                    target: 'employees|skills',
                    type: 'initialize'
                });
                var state = self.store.getState();
                loadEmployees(state.employeesList, dispatch);
                loadSkills(state.skillsList, dispatch);
            });
        };

        function render() {
            var state = self.store.getState();
            paginatedList.render(self.htmlNodes.employeesList, state.employeesList, {
                elementDrawer: function (employee) {
                    return '<li class="list-group-item"><a class="reset" href="/employees/details?id=' + employee.Id + '">' + employee.Name +
                    '<span class="badge floating">' + employee.Skills.length + '</span></a></li>';
                },
                noResultsHtml: '<i>No employees found</i>'
            });
            paginatedList.render(self.htmlNodes.skillsList, state.skillsList, {
                elementDrawer: function (skill) {
                    return '<li class="list-group-item"><a class="reset" href="/skills/details?id=' + skill.Id + '">' + skill.Name +
                    '<span class="badge floating">' + skill.Employees.length + '</span></a></li>';
                },
                noResultsHtml: '<i>No skills found</i>'
            });
        };

        self.store.subscribe(render);
    }

    function reducer(state, action) {
        if (typeof state == "undefined") {
            state = {};
        }

        if (action.target && action.target.indexOf('employees') > -1) {
            state.employeesList = paginatedList.reducer(state.employeesList, action);
        }
        if (action.target && action.target.indexOf('skills') > -1) {
            state.skillsList = paginatedList.reducer(state.skillsList, action);
        }

        return state;
    }

    var store = Redux.createStore(reducer, Redux.applyMiddleware(thunk));

    document.addEventListener("DOMContentLoaded", function() {
        var home = new Home({
            htmlNodes: {
                employeesList: paginatedList.getHtmlNodes('employees'),
                skillsList: paginatedList.getHtmlNodes('skills')
            },
            store: store
        });
        home.initialize();
    });

})(window.JsCommons, window.Ajax, window.PaginatedList);
