(function() {
    var htmlNodes = window.application.skill.htmlNodes;
    window.application.skill.state = {
        skill: {
            Id: parseInt(htmlNodes.elementId.val()),
            Name: '',
            Employees: []
        },
        readOnly: htmlNodes.readOnly.val() == 'true',
        keywords: '',
        employees: []
    };

    window.application.skill.attachEvents(window.application.skill.state);
})();
