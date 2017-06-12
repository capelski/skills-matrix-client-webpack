(function() {
    var deleteButton = $('#delete-button');
    var elementId = parseInt($('#id').val());

    function remove() {
        $.ajax({
            type: 'DELETE',
            url: '/employee/delete?id=' + elementId
        })
        .then(function(employee) {
            document.location.href = '/employee/';
        });
    };

    deleteButton.on('click', remove);
})();
