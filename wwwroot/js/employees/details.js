(function() {
    var htmlNodes = window.application.employee.htmlNodes;
    var values = window.application.employee.values;
    var viewUpdater = window.application.employee.viewUpdater;

    htmlNodes.deleteButton.on('click', removePopup);
    htmlNodes.saveButton.on('click', save);
    loadView();

    function loadView() {
        if (values.elementId != 0) {
            var promiseBuilder = function() {
                return $.ajax({
                    type: 'GET',
                    url: '/api/employee/getById?id=' + values.elementId
                })
                .then(function(employee) {
                    viewUpdater(employee, values.readOnly);
                })
                .fail(function(response) {
                    toastr.error('An error ocurred', 'Oops!', {timeOut: 5000});
                    viewUpdater(null, true);
                });
            }
            window.application.utils.longOperation(promiseBuilder, htmlNodes.loader);
        }
        else {
            viewUpdater(null, values.readOnly);
        }
    }

    function remove() {
        $.ajax({
            type: 'DELETE',
            url: '/api/employee?id=' + values.elementId
        })
        .then(function(employee) {
            document.location.href = '/employees/';
        })
        .fail(function(response) {
            toastr.error('An error ocurred', 'Oops!', {timeOut: 5000})
        });
    };

    function removePopup() {
        basicModal.show({
            body: '<div>Are you sure you want to delete ' + htmlNodes.elementName.val() + '?</div>',
            buttons: {
                cancel: {
                    title: 'Cancel',
                    fn: function() {
                        basicModal.close();
                    }
                },
                action: {
                    title: 'Delete',
                    fn: remove
                }
            }
        });
    }

    function save() {
        var request = {
            type: 'POST',
            url: '/api/employee',
            contentType: 'application/json',
            data: JSON.stringify({
                Id: values.elementId,
                Name: htmlNodes.elementName.val()
            })
        };

        if (values.elementId !== 0) {
            request.type = 'PUT';
            request.url = '/api/employee/';
        }

        $.ajax(request)
        .then(function(employee) {
            document.location.href = '/employees/details/' + employee.Id;
        })
        .fail(function(response) {
            toastr.error('An error ocurred', 'Oops!', {timeOut: 5000})
        });
    };
})();
