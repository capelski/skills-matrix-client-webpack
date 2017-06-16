(function() {

    window.application = window.application || {};
    window.application.employee = window.application.employee || {};
    window.application.employee.htmlNodes = {
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
    var htmlNodes = window.application.employee.htmlNodes;
    window.application.employee.values = {
        elementId: parseInt(htmlNodes.elementId.val()),
        readOnly: htmlNodes.readOnly.val() == 'true'
    };
    
    window.application.employee.updaters = {
        pageTitle: function(employee, readOnly) {
            var title = readOnly ? 'Employee not found' : 'New empoyee';
            if (employee) {
                title = employee.Name;
            }
            htmlNodes.pageTitle.text(title);
        },
        elementName: function(employee, readOnly) {
            htmlNodes.elementName.val(employee ? employee.Name : '');
            if(readOnly) {
                htmlNodes.elementName.attr('disabled', 'disabled');            
            }
            else {
                htmlNodes.elementName.removeAttr('disabled')                        
            }
        },
        skillsList: function(employee, readOnly) {
            htmlNodes.skillsList.empty();
            if (employee) {
                for(var key in employee.Skills) {
                    var skill = employee.Skills[key];
                    htmlNodes.skillsList.append('<li class="list-group-item"><a class="reset" href="/skills/details?id=' + skill.Id + '">' + skill.Name + '</a></li>');
                }
            }
        },
        editButton: function(employee, readOnly) {
            htmlNodes.editButton.hide();
            htmlNodes.editButton.attr('href', '#');
            if(employee && readOnly) {
                htmlNodes.editButton.attr('href', '/employees/edit?id=' + employee.Id);            
                htmlNodes.editButton.show();            
            }
        },
        deleteButton: function(employee, readOnly) {
            htmlNodes.deleteButton.hide();
            if (employee && readOnly) {
                htmlNodes.deleteButton.show();
            }
        },
        saveButton: function(employee, readOnly) {
            htmlNodes.saveButton.hide();
            if (!readOnly) {
                htmlNodes.saveButton.show();
            }
        },
        cancelButton: function(employee, readOnly) {
            htmlNodes.cancelButton.hide();
            htmlNodes.cancelButton.attr('href', '#');
            if(!readOnly) {
                htmlNodes.cancelButton.attr('href', '/employees/');
                if (employee) {
                    htmlNodes.cancelButton.attr('href', '/employees/details?id=' + employee.Id);
                }
                htmlNodes.cancelButton.show();            
            }
        }
    };
    var updaters = window.application.employee.updaters;

    window.application.employee.viewUpdater = function(employee, readOnly) {
        for (var key in updaters) {
            var updater = updaters[key];
            updater(employee, readOnly);
        }
    };
})();
