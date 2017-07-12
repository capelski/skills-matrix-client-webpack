window.application = window.application || {};
window.application.skillsList = window.application.skillsList || {};

var js = window.JsCommons;
var ajax = window.Ajax;
var paginatedList = window.PaginatedList;
    
// View
(function() {
    var htmlNodes = paginatedList.getHtmlNodes('skills');

    function update(state) {
        for (var key in update) {
            var updater = update[key];
            updater(state);
        }
    }

    update.skills = function (state) {
        paginatedList.htmlUpdater(htmlNodes, state, {
            elementDrawer: function (skill) {
                return '<li class="list-group-item"><a class="reset" href="/skills/details?id=' + skill.Id + '">' + skill.Name + '</a></li>';
            },
            noResultsHtml: '<i>No skills found</i>'
        });
    };

    window.application.skillsList.htmlNodes = htmlNodes;
    window.application.skillsList.update = update;
})();

// Actions
(function() {
    var ajax = window.Ajax;
    var htmlNodes = window.application.skillsList.htmlNodes;
    var update = window.application.skillsList.update;

    function attachEvents(state) {
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
    }

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
            update.skills(state);
        });
    }

    window.application.skillsList.attachEvents = attachEvents;
})();

// Model
(function() {
    var state = paginatedList.getState();

    window.application.skillsList.attachEvents(state);
    window.application.skillsList.state = state;
})();
