(function() {
    var values = {
        keywords: "",
        page: 0,
        pageSize: 10
    };
    var htmlNodes = {
        skillsList: $('#skills-list'),
        loader : $('#loader'),
        keywords: $('#keywords')
    };
    var searchTimeout;

    htmlNodes.keywords.on('keyup', search);
    loadView();

    function loadView() {
        var promiseBuilder = function() {
            return $.ajax({
                type: 'GET',
                url: '/api/skill?keywords=' + values.keywords + '&page=' + values.page + '&pageSize=' + values.pageSize
            })
            .then(viewUpdater)
            .fail(function(response) {
                toastr.error('An error ocurred', 'Oops!', {timeOut: 5000});
                viewUpdater([]);
            });
        }
        window.application.utils.longOperation(promiseBuilder, htmlNodes.loader); 
    }

    function search(event) {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        searchTimeout = setTimeout(function() {
            values.keywords = event.target.value;
            loadView();
            searchTimeout = null;
        }, 300);
    }

    function viewUpdater(skills) {
        htmlNodes.skillsList.empty();
        skills.forEach(function(skill) {
            htmlNodes.skillsList.append('<li class="list-group-item"><a class="reset" href="/skill/details?id=' + skill.Id + '">' + skill.Name + '</a></li>');
        });
    }
})();
