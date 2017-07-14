reducer: function (state, action) {
            if (typeof state === 'undefined') {
                state = {
                    loadPhases: ['not-loaded', 'loading', 'loaded'],
                    keywords: '',
                    loadPhase: 'not-loaded',
                    page: 0,
                    pageSize: 10,
                    pageSizeOptions: [10, 25, 50],
                    pageOffset: 0,
                    pagesNumber: 5,
                    results: [],
                    totalPages: 0
                };
            }

            switch (action.type) {
                case 'pageButtons':
                    if (!isNaN(action.pageAction)) {
                        state.page = parseInt(action.pageAction);
                    }
                    else if (action.pageAction === 'previous') {
                        if ((state.pageOffset - state.pagesNumber) >= 0) {
                            state.pageOffset -= state.pagesNumber;                    
                        }
                        state.page = 0;
                    }
                    else if (action.pageAction === 'following') {
                        if ((state.pageOffset + state.pagesNumber) < state.totalPages) {
                            state.pageOffset += state.pagesNumber;
                        }
                        state.page = 0;
                    }
                    state.loadPhase = 'loading';
                    return state;
                case 'pageSizeList':
                    state.pageSize = action.pageSize;
                    state.page = 0;
                    state.pageOffset = 0;
                    state.loadPhase = 'loading';
                    return state;
                case 'searcher':
                    state.keywords = action.keywords;
                    state.page = 0;
                    state.pageOffset = 0;
                    state.loadPhase = 'loading';
                    return state;
                case 'initializeList':
                    state.keywords = '';
                    state.page = 0;
                    state.pageOffset = 0;
                    state.loadPhase = 'loading';
                    return state;
                case 'updateResults':
                    state.results = action.paginatedList.Items;
                    state.totalPages = action.paginatedList.TotalPages;
                    state.loadPhase = 'loaded';
                    return state;
                default:
                    return state;
            }
        }