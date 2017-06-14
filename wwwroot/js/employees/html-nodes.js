(function() {

    window.application = window.application || {};
    window.application.employee = window.application.employee || {};
    window.application.employee.htmlNodes = {
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
    var htmlNodes = window.application.employee.htmlNodes;
    window.application.employee.values = {
        elementId: parseInt(htmlNodes.elementId.val()),
        readOnly: htmlNodes.readOnly.val() == 'true'
    };
    var values = window.application.employee.values;
    
    window.application.employee.updaters = {
        pageTitle: function(employee) {
            var title = values.readOnly ? 'Employee not found' : 'New empoyee';
            if (employee) {
                title = employee.Name;
            }
            htmlNodes.pageTitle.text(title);
        },
        elementName: function(employee) {
            htmlNodes.elementName.val(employee ? employee.Name : '');
            if(values.readOnly) {
                htmlNodes.elementName.attr('disabled', 'disabled');            
            }
            else {
                htmlNodes.elementName.removeAttr('disabled')                        
            }
        },
        skillsList: function(employee) {
            htmlNodes.skillsList.empty();
            if (employee) {
                for(var key in employee.Skills) {
                    var skill = employee.Skills[key];
                    htmlNodes.skillsList.append('<li class="list-group-item"><a class="reset" href="/skill/details?id=' + skill.Id + '">' + skill.Name + '</a></li>');
                }
            }
        },
        editButton: function(employee) {
            htmlNodes.editButton.hide();
            htmlNodes.editButton.attr('href', '#');
            if(employee && values.readOnly) {
                htmlNodes.editButton.attr('href', '/employee/edit?id=' + employee.Id);            
                htmlNodes.editButton.show();            
            }
        },
        deleteButton: function(employee) {
            htmlNodes.deleteButton.hide();
            if (employee && values.readOnly) {
                htmlNodes.deleteButton.show();
            }
        },
        saveButton: function(employee) {
            htmlNodes.saveButton.hide();
            if (!values.readOnly) {
                htmlNodes.saveButton.show();
            }
        },
        cancelButton: function(employee) {
            htmlNodes.cancelButton.hide();
            htmlNodes.cancelButton.attr('href', '#');
            if(!values.readOnly) {
                htmlNodes.cancelButton.attr('href', '/employee/');
                if (employee) {
                    htmlNodes.cancelButton.attr('href', '/employee/details?id=' + employee.Id);
                }
                htmlNodes.cancelButton.show();            
            }
        }
    };
    var updaters = window.application.employee.updaters;

    window.application.employee.viewUpdater = function(employee) {
        for (var key in updaters) {
            var updater = updaters[key];
            updater(employee);
        }
    };
})();
