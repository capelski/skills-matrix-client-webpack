(function() {
    var htmlNodes = window.application.skill.htmlNodes;
    var values = window.application.skill.values;
    var viewUpdater = window.application.skill.viewUpdater;

    htmlNodes.deleteButton.on('click', removePopup);
    htmlNodes.saveButton.on('click', save);

    if (values.elementId != 0) {
        $.ajax({
            type: 'GET',
            url: '/api/skill/getById?id=' + values.elementId
        })
        .then(function(skill) {
            viewUpdater(skill, values.readOnly);
        })
        .fail(function(response) {
            toastr.error('An error ocurred', 'Oops!', {timeOut: 5000});
            viewUpdater(null, true);
        });
    }
    else {
        viewUpdater(null, values.readOnly);
    }

    function remove() {
        $.ajax({
            type: 'DELETE',
            url: '/api/skill?id=' + values.elementId
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
            document.location.href = '/skill/details/' + skill.Id;
        })
        .fail(function(response) {
            toastr.error('An error ocurred', 'Oops!', {timeOut: 5000})
        });
    };
})();
