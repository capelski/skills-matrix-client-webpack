(function() {
    var values = {
        keywords: "",
        page: 0,
        pageSize: 10
    };
    var htmlNodes = {
        employeesList: $('#employees-list'),
        loader : $('#loader')
    };

    loadView();

    function loadView() {
        window.application.utils.loader.show(htmlNodes.loader);
        $.ajax({
            type: 'GET',
            url: '/api/employee?keywords=' + values.keywords + '&page=' + values.page + '&pageSize=' + values.pageSize
        })
        .then(viewUpdater)
        .fail(function(response) {
            toastr.error('An error ocurred', 'Oops!', {timeOut: 5000});
            viewUpdater([]);
        })
        .always(function() {
            window.application.utils.loader.hide(htmlNodes.loader);
        });
    }

    function viewUpdater(employees) {
        htmlNodes.employeesList.empty();
        employees.forEach(function(employee) {
            htmlNodes.employeesList.append('<li class="list-group-item"><a class="reset" href="/employee/details?id=' + employee.Id + '">' + employee.Name + '</a></li>');
        });
    }
})();
