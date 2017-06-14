(function() {
    var saveButton = $('#save-button');
    var idInput = $('#id');
    var nameInput = $('#name');

    function save() {
        var elementId = parseInt(idInput.val());
        var request = {
            type: 'POST',
            url: '/api/skill',
            contentType: 'application/json',
            data: JSON.stringify({
                Id: elementId,
                Name: nameInput.val()
            })
        };

        if (elementId !== 0) {
            request.type = 'PUT';
            request.url = '/api/skill';
        }

        $.ajax(request)
        .then(function(skill) {
            document.location.href = '/skill/details/' + skill.id;
        })
        .fail(function(response) {
            toastr.error('An error ocurred', 'Oops!', {timeOut: 5000})
        });
    };

    saveButton.on('click', save);
})();
