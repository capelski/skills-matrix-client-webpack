(function() {
    var htmlNodes = window.application.skill.htmlNodes;
    var values = window.application.skill.values;
    var viewUpdater = window.application.skill.viewUpdater;
    var searchTimeout;

    window.addEmployee = addEmployee;
    window.removeEmployee = removeEmployee;

    htmlNodes.employeeKeywords.on('keyup', search);
    htmlNodes.deleteButton.on('click', removePopup);
    htmlNodes.saveButton.on('click', save);
    loadView();

    function loadView() {
        if (values.elementId != 0) {
            var promiseBuilder = function() {
                return $.ajax({
                    type: 'GET',
                    url: '/api/skill/getById?id=' + values.elementId
                })
                .then(function(skill) {
                    values.skill = skill;
                    viewUpdater(skill, values.readOnly);
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
            url: '/api/skill?id=' + values.elementId
        })
        .then(function(skill) {
            document.location.href = '/skills/';
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
            url: '/api/skill',
            contentType: 'application/json',
            data: JSON.stringify({
                Id: values.elementId,
                Name: htmlNodes.elementName.val()
            })
        };

        if (values.elementId !== 0) {
            request.type = 'PUT';
            request.url = '/api/skill/';
        }

        $.ajax(request)
        .then(function(skill) {
            document.location.href = '/skills/details/' + skill.Id;
        })
        .fail(function(response) {
            toastr.error('An error ocurred', 'Oops!', {timeOut: 5000})
        });
    };

    function search(event) {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        searchTimeout = setTimeout(function() {
            var keywords = event.target.value;
            if (keywords.length > 0) {
                var promiseBuilder = function() {
                    return $.ajax({
                        type: 'GET',
                        url: '/api/employee?keywords=' + keywords
                    })
                    .then(updateEmployees)
                    .fail(function(response) {
                        toastr.error('An error ocurred', 'Oops!', {timeOut: 5000});
                        updateEmployees([]);
                    });
                }
                window.application.utils.longOperation(promiseBuilder, htmlNodes.addEmployeeLoader);
            }
            else {
                updateEmployees([]);                
            }
            searchTimeout = null;
        }, 300);
    }

    function updateEmployees(employees) {
        htmlNodes.addEmployeeList.empty();
        values.employees = employees.filter(function(candidate) {
            return values.skill.Employees.filter(function(employee) {
                return candidate.Id === employee.Id;
            }).length === 0;
        });
        values.employees.forEach(function(employee) {
            var html = '<li class="list-group-item" onclick="addEmployee(' + employee.Id + ')"><i class="fa fa-plus text-success"></i> ' + employee.Name + '</li>';
            htmlNodes.addEmployeeList.append(html);
        });
    }

    function addEmployee(employeeId) {
        htmlNodes.addEmployeeList.empty();
        var employee = values.employees.find(function(employee) {
            return employee.Id === employeeId;
        });
        if (employee) {
            values.skill.Employees.push(employee);
            viewUpdater(values.skill, values.readOnly);
        }
    }

    function removeEmployee(employeeId) {
        htmlNodes.addEmployeeList.empty();
        values.skill.Employees = values.skill.Employees.filter(function(employee) {
            return employee.Id !== employeeId;
        });
        viewUpdater(values.skill, values.readOnly);
    }
})();
