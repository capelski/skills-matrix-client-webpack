window.application = window.application || {};
window.application.skillsList = window.application.skillsList || {};
    
// View
(function() {
    var utils = window.application.utils;
    var htmlNodes = {
        keywords : $('#skills-keywords'),
        loader : $('#skills-loader'),
        list : $('#skills-list'),
        paginationBar: utils.paginatedList.getHtmlNodes('skills')
    };

    function update(state) {
        for (var key in update) {
            var updater = update[key];
            updater(state);
        }
    }

    update.skills = function (state) {
        utils.fillList(htmlNodes.list, state.skills, {
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
        utils.paginatedList.htmlUpdater(htmlNodes.paginationBar, state)
    };

    window.application.skillsList.htmlNodes = htmlNodes;
    window.application.skillsList.update = update;
})();

// Actions
(function() {
    var ajax = window.application.ajax;
    var utils = window.application.utils;
    var htmlNodes = window.application.skillsList.htmlNodes;
    var update = window.application.skillsList.update;

    function attachEvents(state) {
        htmlNodes.keywords.on('keyup', utils.eventDelayer(utils.eventLinker(getSkills, state)));
        htmlNodes.paginationBar.pageSizeOptions.on('click', utils.eventLinker(paginationBar.pageSizeOptions, state));
        htmlNodes.paginationBar.pages.on('click', '.enabled > .page-button', utils.eventLinker(paginationBar.pages, state));
        $().ready(utils.eventLinker(initializeView, state));
    }

    function getSkills(state, event) {
        state.keywords = event.target.value;
        _loadSkills(state);
    }

    function initializeView(state, event) {
        _loadSkills(state);
    }

    function _loadSkills(state) {
        utils.longOperation(skillsPromise, htmlNodes.loader);

        function skillsPromise() {
            return ajax.get('/api/skill?keywords=' + state.keywords + '&page=' + (state.paginatedList.page + state.paginatedList.pageOffset) +
            '&pageSize=' + state.paginatedList.pageSize, utils.paginatedList.default)
            .then(function(paginatedList) {
                state.skills = paginatedList.Items;
                state.paginatedList.totalPages = paginatedList.TotalPages;
                update.paginationBar(state);
                update.skills(state);
            });
        }
    }

    var paginationBar = {
        pages: function(state, event) {
            utils.paginatedList.stateUpdaters.pages(state, event);
            _loadSkills(state);
        },
        pageSizeOptions: function(state, event) {
            utils.paginatedList.stateUpdaters.pageSize(state, event);
            _loadSkills(state);
        }
    };

    window.application.skillsList.attachEvents = attachEvents;
})();

// Model
(function() {
    var utils = window.application.utils;    
    var state = {
        keywords: '',
        paginatedList: utils.paginatedList.getState(),
        skills: []
    };

    window.application.skillsList.attachEvents(state);
    window.application.skillsList.state = state;
})();
