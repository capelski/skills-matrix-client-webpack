(function() {
    var ajax = window.application.ajax;
    var state = {
        keywords: '',
        page: 0,
        pageSize: 10,
        employees: []
    };
    var searchList = new window.application.SearchList('employees', employeesPromise, {
        elementDrawer: employeeDrawer,
        noResultsHtml: '<i>No employees found</i>'
    });

    searchList.reload();

    function employeeDrawer(employee) {
        return '<li class="list-group-item"><a class="reset" href="/employees/details?id=' + employee.Id + '">' + employee.Name + '</a></li>';
    }

    function employeesPromise(keywords) {
        state.keywords = keywords;
        return ajax.get('/api/employee?keywords=' + state.keywords + '&page=' + state.page + '&pageSize=' + state.pageSize, [])
        .then(function(employees) {
            state.employees = employees;
            return employees;
        });
    }
})();
