(function() {

    window.application = window.application || {};
    window.application.skill = window.application.skill || {};
    window.application.skill.htmlNodes = {
        elementId : $('#model-id'),
        readOnly : $('#read-only'),
        pageTitle : $('#page-title'),
        elementName : $('#model-name'),
        employeesList : $('#employees-list'),
        editButton : $('#edit-button'),
        deleteButton : $('#delete-button'),
        saveButton : $('#save-button'),
        cancelButton : $('#cancel-button')
    };
    var htmlNodes = window.application.skill.htmlNodes;
    window.application.skill.values = {
        elementId: parseInt(htmlNodes.elementId.val()),
        readOnly: htmlNodes.readOnly.val() == 'true'
    };
    var values = window.application.skill.values;
    
    window.application.skill.updaters = {
        pageTitle: function(skill) {
            var title = values.readOnly ? 'Skill not found' : 'New skill';
            if (skill) {
                title = skill.Name;
            }
            htmlNodes.pageTitle.text(title);
        },
        elementName: function(skill) {
            htmlNodes.elementName.val(skill ? skill.Name : '');
            if(values.readOnly) {
                htmlNodes.elementName.attr('disabled', 'disabled');            
            }
            else {
                htmlNodes.elementName.removeAttr('disabled')                        
            }
        },
        employeesList: function(skill) {
            htmlNodes.employeesList.empty();
            if (skill) {
                for(var key in skill.Employees) {
                    var employee = skill.Employees[key];
                    htmlNodes.employeesList.append('<li class="list-group-item"><a class="reset" href="/employee/details?id=' + employee.Id + '">' + employee.Name + '</a></li>');
                }
            }
        },
        editButton: function(skill) {
            htmlNodes.editButton.hide();
            htmlNodes.editButton.attr('href', '#');
            if(skill && values.readOnly) {
                htmlNodes.editButton.attr('href', '/skill/edit?id=' + skill.Id);            
                htmlNodes.editButton.show();            
            }
        },
        deleteButton: function(skill) {
            htmlNodes.deleteButton.hide();
            if (skill && values.readOnly) {
                htmlNodes.deleteButton.show();
            }
        },
        saveButton: function(skill) {
            htmlNodes.saveButton.hide();
            if (!values.readOnly) {
                htmlNodes.saveButton.show();
            }
        },
        cancelButton: function(skill) {
            htmlNodes.cancelButton.hide();
            htmlNodes.cancelButton.attr('href', '#');
            if(!values.readOnly) {
                htmlNodes.cancelButton.attr('href', '/skill/');
                if (skill) {
                    htmlNodes.cancelButton.attr('href', '/skill/details?id=' + skill.Id);
                }
                htmlNodes.cancelButton.show();            
            }
        }
    };
    var updaters = window.application.skill.updaters;

    window.application.skill.viewUpdater = function(skill) {
        for (var key in updaters) {
            var updater = updaters[key];
            updater(skill);
        }
    };
})();
