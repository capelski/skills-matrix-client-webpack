(function() {
    var ajax = window.application.ajax;
    var values = {
        keywords: '',
        page: 0,
        pageSize: 10
    };
    var htmlNodes = {
        loader : $('#loader'),
        skillsList: $('#skills-list'),
        keywords: $('#keywords')
    };

    window.application.Searcher(htmlNodes.keywords, loadView);
    loadView(values.keywords);

    function loadView(keywords) {
        values.keywords = keywords;
        var promiseBuilder = ajax.get(
            '/api/skill?keywords=' + values.keywords + '&page=' + values.page + '&pageSize=' + values.pageSize, viewUpdater, []);
        window.application.utils.longOperation(promiseBuilder, htmlNodes.loader); 
    }

    function viewUpdater(skills) {
        htmlNodes.skillsList.empty();
        skills.forEach(function(skill) {
            htmlNodes.skillsList.append('<li class="list-group-item"><a class="reset" href="/skills/details?id=' + skill.Id + '">' + skill.Name + '</a></li>');
        });
    }
})();
