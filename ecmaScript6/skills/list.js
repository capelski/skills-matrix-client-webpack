(function (ajax, paginatedListUtils) {
    
        var skillslistReduxId = 'skills-list';
        var skillslistHtmlId = 'skills-list-wrapper';
    
        function skillsFetcher(state) {
            return ajax.get('/api/skill', {
                keywords: state.keywords,
                page: state.page + state.pageOffset,
                pageSize: state.pageSize
            }, paginatedListUtils.getDefaultResults());
        }
    
        window.reducers = window.reducers || {};
        window.reducers.skillsList = paginatedListUtils.getReducer(skillslistReduxId);
    
        var skillsListRenderer = paginatedListUtils.getRenderer(skillslistHtmlId, '<i>No skills found</i>',
        function (skill) {
            return '<li class="list-group-item"><a class="reset" href="/skills/details?id=' +
            skill.Id + '">' + skill.Name + '</a></li>';
        });
    
        window.renderers = window.renderers || {};
        window.renderers.skillsList = skillsListRenderer;
    
        window.actionBinders = window.actionBinders || [];
        window.actionBinders.push(function(store) {
            var htmlNodes = paginatedListUtils.getHtmlNodes(skillslistHtmlId);
            var actionDispatchers = paginatedListUtils.getActionDispatchers(
                store,
                skillslistReduxId,
                skillsFetcher,
                'skillsList'
            );
            paginatedListUtils.bindDefaultEventHandlers(htmlNodes, actionDispatchers);
        });
    
        window.pages = window.pages || [];
        window.pages.push({
            id: 'skills-list-section',
            loader: function(pageData, store) {            
                store.dispatch({
                    type: 'paginatedListInitialize',
                    listId: skillslistReduxId,
                    config: {
                        hasSearcher: true,
                        hasPagination: true
                    }
                });
    
                return skillsFetcher(store.getState().skillsList)
                .then(function(results) {
                    store.dispatch({
                        type: 'paginatedListResults',
                        listId: skillslistReduxId,
                        results
                    });
                });
            }
        });
    
    })(window.Ajax, window.PaginatedListUtils);
    