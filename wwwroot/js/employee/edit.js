(function() {
    var saveButton = $('#save-button');
    var nameInput = $('#name');

    window.application = window.application ||  {};
    window.application.employees = window.application.employees || {};

    window.application.employees.save = function() {
        $.ajax({
            type: 'POST',
            url: '/employee/create',
            contentType: 'application/json',
            data: JSON.stringify({
                Id: 0,
                Name: nameInput.val()
            })
        })
        .then(function() {
            document.location.href = '/employee';
        });
    };

    saveButton.on('click', window.application.employees.save);
})();