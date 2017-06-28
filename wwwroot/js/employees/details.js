(function() {
    var htmlNodes = window.application.employee.htmlNodes;
    window.application.employee.state = {
        employee: {
            Id: parseInt(htmlNodes.elementId.val()),
            Name: '',
            Skills: []
        },
        readOnly: htmlNodes.readOnly.val() == 'true',
        keywords: '',
        skills: []
    };

    window.application.employee.attachEvents(window.application.employee.state);
})();
