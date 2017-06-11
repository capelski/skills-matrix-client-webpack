(function() {
    var saveButton = $('#save-button');
    var nameInput = $('#name');

    window.application = window.application ||  {};
    window.application.employees = window.application.employees || {};

    window.application.employees.save = function() {
        $.ajax({
            type: 'POST',
            url: '/employee',
            contentType: 'application/json',
            data: JSON.stringify({
                Id: 0,
                Name: nameInput.val()
            })
        });
    };

    saveButton.on('click', window.application.employees.save);
})();