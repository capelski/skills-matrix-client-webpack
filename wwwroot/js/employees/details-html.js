(function() {
    var htmlNodes = {
        loader : $('#loader'),
        elementId : $('#model-id'),
        readOnly : $('#read-only'),
        pageTitle : $('#page-title'),
        elementName : $('#model-name'),
        skillsList : $('#skills-list'),
        addSkillKeywords : $('#add-skill-keywords'),
        addSkillLoader : $('#add-skill-loader'),
        addSkillList : $('#add-skill-list'),
        editButton : $('#edit-button'),
        deleteButton : $('#delete-button'),
        saveButton : $('#save-button'),
        cancelButton : $('#cancel-button')
    };

    var updaters = {
        readOnly: function(state) {
            htmlNodes.addSkillKeywords.hide();
            htmlNodes.addSkillList.hide();
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
                    htmlNodes.addSkillKeywords.show();
                    htmlNodes.addSkillList.show();
                    htmlNodes.saveButton.show();
                    htmlNodes.cancelButton.show();
                    htmlNodes.cancelButton.attr('href', '/employees/');

                    if (state.employee.Id > 0) {
                        htmlNodes.pageTitle.text(state.employee.Name);
                        htmlNodes.cancelButton.attr('href', '/employees/details?id=' + state.employee.Id);
                    }
                }
            }

            updaters.employeeSkills(state);
        },
        employeeName: function(state) {
            htmlNodes.elementName.val(state.employee.Name);
        },
        employeeSkills: function(state) {
            htmlNodes.skillsList.empty();
            if (state.employee.Skills.length === 0) {
                htmlNodes.skillsList.append('<i>No skills assigned yet</i>');
            }
            for (var key in state.employee.Skills) {
                var skill = state.employee.Skills[key];
                var html = '<li class="list-group-item"><a class="reset" href="/skills/details?id=' + skill.Id + '">' + skill.Name + '</a></li>';
                if (!state.readOnly) {
                    html = '<li class="list-group-item remove-skill" data-skill-id="' + skill.Id + '"><i class="fa fa-times text-danger"></i> ' + skill.Name + '</li>';
                }
                htmlNodes.skillsList.append(html);
            }
        }
    };

    function updateAll(state) {
        for (var key in updaters) {
            var updater = updaters[key];
            updater(state);
        }
    }

    window.application = window.application || {};
    window.application.employee = window.application.employee || {};
    window.application.employee.htmlNodes = htmlNodes;
    window.application.employee.updaters = updaters;
    window.application.employee.updateAll = updateAll;
})();
