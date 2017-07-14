(function(js, ajax, paginatedList) {

    function loadSkills(state, dispatch) {
        js.stallPromise(ajax.get('/api/skill', {
            keywords: state.keywords,
            page: state.page + state.pageOffset,
            pageSize: state.pageSize
        }, paginatedList.defaultInstance), 1000)
        .then(function(paginatedList) {
            dispatch({
                paginatedList: paginatedList,
                type: 'updateResults'
            });
        });
    }

    function SkillsList(options) {
        var self = this;
        self.htmlNodes = options.htmlNodes;
        self.store = options.store;
        self.initialize = function() {
            self.store.dispatch(function(dispatch) {
                dispatch({
                    type: 'initializeList'
                });
                loadSkills(self.store.getState(), dispatch);
            });
        };

        var actions = {
            pageButtons: function(event) {
                self.store.dispatch(function(dispatch) {
                    dispatch({
                        pageAction: event.target.getAttribute('data-page-action'),
                        type: 'pageButtons'
                    });
                    loadSkills(self.store.getState(), dispatch);
                });
            },
            pageSizeList: function(event) {
                self.store.dispatch(function(dispatch) {
                    dispatch({
                        pageSize: event.target.getAttribute('data-size'),
                        type: 'pageSizeList'
                    });
                    loadSkills(self.store.getState(), dispatch);
                });
            },
            searcher: function(event) {
                self.store.dispatch(function(dispatch) {
                    dispatch({
                        keywords: event.target.value,
                        type: 'searcher'
                    });
                    loadSkills(self.store.getState(), dispatch);
                });
            },
            clearKeywords: function(event) {
                self.store.dispatch(function(dispatch) {
                    dispatch({
                        type: 'initializeList'
                    });
                    loadSkills(self.store.getState(), dispatch);
                });
            }
        };

        function render() {
            paginatedList.htmlUpdater(self.htmlNodes, self.store.getState(), {
                elementDrawer: function (skill) {
                    return '<li class="list-group-item"><a class="reset" href="/skills/details?id=' + skill.Id + '">' + skill.Name + '</a></li>';
                },
                noResultsHtml: '<i>No skills found</i>'
            });
        };

        paginatedList.attachEvents(self.htmlNodes, {
            pageButtons: actions.pageButtons,
            pageSizeList: actions.pageSizeList,
            searcher: actions.searcher,
            clearKeywords: actions.clearKeywords
        });

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

})(JsCommons, Ajax, PaginatedList);