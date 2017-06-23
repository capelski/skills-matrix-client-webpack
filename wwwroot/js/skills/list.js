(function() {
    var ajax = window.application.ajax;
    var state = {
        keywords: '',
        page: 0,
        pageSize: 10,
        skills: []
    };
    var searchList = new window.application.SearchList('skills', skillsPromise, {
        elementDrawer: skillsDrawer,
        noResultsHtml: '<i>No skills found</i>'
    });

    searchList.reload();

    function skillsDrawer(skill) {
        return '<li class="list-group-item"><a class="reset" href="/skills/details?id=' + skill.Id + '">' + skill.Name + '</a></li>';
    }

    function skillsPromise(keywords) {
        state.keywords = keywords;
        return ajax.get('/api/skill?keywords=' + state.keywords + '&page=' + state.page + '&pageSize=' + state.pageSize, [])
        .then(function(skills) {
            state.skills = skills;
            return skills;
        });
    }
})();
