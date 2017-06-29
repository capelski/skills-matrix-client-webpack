window.application = window.application || {};
window.application.employeesList = window.application.employeesList || {};
    
// View
(function() {
    var htmlNodes = {
        keywords : $('#employees-keywords'),
        loader : $('#employees-loader'),
        list : $('#employees-list'),
        paginationBar: {
            pages: $('#employees-pages'),
            pageSize: $('#employees-page-size'),
            pageSizeOptions: $('#employees-search-list .dropdown-option')
        }
    };
    var utils = window.application.utils;

    function update(state) {
        for (var key in update) {
            var updater = update[key];
            updater(state);
        }
    }

    update.employees = function (state) {
        utils.fillList(htmlNodes.list, state.employees, {
            elementDrawer: function (employee) {
                return '<li class="list-group-item"><a class="reset" href="/employees/details?id=' + employee.Id + '">' + employee.Name + '</a></li>';
            },
            noResultsHtml: '<i>No employees found</i>'
        });
    };

    update.keywords = function (state) {
        htmlNodes.keywords.val(state.keywords);
    };

    update.paginationBar = function(state) {
        var pagination = '<li><span class="page-button" data-page-action="previous">&laquo;</span></li>';
        for(var i = 0; i < state.pagesNumber; ++i) {
            pagination += '<li' + (state.page === i ? ' class="active"' : '') + '><span class="page-button" data-page-action="' +
            i + '">' + (state.pageOffset + i + 1) + '</span></li>';
        }
        pagination += '<li><span class="page-button" data-page-action="following">&raquo;</span></li>';
        // TODO Enable/Disable previous pages
        // TODO Enable/Disable following pages
        htmlNodes.paginationBar.pages.html(pagination);
        htmlNodes.paginationBar.pageSize.text(state.pageSize);
    };

    window.application.employeesList.htmlNodes = htmlNodes;
    window.application.employeesList.update = update;
})();

// Actions
(function() {
    var ajax = window.application.ajax;
    var utils = window.application.utils;
    var htmlNodes = window.application.employeesList.htmlNodes;
    var update = window.application.employeesList.update;

    function attachEvents(state) {
        htmlNodes.keywords.on('keyup', utils.eventDelayer(utils.eventLinker(getEmployees, state)));
        htmlNodes.paginationBar.pageSizeOptions.on('click', utils.eventLinker(paginationBar.pageSizeOptions, state));
        htmlNodes.paginationBar.pages.on('click', '.page-button', utils.eventLinker(paginationBar.pages, state));
        $().ready(utils.eventLinker(initializeView, state));
    }

    function getEmployees(state, event) {
        state.keywords = event.target.value;
        _loadEmployees(state);
    }

    function initializeView(state, event) {
        _loadEmployees(state);
    }

    function _loadEmployees(state) {
        utils.longOperation(employeesPromise, htmlNodes.loader);

        function employeesPromise() {
            return ajax.get('/api/employee?keywords=' + state.keywords + '&page=' + (state.page + state.pageOffset) + '&pageSize=' + state.pageSize, [])
            .then(function(employees) {
                state.employees = employees;
                update.paginationBar(state);
                update.employees(state);
            });
        }
    }

    var paginationBar = {
        pages: function(state, event) {
            var action = $(event.target).data('page-action');
            if (!isNaN(action)) {
                state.page = parseInt(action);
            }
            else if (action === 'previous') {
                state.pageOffset -= state.pagesNumber;
                if (state.pageOffset < 0) {
                    state.pageOffset = 0;
                }
                state.page = 0;
            }
            else if (action === 'following') {
                state.pageOffset += state.pagesNumber;
                // TODO Control the maximum
                state.page = 0;
            }
            _loadEmployees(state);
        },
        pageSizeOptions: function(state, event) {
            var element = $(event.target);
            state.pageSize = element.data('size');
            state.page = 0;
            state.pageOffset = 0;
            _loadEmployees(state);
        }
    };

    window.application.employeesList.attachEvents = attachEvents;
})();

// Model
(function() {
    var state = {
        keywords: '',
        page: 0,
        pageSize: 10,
        pageOffset: 0,
        pagesNumber: 5,
        employees: []
    };

    window.application.employeesList.attachEvents(state);
    window.application.employeesList.state = state;
})();
