(function() {
    var paginatedList = window.application.paginatedList;
    var htmlNodes = {
        addSkillsList: paginatedList.getHtmlNodes('add-skills'),
        loader : $('#loader'),
        elementId : $('#model-id'),
        readOnly : $('#read-only'),
        pageTitle : $('#page-title'),
        elementName : $('#model-name'),
        skillsList : $('#skills-list'),
        editButton : $('#edit-button'),
        deleteButton : $('#delete-button'),
        saveButton : $('#save-button'),
        cancelButton : $('#cancel-button')
    };

    function update(state) {
        for (var key in update) {
            var updater = update[key];
            updater(state);
        }
    }

    update.foundSkills = function (state) {
        paginatedList.fill(htmlNodes.addSkillsList.list, state.foundSkills, {
            elementDrawer: function (skill) {
                return '<li class="list-group-item"><span class="add-skill" data-skill-id="' + skill.Id + '"><i class="fa fa-plus text-success"></i> '
                + skill.Name + '</span></li>';
            },
            noResultsHtml: '<i>No skills found</i>'
        });
    };

    update.employeeName = function(state) {
        htmlNodes.elementName.val(state.employee.Name);
    };

    update.readOnly = function(state) {
        htmlNodes.addSkillsList.keywords.hide();
        htmlNodes.addSkillsList.list.hide();
        htmlNodes.editButton.hide();
        htmlNodes.editButton.attr('href', '#');
        htmlNodes.deleteButton.hide();
        htmlNodes.pageTitle.text('Employee not found');            
        htmlNodes.saveButton.hide();
        htmlNodes.cancelButton.hide();
        htmlNodes.cancelButton.attr('href', '#');

        if (state.readOnly) {
            htmlNodes.elementName.attr('disabled', 'disabled');
            if (state.employee.Id > 0) {
                htmlNodes.pageTitle.text(state.employee.Name);
                htmlNodes.editButton.attr('href', '/employees/edit?id=' + state.employee.Id);
                htmlNodes.editButton.show();
                htmlNodes.deleteButton.show();
            }
        }
        else {
            htmlNodes.elementName.removeAttr('disabled');                
            if (state.employee.Id >= 0) {
                htmlNodes.pageTitle.text('New employee');
                htmlNodes.addSkillsList.keywords.show();
                htmlNodes.addSkillsList.list.show();
                htmlNodes.saveButton.show();
                htmlNodes.cancelButton.show();
                htmlNodes.cancelButton.attr('href', '/employees/');

                if (state.employee.Id > 0) {
                    htmlNodes.pageTitle.text(state.employee.Name);
                    htmlNodes.cancelButton.attr('href', '/employees/details?id=' + state.employee.Id);
                }
            }
        }

        update.employeeSkills(state);
    };

    update.employeeSkills = function(state) {
        htmlNodes.skillsList.empty();
        if (state.employee.Skills.length === 0) {
            htmlNodes.skillsList.append('<i>No skills assigned yet</i>');
        }
        for (var key in state.employee.Skills) {
            var skill = state.employee.Skills[key];
            var html = '<li class="list-group-item"><a class="reset" href="/skills/details?id=' + skill.Id + '">' + skill.Name + '</a></li>';
            if (!state.readOnly) {
                html = '<li class="list-group-item"><span class="remove-skill" data-skill-id="' + skill.Id + '"><i class="fa fa-times text-danger"></i> '
                + skill.Name + '</span></li>';
            }
            htmlNodes.skillsList.append(html);
        }
    };

    update.searchKeywords = function (state) {
        htmlNodes.addSkillsList.keywords.val(state.searchKeywords);
    };

    window.application = window.application || {};
    window.application.employee = window.application.employee || {};
    window.application.employee.htmlNodes = htmlNodes;
    window.application.employee.update = update;
})();
