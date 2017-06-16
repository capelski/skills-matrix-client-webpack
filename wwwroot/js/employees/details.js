(function() {
    var htmlNodes = window.application.employee.htmlNodes;
    var values = window.application.employee.values;
    var viewUpdater = window.application.employee.viewUpdater;
    var searchTimeout;

    window.addSkill = addSkill;
    window.removeSkill = removeSkill;

    htmlNodes.skillKeywords.on('keyup', search);
    htmlNodes.deleteButton.on('click', removePopup);
    htmlNodes.saveButton.on('click', save);
    loadView();

    function loadView() {
        if (values.elementId != 0) {
            var promiseBuilder = function() {
                return $.ajax({
                    type: 'GET',
                    url: '/api/employee/getById?id=' + values.elementId
                })
                .then(function(employee) {
                    values.employee = employee;
                    viewUpdater(employee, values.readOnly);
                })
                .fail(function(response) {
                    toastr.error('An error ocurred', 'Oops!', {timeOut: 5000});
                    viewUpdater(null, true);
                });
            }
            window.application.utils.longOperation(promiseBuilder, htmlNodes.loader);
        }
        else {
            viewUpdater(null, values.readOnly);
        }
    }

    function remove() {
        $.ajax({
            type: 'DELETE',
            url: '/api/employee?id=' + values.elementId
        })
        .then(function(employee) {
            document.location.href = '/employees/';
        })
        .fail(function(response) {
            toastr.error('An error ocurred', 'Oops!', {timeOut: 5000})
        });
    };

    function removePopup() {
        basicModal.show({
            body: '<div>Are you sure you want to delete ' + htmlNodes.elementName.val() + '?</div>',
            buttons: {
                cancel: {
                    title: 'Cancel',
                    fn: function() {
                        basicModal.close();
                    }
                },
                action: {
                    title: 'Delete',
                    fn: remove
                }
            }
        });
    }

    function save() {
        var request = {
            type: 'POST',
            url: '/api/employee',
            contentType: 'application/json',
            data: JSON.stringify({
                Id: values.elementId,
                Name: htmlNodes.elementName.val(),
                Skills: values.employee.Skills || []
            })
        };

        if (values.elementId !== 0) {
            request.type = 'PUT';
            request.url = '/api/employee/';
        }

        $.ajax(request)
        .then(function(employee) {
            document.location.href = '/employees/details/' + employee.Id;
        })
        .fail(function(response) {
            toastr.error('An error ocurred', 'Oops!', {timeOut: 5000})
        });
    }

    function search(event) {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        searchTimeout = setTimeout(function() {
            var keywords = event.target.value;
            if (keywords.length > 0) {
                var promiseBuilder = function() {
                    return $.ajax({
                        type: 'GET',
                        url: '/api/skill?keywords=' + keywords
                    })
                    .then(updateSkills)
                    .fail(function(response) {
                        toastr.error('An error ocurred', 'Oops!', {timeOut: 5000});
                        updateSkills([]);
                    });
                }
                window.application.utils.longOperation(promiseBuilder, htmlNodes.addSkillLoader);
            }
            else {
                updateSkills([]);                
            }
            searchTimeout = null;
        }, 300);
    }

    function updateSkills(skills) {
        htmlNodes.addSkillList.empty();
        values.skills = skills.filter(function(candidate) {
            return values.employee.Skills.filter(function(skill) {
                return candidate.Id === skill.Id;
            }).length === 0;
        });
        values.skills.forEach(function(skill) {
            var html = '<li class="list-group-item" onclick="addSkill(' + skill.Id + ')"><i class="fa fa-plus text-success"></i> ' + skill.Name + '</li>';
            htmlNodes.addSkillList.append(html);
        });
    }

    function addSkill(skillId) {
        htmlNodes.addSkillList.empty();
        var skill = values.skills.find(function(skill) {
            return skill.Id === skillId;
        });
        if (skill) {
            values.employee.Skills.push(skill);
            viewUpdater(values.employee, values.readOnly);
        }
    }

    function removeSkill(skillId) {
        htmlNodes.addSkillList.empty();
        values.employee.Skills = values.employee.Skills.filter(function(skill) {
            return skill.Id !== skillId;
        });
        viewUpdater(values.employee, values.readOnly);
    }
})();
