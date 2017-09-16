(function(js, ajax, paginatedListService) {

    var skillEmployeesList = paginatedListService.create('employees', null, {
        elementDrawer: function (item, state) {
            var html = '<li class="list-group-item"><a class="reset" href="/employees/details?id=' +
            item.Id + '">' + item.Name + '</a></li>';
            if (!state.viewDetails.readOnly) {
                html = '<li class="list-group-item"><span class="remove-employee" data-employee-id="' +
                item.Id + '"><i class="fa fa-times text-danger"></i> '
                + item.Name + '</span></li>';
            }
            return html;
        },
        noResultsHtml: '<i>No employees assigned yet</i>'
    });

    function addEmployeesFetcher(state) {
        var employeesPromise = Promise.resolve(paginatedListService.getDefaultData());
        if (state.addEmployeesList.keywords.length > 0) {
            employeesPromise = js.stallPromise(ajax.get('/api/employee', {
                keywords: state.addEmployeesList.keywords
            }, paginatedListService.getDefaultData()), 1500);
        }
        return employeesPromise
        .then(function(listResults) {
            listResults.Items = js.arrayDifference(listResults.Items, state.viewDetails.skill.Employees, 'Id');
            return listResults;
        });
    }

    var addEmployeesList = paginatedListService.create('add-employees', addEmployeesFetcher, {
        elementDrawer: function (employee, state) {
            return '<li class="list-group-item"><span class="add-employee" data-employee-id="' + employee.Id +
            '"><i class="fa fa-plus text-success"></i> '
            + employee.Name + '</span></li>';
        },
        noResultsHtml: '<i>No employees found</i>'
    });

    var htmlNodes = {
        addEmployeesList: addEmployeesList.htmlNodes,
        loader : $('#loader'),
        elementId : $('#model-id'),
        readOnly : $('#read-only'),
        pageTitle : $('#page-title'),
        elementName : $('#model-name'),
        skillEmployeesList : skillEmployeesList.htmlNodes,
        editButton : $('#edit-button'),
        deleteButton : $('#delete-button'),
        saveButton : $('#save-button'),
        cancelButton : $('#cancel-button')
    };

    window.skillDetails = window.skillDetails || {};
    window.skillDetails.elements = {
        skillEmployeesList,
        addEmployeesList,
        htmlNodes
    };
    
})(window.JsCommons, window.Ajax, window.PaginatedListService);
