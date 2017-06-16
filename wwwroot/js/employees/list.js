(function() {
    var values = {
        keywords: "",
        page: 0,
        pageSize: 10
    };
    var htmlNodes = {
        loader : $('#loader'),
        employeesList: $('#employees-list'),
        keywords: $('#keywords')
    };

    htmlNodes.keywords.on('keyup', search);
    loadView();

    function loadView() {
        var promiseBuilder = function() {
            return $.ajax({
                type: 'GET',
                url: '/api/employee?keywords=' + values.keywords + '&page=' + values.page + '&pageSize=' + values.pageSize
            })
            .then(viewUpdater)
            .fail(function(response) {
                toastr.error('An error ocurred', 'Oops!', {timeOut: 5000});
                viewUpdater([]);
            });
        }
        window.application.utils.longOperation(promiseBuilder, htmlNodes.loader);        
    }

    function search(event) {
        values.keywords = event.target.value;
        loadView();
    }

    function viewUpdater(employees) {
        htmlNodes.employeesList.empty();
        employees.forEach(function(employee) {
            htmlNodes.employeesList.append('<li class="list-group-item"><a class="reset" href="/employee/details?id=' + employee.Id + '">' + employee.Name + '</a></li>');
        });
    }
})();
