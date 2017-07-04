(function() {
    var paginatedList = window.application.paginatedList;
    var htmlNodes = window.application.employee.htmlNodes;
    window.application.employee.state = {
        addSkillsList: paginatedList.getState(),
        employee: {
            Id: parseInt(htmlNodes.elementId.val()),
            Name: '',
            Skills: []
        },
        readOnly: htmlNodes.readOnly.val() == 'true'
    };

    window.application.employee.attachEvents(window.application.employee.state);
})();
