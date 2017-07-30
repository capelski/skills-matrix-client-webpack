(function(js, ajax, paginatedListService) {

    var employeeSkillsList = paginatedListService.create('skills', null, {
        elementDrawer: function (item, state) {
            var html = '<li class="list-group-item"><a class="reset" href="/skills/details?id=' +
            item.Id + '">' + item.Name + '</a></li>';
            if (!state.viewDetails.readOnly) {
                html = '<li class="list-group-item"><span class="remove-skill" data-skill-id="' +
                item.Id + '"><i class="fa fa-times text-danger"></i> '
                + item.Name + '</span></li>';
            }
            return html;
        },
        noResultsHtml: '<i>No skills assigned yet</i>'
    });

    function addSkillsFetcher(state) {
        var skillsPromise = Promise.resolve(paginatedListService.getDefaultData());
        if (state.addSkillsList.keywords.length > 0) {
            skillsPromise = js.stallPromise(ajax.get('/api/skill', {
                keywords: state.addSkillsList.keywords
            }, paginatedListService.getDefaultData()), 1500);
        }
        return skillsPromise
        .then(function(listResults) {
            listResults.Items = js.arrayDifference(listResults.Items, state.viewDetails.employee.Skills, 'Id');
            return listResults;
        });
    }

    var addSkillsList = paginatedListService.create('add-skills', addSkillsFetcher, {
        elementDrawer: function (skill, state) {
            return '<li class="list-group-item"><span class="add-skill" data-skill-id="' + skill.Id +
            '"><i class="fa fa-plus text-success"></i> '
            + skill.Name + '</span></li>';
        },
        noResultsHtml: '<i>No skills found</i>'
    });

    var htmlNodes = {
        addSkillsList: addSkillsList.htmlNodes,
        loader : $('#loader'),
        elementId : $('#model-id'),
        readOnly : $('#read-only'),
        pageTitle : $('#page-title'),
        elementName : $('#model-name'),
        employeeSkillsList : employeeSkillsList.htmlNodes,
        editButton : $('#edit-button'),
        deleteButton : $('#delete-button'),
        saveButton : $('#save-button'),
        cancelButton : $('#cancel-button')
    };

    window.employeeDetails = window.employeeDetails || {};
    window.employeeDetails.elements = {
        employeeSkillsList,
        addSkillsList,
        htmlNodes
    };
    
})(window.JsCommons, window.Ajax, window.PaginatedListService);
