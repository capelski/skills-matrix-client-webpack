(function() {
    var saveButton = $('#save-button');
    var idInput = $('#id');
    var nameInput = $('#name');

    function save() {
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
        })
        .fail(function(response) {
            toastr.error('An error ocurred', 'Oops!', {timeOut: 5000})
        });
    };

    saveButton.on('click', save);
})();
