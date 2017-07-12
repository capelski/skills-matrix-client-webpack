(function(js, ajax, paginatedList) {

    // View
    var htmlNodes = paginatedList.getHtmlNodes('skills');

    function render(state) {
        paginatedList.htmlUpdater(htmlNodes, state, {
            elementDrawer: function (skill) {
                return '<li class="list-group-item"><a class="reset" href="/skills/details?id=' + skill.Id + '">' + skill.Name + '</a></li>';
            },
            noResultsHtml: '<i>No skills found</i>'
        });
    };

    // Actions
    function initializeView(state, event) {
        _loadSkills(state);
    }

    function _loadSkills(state) {
        js.longOperation(ajax.get('/api/skill', {
            keywords: state.keywords,
            page: state.page + state.pageOffset,
            pageSize: state.pageSize
        }, paginatedList.defaultInstance), htmlNodes.loader)
        .then(function(paginatedList) {
            state.results = paginatedList.Items;
            state.totalPages = paginatedList.TotalPages;
            render(state);
        });
    }

    // State
    var state = paginatedList.getState();

    var paginatedListEventHandlers = {
        pageButtons: function(event) {
            paginatedList.stateUpdaters.pages(state, event);
            _loadSkills(state);
        },
        pageSizeList: function(event) {
            paginatedList.stateUpdaters.pageSize(state, event);
            _loadSkills(state);
        },
        searcher: function (event) {
            state.keywords = event.target.value;
            state.page = 0;
            state.pageOffset = 0;
            _loadSkills(state);
        },
        clearKeywords: function(event) {
            state.keywords = '';
            state.page = 0;
            state.pageOffset = 0;
            _loadSkills(state);
        }
    };
    paginatedList.attachEvents(htmlNodes, paginatedListEventHandlers);

    $().ready(function(event) {
        initializeView(state, event);
    });

})(JsCommons, Ajax, PaginatedList);