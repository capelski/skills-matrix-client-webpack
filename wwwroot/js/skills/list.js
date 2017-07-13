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
    function _loadSkills(state) {
        js.stallPromise(ajax.get('/api/skill', {
            keywords: state.keywords,
            page: state.page + state.pageOffset,
            pageSize: state.pageSize
        }, paginatedList.defaultInstance), 1000)
        .then(function(paginatedList) {
            state.loadPhase = 'loaded';
            state.results = paginatedList.Items;
            state.totalPages = paginatedList.TotalPages;
            render(state);
        });
    }

    function initializeView(state, event) {
        state.loadPhase = 'loading';
        render(state);
        _loadSkills(state);
    }

    // State
    var state = paginatedList.getState();

    var paginatedListEventHandlers = {
        pageButtons: function(event) {
            state.loadPhase = 'loading';
            paginatedList.stateUpdaters.pages(state, event);
            _loadSkills(state);
            render(state);
        },
        pageSizeList: function(event) {
            state.loadPhase = 'loading';            
            paginatedList.stateUpdaters.pageSize(state, event);
            _loadSkills(state);
            render(state);
        },
        searcher: function (event) {
            state.loadPhase = 'loading';
            state.keywords = event.target.value;
            state.page = 0;
            state.pageOffset = 0;
            _loadSkills(state);
            render(state);
        },
        clearKeywords: function(event) {
            state.loadPhase = 'loading';
            state.keywords = '';
            state.page = 0;
            state.pageOffset = 0;
            _loadSkills(state);
            render(state);
        }
    };
    paginatedList.attachEvents(htmlNodes, paginatedListEventHandlers);

    $().ready(function(event) {
        initializeView(state, event);
    });

})(JsCommons, Ajax, PaginatedList);