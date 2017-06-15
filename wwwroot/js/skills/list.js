(function() {
    var values = {
        keywords: "",
        page: 0,
        pageSize: 10
    };
    var htmlNodes = {
        skillsList: $('#skills-list')
    };

    loadView();

    function loadView() {
        $.ajax({
            type: 'GET',
            url: '/api/skill?keywords=' + values.keywords + '&page=' + values.page + '&pageSize=' + values.pageSize
        })
        .then(viewUpdater)
        .fail(function(response) {
            toastr.error('An error ocurred', 'Oops!', {timeOut: 5000});
            viewUpdater([]);
        });
    }

    function viewUpdater(skills) {
        htmlNodes.skillsList.empty();
        skills.forEach(function(skill) {
            htmlNodes.skillsList.append('<li class="list-group-item"><a class="reset" href="/skill/details?id=' + skill.Id + '">' + skill.Name + '</a></li>');
        });
    }
})();
