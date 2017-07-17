(function(js, ajax, paginatedList) {

    function SkillsList(options) {
        var self = this;
        self.htmlNodes = options.htmlNodes;
        self.store = options.store;
        self.initialize = function() {
            self.store.dispatch(function(dispatch) {
                dispatch({
                    config: {
                        hasSearcher: true,
                        hasPagination: true
                    },
                    type: 'initialize'
                });
                getSkills(self.store.getState(), dispatch);
            });
        };

        function getSkills(state, dispatch) {
            js.stallPromise(ajax.get('/api/skill', {
                keywords: state.keywords,
                page: state.page + state.pageOffset,
                pageSize: state.pageSize
            }, paginatedList.defaultInstance), 1500)
            .then(function(paginatedList) {
                dispatch({
                    paginatedList: paginatedList,
                    type: 'updateResults'
                });
            });
        }

        function render() {
            paginatedList.render(self.htmlNodes, self.store.getState(), {
                elementDrawer: function (skill) {
                    return '<li class="list-group-item"><a class="reset" href="/skills/details?id=' + skill.Id + '">' + skill.Name + '</a></li>';
                },
                noResultsHtml: '<i>No skills found</i>'
            });
        };

        PaginatedList.attachActions(self.store, self.htmlNodes, getSkills);

        self.store.subscribe(render);
    }

    var store = Redux.createStore(paginatedList.reducer, Redux.applyMiddleware(thunk));

    document.addEventListener("DOMContentLoaded", function() {
        var skillsList = new SkillsList({
            htmlNodes: paginatedList.getHtmlNodes('skills'),
            store: store
        });
        skillsList.initialize();
    });

})(window.JsCommons, window.Ajax, window.PaginatedList);
