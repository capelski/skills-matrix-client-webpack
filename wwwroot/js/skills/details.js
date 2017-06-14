(function() {
    var deleteButton = $('#delete-button');
    var elementId = parseInt($('#id').val());
    var elementName = $('#name').val();

    function remove() {
        $.ajax({
            type: 'DELETE',
            url: '/api/skill?id=' + elementId
        })
        .then(function(skill) {
            document.location.href = '/skill/';
        })
        .fail(function(response) {
            toastr.error('An error ocurred', 'Oops!', {timeOut: 5000})
        });
    };

    function removePopup() {
        basicModal.show({
            body: '<div>Are you sure you want to delete ' + elementName + '?</div>',
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
    
    deleteButton.on('click', removePopup);
})();
