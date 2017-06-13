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
        })
        .fail(function(response) {
            toastr.error('An error ocurred', 'Oops!', {timeOut: 5000})
        });
    };

    function removePopup() {
        basicModal.show({
            body: `<div>
                        Are you sure you want to delete @Model.Name?
                </div>`,
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
