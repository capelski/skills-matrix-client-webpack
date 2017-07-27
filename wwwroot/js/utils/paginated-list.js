(function() {

    function eventDelayer(eventHandler, delay) {
        var timeOut = null;
        delay = delay || 300;
        return function (event) {
            if (timeOut) {
                clearTimeout(timeOut);
            }
            timeOut = setTimeout(function() {
                timeOut = null;
                eventHandler(event);
            }, delay);
        }
    }

    // TODO Implement the event transforming
    // TODO Use state modifiers in Reducer & attachEvents

    PaginatedList.stateModifiers = {
    	initialize: function(state, action)  {
	        state.loadPhase = 'loading';
	        state.keywords = '';
	        state.page = 0;
	        state.pageOffset = 0;
	    },
		pageButtons: function(state, action)  {
	        state.loadPhase = 'loading';
	        if (!isNaN(action.target)) {
	            state.page = parseInt(action.target);
	        }
	        else if (action.target === 'previous') {
	            if ((state.pageOffset - state.pagesNumber) >= 0) {
	                state.pageOffset -= state.pagesNumber;                    
	            }
	            state.page = 0;
	        }
	        else if (action.target === 'following') {
	            if ((state.pageOffset + state.pagesNumber) < state.totalPages) {
	                state.pageOffset += state.pagesNumber;
	            }
	            state.page = 0;
	        }
	    },
		pageSizeList: function(state, action)  {
	        state.loadPhase = 'loading';            
	        state.pageSize = action.pageSize;
	        state.page = 0;
	        state.pageOffset = 0;
	    },
	    searcher: function(state, action)  {
	        state.loadPhase = 'loading';
	        state.keywords = action.keywords;
	        state.page = 0;
	        state.pageOffset = 0;
	    }
    };

    /*
    PaginatedList.stateHandlers = {};

    PaginatedList.stateHandlers.initialize = function(state, event)  {
        state.loadPhase = 'loading';
        state.keywords = '';
        state.page = 0;
        state.pageOffset = 0;
    };

    PaginatedList.stateHandlers.pageButtons = function(state, event)  {
        state.loadPhase = 'loading';
        var action = $(event.target).data('page-action');
        if (!isNaN(action)) {
            state.page = parseInt(action);
        }
        else if (action === 'previous') {
            if ((state.pageOffset - state.pagesNumber) >= 0) {
                state.pageOffset -= state.pagesNumber;                    
            }
            state.page = 0;
        }
        else if (action === 'following') {
            if ((state.pageOffset + state.pagesNumber) < state.totalPages) {
                state.pageOffset += state.pagesNumber;
            }
            state.page = 0;
        }
    };

    PaginatedList.stateHandlers.pageSizeList = function(state, event)  {
        state.loadPhase = 'loading';            
        var element = $(event.target);
        state.pageSize = element.data('size');
        state.page = 0;
        state.pageOffset = 0;
    };

    PaginatedList.stateHandlers.searcher = function(state, event)  {
        state.loadPhase = 'loading';
        state.keywords = event.target.value;
        state.page = 0;
        state.pageOffset = 0;
    };
    */

    function PaginatedList(listId, resultsFetcher, renderingOptions) {
        var self = this;
        self.htmlNodes = PaginatedList.getHtmlNodes(listId);
        self.state = PaginatedList.getState(listId);
        self.reducer = PaginatedList.getReducer(listId);
        self.resultsFetcher = resultsFetcher;
        self.renderingOptions = renderingOptions;
        self.render = function () {
            PaginatedList.render(self.htmlNodes, self.state, self.renderingOptions)
        };

        self.attachActions = function(store) {

            function pageButtons(event) {
            	// TODO Perform event transforming
	            store.dispatch(function(dispatch) {
	                dispatch({
	                    event: event,
	                    type: 'pageButtons'
	                });
	                self.resultsFetcher(store.getState(), dispatch);
	            });
	        }

	        function pageSizeList(event) {
            	// TODO Perform event transforming
	            store.dispatch(function(dispatch) {
	                dispatch({
	                    event: event,
	                    type: 'pageSizeList'
	                });
	                self.resultsFetcher(store.getState(), dispatch);
	            });
	        }

	        function searcher(event) {
            	// TODO Perform event transforming
	            store.dispatch(function(dispatch) {
	                dispatch({
	                    event: event,
	                    type: 'searcher'
	                });
	                self.resultsFetcher(store.getState(), dispatch);
	            });
	        }

	        function initialize(event) {
            	// TODO Perform event transforming
	            store.dispatch(function(dispatch) {
	                dispatch({
	                    type: 'initialize'
	                });
	                self.resultsFetcher(store.getState(), dispatch);
	            });
	        }

            self.htmlNodes.keywords.on('keyup', eventDelayer(function(event) {
                hanlders.searcher(event);
            }));
            self.htmlNodes.pageSizeList.on('click', '.dropdown-option', function(event) {
                hanlders.pageSizeList(event);
            });
            self.htmlNodes.pages.on('click', '.enabled > .page-button', function(event) {
                hanlders.pageButtons(event);
            });
            self.htmlNodes.clearKeywords.on('click', function(event) {
                hanlders.initialize(event);
            });
        };

        self.attachEvents = function(state, render) {

            function pageButtons(event) {
            	// TODO Perform event transforming
            	// Directly call the stateUpdaters emulating the redux call
                self.resultsFetcher(state);
	        }

	        function pageSizeList(event) {
            	// TODO Perform event transforming
            	// Directly call the stateUpdaters emulating the redux call
                self.resultsFetcher(state);
	        }

	        function searcher(event) {
            	// TODO Perform event transforming
            	// Directly call the stateUpdaters emulating the redux call
                self.resultsFetcher(state);
	        }

	        function initialize(event) {
            	// TODO Perform event transforming
            	// Directly call the stateUpdaters emulating the redux call
                self.resultsFetcher(state);
	        }

            self.htmlNodes.keywords.on('keyup', eventDelayer(function(event) {
                hanlders.searcher(event);
                render();
            }));
            self.htmlNodes.pageSizeList.on('click', '.dropdown-option', function(event) {
                hanlders.pageSizeList(event);
                render();
            });
            self.htmlNodes.pages.on('click', '.enabled > .page-button', function(event) {
                hanlders.pageButtons(event);
                render();
            });
            self.htmlNodes.clearKeywords.on('click', function(event) {
                hanlders.initialize(event);
                render();
            });
        };
    }

    PaginatedList.getDefaultResults = function () {
        return {
            Items: [],
            TotalPages: 0
        };
    };

    PaginatedList.getHtmlNodes = function(listId) {
        return {
            clearKeywords: $('#'+ listId + '-clear-keywords'),
            keywords: $('#'+ listId + '-keywords'),
            list: $('#'+ listId + '-list'),
            loader: $('#'+ listId + '-loader'),
            pages: $('#'+ listId + '-pages'),
            pageSize: $('#'+ listId + '-page-size'),
            pageSizeList: $('#'+ listId + '-page-size-dropdown'),
            paginationBar: $('#'+ listId + '-pagination'),
            searcher: $('#'+ listId + '-searcher'),
            wrapper: $('#'+ listId + '-wrapper')
        };
    };

    PaginatedList.getState = function(listId) {
        var state = {
            hasSearcher: false,
            hasPagination: false,
            keywords: '',
            listId: listId,
            loadPhase: 'not-loaded',
            loadPhases: ['not-loaded', 'loading', 'loaded'],
            page: 0,
            pageSize: 10,
            pageSizeOptions: [10, 25, 50],
            pageOffset: 0,
            pagesNumber: 5,
            results: [],
            searcherPlaceholder: 'Search ...',
            totalPages: 0
        };
        return state;
    };

    PaginatedList.getReducer = function(listId) {
        return function (state, action) {
            if (typeof state === 'undefined') {
                state = PaginatedList.getState(listId);
            }

            switch (action.type) {
                case listId + '_pageButtons':
                    PaginatedList.stateHandlers.pageButtons(state, action.event);
                    return state;
                case listId + '_pageSizeList':
                    PaginatedList.stateHandlers.pageSizeList(state, action.event);
                    return state;
                case listId + '_searcher':
                    PaginatedList.stateHandlers.searcher(state, action.event);
                    return state;
                case listId + '_initialize':
                    PaginatedList.stateHandlers.initialize(state, action.event);
                    if (action.config) {
                        state.hasSearcher = typeof action.config.hasSearcher === "undefined" ? state.hasSearcher : action.config.hasSearcher;
                        state.hasPagination = typeof action.config.hasPagination === "undefined" ? state.hasPagination : action.config.hasPagination;
                    }
                    return state;
                case listId + '_updateResults':
                    state.results = action.paginatedList.Items;
                    state.totalPages = action.paginatedList.TotalPages;
                    state.loadPhase = 'loaded';
                    return state;
                default:
                    return state;
            }
        };
    };

    PaginatedList.render = function(htmlNodes, state, options) {
        options = options || {};
        options.noResultsHtml = options.noResultsHtml || '<i>No results found</i>';
        options.elementDrawer = options.elementDrawer || function (element) {
            return '<li class="list-group-item">' + element + '</li>';
        };

        htmlNodes.loader.parent().removeClass(state.loadPhases.join(' ')).addClass(state.loadPhase);
        PaginatedList.render.searcher(htmlNodes, state);

        if (state.loadPhase !== 'loading') {
            PaginatedList.render.pagination(htmlNodes, state);
            PaginatedList.render.results(htmlNodes, state, options);
        }
    };

    PaginatedList.render.pagination = function(htmlNodes, state) {
        if (state.hasPagination) {
            var pagesNumber = Math.min(state.pagesNumber, state.totalPages - state.pageOffset);
            if (pagesNumber) {
                var pagination = '<li class="' + ((state.pageOffset - state.pagesNumber) >= 0 ? 'enabled' : 'disabled') +
                '"><span class="page-button" data-page-action="previous">&laquo;</span></li>';
                for (var i = 0; i < pagesNumber; ++i) {
                    pagination += '<li class="' + (state.page === i ? 'active' : 'enabled') + '"><span class="page-button" data-page-action="' +
                    i + '">' + (state.pageOffset + i + 1) + '</span></li>';
                }
                pagination += '<li class="' + ((state.pageOffset + state.pagesNumber) < state.totalPages ? 'enabled' : 'disabled') +
                '"><span class="page-button" data-page-action="following">&raquo;</span></li>';
                htmlNodes.pages.html(pagination);

                htmlNodes.pageSizeList.empty();
                state.pageSizeOptions.forEach(function(option) {
                    htmlNodes.pageSizeList.append('<li class="text-right"><span class="dropdown-option" data-size="' + option + '">' + option + '</span></li>');
                });

                htmlNodes.paginationBar.show();
            }
            else {
                htmlNodes.paginationBar.hide();
            }
            
            htmlNodes.pageSize.text(state.pageSize);
        }
        else {
            htmlNodes.paginationBar.hide();
        }
    };

    PaginatedList.render.results = function(htmlNodes, state, options) {
        htmlNodes.list.empty();
        if (!state.results || !state.results.length) {
            htmlNodes.list.append(options.noResultsHtml);
        }
        else {
            state.results.map(options.elementDrawer)
            .forEach(function(element) {
                htmlNodes.list.append(element);
            });
        }
    };

    PaginatedList.render.searcher = function(htmlNodes, state) {
        htmlNodes.keywords.attr('placeholder', state.searcherPlaceholder);
        if (state.hasSearcher) {
            htmlNodes.keywords.val(state.keywords);
            if (state.keywords && state.keywords.length > 0) {
                htmlNodes.clearKeywords.show();
            }
            else {
                htmlNodes.clearKeywords.hide();
            }
            htmlNodes.searcher.show();
        }
        else {
            htmlNodes.searcher.hide();
        }
    };

    window.PaginatedList = PaginatedList;

})();