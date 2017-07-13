(function(js, ajax, paginatedList) {

    var state = paginatedList.getState();

    var htmlNodes = paginatedList.getHtmlNodes('employees');

    function render() {
        // State would be retrieved from the store in Redux
        paginatedList.render(htmlNodes, state, {
            elementDrawer: function (employee) {
                return '<li class="list-group-item"><a class="reset" href="/employees/details?id=' + employee.Id + '">' + employee.Name + '</a></li>';
            },
            noResultsHtml: '<i>No employees found</i>'
        });
    };

    function getEmployees(state) {
        js.stallPromise(ajax.get('/api/employee', {
            keywords: state.keywords,
            page: state.page + state.pageOffset,
            pageSize: state.pageSize
        }, paginatedList.defaultInstance), 1000)
        .then(function(paginatedList) {
            state.loadPhase = 'loaded';
            state.results = paginatedList.Items;
            state.totalPages = paginatedList.TotalPages;
            render();
        });
    }

    // Actions
    function initialize(state, event) {
        state.loadPhase = 'loading';
        render();
        getEmployees(state);
    }

    paginatedList.attachEvents(htmlNodes, state, render, getEmployees);

    $().ready(function(event) {
        initialize(state);
    });

})(JsCommons, Ajax, PaginatedList);
