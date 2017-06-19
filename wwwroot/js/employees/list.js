(function() {
    var ajax = window.application.ajax;
    var values = {
        keywords: '',
        page: 0,
        pageSize: 10
    };
    var htmlNodes = {
        loader : $('#loader'),
        employeesList: $('#employees-list'),
        keywords: $('#keywords')
    };

    window.application.Searcher(htmlNodes.keywords, loadView);
    loadView(values.keywords);

    function loadView(keywords) {
        values.keywords = keywords;
        var promiseBuilder = ajax.get(
            '/api/employee?keywords=' + values.keywords + '&page=' + values.page + '&pageSize=' + values.pageSize, viewUpdater, []);
        window.application.utils.longOperation(promiseBuilder, htmlNodes.loader);        
    }

    function viewUpdater(employees) {
        htmlNodes.employeesList.empty();
        employees.forEach(function(employee) {
            htmlNodes.employeesList.append('<li class="list-group-item"><a class="reset" href="/employees/details?id=' + employee.Id + '">' + employee.Name + '</a></li>');
        });
    }
})();
