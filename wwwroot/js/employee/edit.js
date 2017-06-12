(function() {
    var saveButton = $('#save-button');
    var idInput = $('#id');
    var nameInput = $('#name');

    window.application = window.application ||  {};
    window.application.employees = window.application.employees || {};

    window.application.employees.save = function() {
        var elementId = parseInt(idInput.val());
        var request = {
            type: 'POST',
            url: '/employee/create',
            contentType: 'application/json',
            data: JSON.stringify({
                Id: elementId,
                Name: nameInput.val()
            })
        };

        if (elementId !== 0) {
            request.type = 'PUT';
            request.url = '/employee/update';
        }

        $.ajax(request)
        .then(function(employee) {
            document.location.href = '/employee/details/' + employee.id;
        });
    };

    saveButton.on('click', window.application.employees.save);
})();