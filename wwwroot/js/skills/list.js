window.application = window.application || {};
window.application.skillsList = window.application.skillsList || {};

var js = window.application.jsCommons;
var ajax = window.application.ajax;
var paginatedList = window.application.paginatedList;
    
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
        paginatedList.fill(htmlNodes, state.skills, {
            elementDrawer: function (skill) {
                return '<li class="list-group-item"><a class="reset" href="/skills/details?id=' + skill.Id + '">' + skill.Name + '</a></li>';
            },
            noResultsHtml: '<i>No skills found</i>'
        });
    };

    update.keywords = function (state) {
        htmlNodes.keywords.val(state.keywords);
    };

    update.paginationBar = function(state) {
        paginatedList.htmlUpdater(htmlNodes, state.paginatedList)
    };

    window.application.skillsList.htmlNodes = htmlNodes;
    window.application.skillsList.update = update;
})();

// Actions
(function() {
    var ajax = window.application.ajax;
    var htmlNodes = window.application.skillsList.htmlNodes;
    var update = window.application.skillsList.update;

    function attachEvents(state) {
        var paginatedListEventHandlers = {
            pageButtons: js.eventLinker(function(state, event) {
                paginatedList.stateUpdaters.pages(state.paginatedList, event);
                _loadSkills(state);
            }, state),
            pageSizeList: js.eventLinker(function(state, event) {
                paginatedList.stateUpdaters.pageSize(state.paginatedList, event);
                _loadSkills(state);
            }, state),
            searcher: js.eventLinker(function (state, event) {
                state.keywords = event.target.value;
                state.paginatedList.page = 0;
                state.paginatedList.pageOffset = 0;
                _loadSkills(state);
            }, state)
        };

        paginatedList.attachEvents(htmlNodes, paginatedListEventHandlers);
        $().ready(js.eventLinker(initializeView, state));
    }

    function initializeView(state, event) {
        _loadSkills(state);
    }

    function _loadSkills(state) {
        js.longOperation(skillsPromise, htmlNodes.loader);

        function skillsPromise() {
            return ajax.get('/api/skill?keywords=' + state.keywords + '&page=' + (state.paginatedList.page + state.paginatedList.pageOffset) +
            '&pageSize=' + state.paginatedList.pageSize, paginatedList.defaultInstance)
            .then(function(paginatedList) {
                state.skills = paginatedList.Items;
                state.paginatedList.totalPages = paginatedList.TotalPages;
                update.keywords(state);
                update.paginationBar(state);
                update.skills(state);
            });
        }
    }

    window.application.skillsList.attachEvents = attachEvents;
})();

// Model
(function() {
    var state = {
        keywords: '',
        paginatedList: paginatedList.getState(),
        skills: []
    };

    window.application.skillsList.attachEvents(state);
    window.application.skillsList.state = state;
})();
