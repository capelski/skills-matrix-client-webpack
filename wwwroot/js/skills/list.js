window.application = window.application || {};
window.application.skillsList = window.application.skillsList || {};
    
// View
(function() {
    var htmlNodes = {
        keywords : $('#skills-keywords'),
        loader : $('#skills-loader'),
        list : $('#skills-list')
    };
    var utils = window.application.utils;

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
            return ajax.get('/api/skill?keywords=' + state.keywords + '&page=' + state.page + '&pageSize=' + state.pageSize, [])
            .then(function(skills) {
                state.skills = skills;
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
        page: 0,
        pageSize: 10,
        skills: []
    };

    window.application.skillsList.attachEvents(state);
    window.application.skillsList.state = state;
})();
