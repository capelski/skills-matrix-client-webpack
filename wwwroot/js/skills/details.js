(function() {
    var paginatedList = window.application.paginatedList;
    var htmlNodes = window.application.skill.htmlNodes;
    window.application.skill.state = {
        addEmployeesList: paginatedList.getState(),
        foundEmployees: [],
        readOnly: htmlNodes.readOnly.val() == 'true',
        skill: {
            Id: parseInt(htmlNodes.elementId.val()),
            Name: '',
            Employees: []
        }
    };

    window.application.skill.attachEvents(window.application.skill.state);
})();
