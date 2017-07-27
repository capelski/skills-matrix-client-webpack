(function(js, ajax, paginatedList) {

    function EmployeesDetails(options) {
        var self = this;
        self.htmlNodes = options.htmlNodes;
        self.store = options.store;
        self.initialize = function() {
            self.store.dispatch(function(dispatch) {
                dispatch({
                    type: 'initialize',
                    config: {
                        hasSearcher: true,
                        searcherPlaceholder: "Add skills..."
                    }
                });
                dispatch({
                    type: 'updateResults',
                    paginatedList: paginatedList.defaultInstance
                });
                var state = self.store.getState();

                var employeePromise = Promise.resolve(state.viewDetails.employee);
                if (state.viewDetails.employee.Id != 0) {
                    employeePromise = ajax.get('/api/employee/getById', {
                        id : state.viewDetails.employee.Id
                    });
                }

                js.stallPromise(employeePromise, 1500)
                .then(function(employee) {
                    dispatch({
                        type: 'employeeLoaded',
                        employee: employee
                    });
                });
            });
        };

        function render() {
            var state = self.store.getState();
            render.readOnly(state);
            render.employeeName(state);
            render.employeeSkills(state);
            render.foundSkills(state);
            render.viewWrapper(state);
        }

        render.foundSkills = function (state) {
            paginatedList.render(self.htmlNodes.addSkillsList, state.addSkillsList, {
                elementDrawer: function (skill) {
                    return '<li class="list-group-item"><span class="add-skill" data-skill-id="' + skill.Id + '"><i class="fa fa-plus text-success"></i> '
                    + skill.Name + '</span></li>';
                },
                noResultsHtml: '<i>No skills found</i>'
            });
        };

        render.employeeName = function(state) {
            self.htmlNodes.pageTitle.html(state.viewDetails.employee.Name);
            self.htmlNodes.elementName.val(state.viewDetails.employee.Name);
        };

        render.employeeSkills = function(state) {
            paginatedList.render(self.htmlNodes.skillsList, state.viewDetails.skillsList, {
                elementDrawer: function (skill) {
                    var html = '<li class="list-group-item"><a class="reset" href="/skills/details?id=' + skill.Id + '">' + skill.Name + '</a></li>';
                    if (!state.viewDetails.readOnly) {
                        html = '<li class="list-group-item"><span class="remove-skill" data-skill-id="' + skill.Id + '"><i class="fa fa-times text-danger"></i> '
                        + skill.Name + '</span></li>';
                    }
                    return html;
                },
                noResultsHtml: '<i>No skills assigned yet</i>'
            });
        };

        render.readOnly = function(state) {
            self.htmlNodes.addSkillsList.wrapper.hide();
            self.htmlNodes.editButton.hide();
            self.htmlNodes.editButton.attr('href', '#');
            self.htmlNodes.deleteButton.hide();
            self.htmlNodes.pageTitle.text('Employee not found');            
            self.htmlNodes.saveButton.hide();
            self.htmlNodes.cancelButton.hide();
            self.htmlNodes.cancelButton.attr('href', '#');

            if (state.viewDetails.readOnly) {
                self.htmlNodes.elementName.attr('disabled', 'disabled');
                if (state.viewDetails.employee.Id > 0) {
                    self.htmlNodes.pageTitle.text(state.viewDetails.employee.Name);
                    self.htmlNodes.editButton.attr('href', '/employees/edit?id=' + state.viewDetails.employee.Id);
                    self.htmlNodes.editButton.show();
                    self.htmlNodes.deleteButton.show();
                }
            }
            else {
                self.htmlNodes.elementName.removeAttr('disabled');                
                if (state.viewDetails.employee.Id >= 0) {
                    self.htmlNodes.pageTitle.text('New employee');
                    self.htmlNodes.addSkillsList.wrapper.show();
                    self.htmlNodes.saveButton.show();
                    self.htmlNodes.cancelButton.show();
                    self.htmlNodes.cancelButton.attr('href', '/employees/');

                    if (state.viewDetails.employee.Id > 0) {
                        self.htmlNodes.pageTitle.text(state.viewDetails.employee.Name);
                        self.htmlNodes.cancelButton.attr('href', '/employees/details?id=' + state.viewDetails.employee.Id);
                    }
                }
            }
        };

        render.viewWrapper = function(state) {
            if (state.viewDetails.loading) {
                self.htmlNodes.viewWrapper.css({
                    visibility: 'hidden'
                });
                self.htmlNodes.loader.parent().removeClass('loaded').addClass('loading');
            }
            else {
                self.htmlNodes.viewWrapper.css({
                    visibility: 'visible'
                });
                self.htmlNodes.loader.parent().removeClass('loading').addClass('loaded');
            }
        };

        function getSkillId(event) {
            var $element = $(event.target);
            if ($element.hasClass('fa')) {
                $element = $element.parent();
            }
            var skillId = $element.data('skill-id');
            return skillId;
        }

        function getSkills(state) {
            var skillsPromise = Promise.resolve(paginatedList.defaultInstance);
            if (state.addSkillsList.keywords.length > 0) {
                skillsPromise = ajax.get('/api/skill', {
                    keywords: state.addSkillsList.keywords
                }, paginatedList.defaultInstance);
            }
            js.stallPromise(skillsPromise, 1500)
            .then(function(paginatedList) {
                paginatedList.Items = js.arrayDifference(paginatedList.Items, state.viewDetails.employee.Skills, 'Id');
                self.store.dispatch({
                    paginatedList: paginatedList,
                    type: 'updateResults'
                });
            });
        }

        self.htmlNodes.elementName.on('blur', function(event) {
            self.store.dispatch({
                type: 'employeeName',
                name: event.target.value
            });
        });

        self.htmlNodes.deleteButton.on('click', function(event) {
            self.store.dispatch(function (dispatch) {
                var state = self.store.getState();

                js.actionModal('<div>Are you sure you want to delete ' + state.viewDetails.employee.Name + '?</div>', 'Delete')
                .then(function() {
                    dispatch({
                        type: 'processing'
                    });
                    return ajax.remove('/api/employee?id=' + state.viewDetails.employee.Id);
                })
                .then(function (employee) {
                    if (employee) {
                        document.location.href = '/employees/';
                    }
                    else {
                        basicModal.close();
                        dispatch({
                            type: 'processed'
                        });
                    }
                });
            });
        });

        self.htmlNodes.saveButton.on('click', function(event) {
            self.store.dispatch(function (dispatch) {
                dispatch({
                    type: 'processing'
                });
                var state = self.store.getState();
                
                ajax.save('/api/employee', state.viewDetails.employee)
                .then(function (employee) {
                    if (employee) {
                        document.location.href = '/employees/details/' + employee.Id;
                    }
                    else {
                        dispatch({
                            type: 'processed'
                        });
                    }
                });
            });
        });

        self.htmlNodes.addSkillsList.list.on('click', '.add-skill', function(event) {
            var skillId = getSkillId(event);
            var state = self.store.getState();
            var skill = state.addSkillsList.results.find(function(skill) {
                return skill.Id === skillId;
            });
            if (skill) {
                self.store.dispatch({
                    type: 'skillAdded',
                    skill: skill
                });
            }
            self.store.dispatch({
                type: 'initialize'
            });
            self.store.dispatch({
                type: 'updateResults',
                paginatedList: paginatedList.defaultInstance
            });
        });

        self.htmlNodes.skillsList.list.on('click', '.remove-skill', function(event) {
            self.store.dispatch({
                type: 'skillRemoved',
                skillId: getSkillId(event)
            });
        });

        PaginatedList.attachActions(self.store, self.htmlNodes.addSkillsList, getSkills);

        self.store.subscribe(render);
    }

    var htmlNodes = {
        addSkillsList: paginatedList.getHtmlNodes('add-skills'),
        loader : $('#loader'),
        elementId : $('#model-id'),
        readOnly : $('#read-only'),
        pageTitle : $('#page-title'),
        elementName : $('#model-name'),
        skillsList : paginatedList.getHtmlNodes('skills'),
        editButton : $('#edit-button'),
        deleteButton : $('#delete-button'),
        saveButton : $('#save-button'),
        cancelButton : $('#cancel-button'),
        viewWrapper : $('#view-wrapper')
    };

    function viewReducer(state, action) {
        if (typeof state === "undefined") {
            state = {
                skillsList: paginatedList.getState(),
                employee: {
                    Id: parseInt(htmlNodes.elementId.val()),
                    Name: '',
                    Skills: []
                },
                loading: true,
                readOnly: htmlNodes.readOnly.val() == 'true'
            };
        }

         switch (action.type) {
            case 'initialize':
                state.loading = true;
                return state;
            case 'employeeLoaded':
                state.loading = false;
                if (action.employee) {
                    state.employee = action.employee;
                    state.skillsList.results = action.employee.Skills;
                }
                else {
                    state.employee.Id = -1;
                    state.readOnly = true;
                }
                return state;
            case 'employeeName':
                state.employee.Name = action.name;
                return state;
            case 'skillAdded':
                state.employee.Skills.push(action.skill);
                return state;
            case 'skillRemoved':
                state.employee.Skills = state.employee.Skills.filter(function(skill) {
                    return skill.Id !== action.skillId;
                });
                state.skillsList.results = state.employee.Skills;
                return state;
            case 'processing':
                state.loading = true;
                return state;
            case 'processed':
                state.loading = false;
                return state;
            default:
                return state;
        }
    }

    var reducer = Redux.combineReducers({
        viewDetails: viewReducer,
        addSkillsList: paginatedList.reducer,
    });

    var store = Redux.createStore(reducer, Redux.applyMiddleware(thunk));

    document.addEventListener("DOMContentLoaded", function() {
        var employeesDetails = new EmployeesDetails({
            htmlNodes: htmlNodes,
            store: store
        });
        employeesDetails.initialize();
    });

})(window.JsCommons, window.Ajax, window.PaginatedList);
