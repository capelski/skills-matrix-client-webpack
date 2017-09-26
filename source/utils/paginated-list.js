import js from './js-commons';

export default {
    bindDefaultEventHandlers,
    getActionDispatchers,
    getDefaultResults,
    getHtmlNodes,
    getReducer,
    getRenderer
};

function bindDefaultEventHandlers(htmlNodes, actionDispatchers) {
    htmlNodes.clearKeywords.on('click', function(event) {
        actionDispatchers.initialize({
            loadPhase: 'loading'
        });
    });
    htmlNodes.keywords.on('keyup', js.eventDelayer(function(event) {
        actionDispatchers.searcher({
            keywords: event.target.value
        });
    }));
    htmlNodes.pages.on('click', '.enabled > .page-button', function(event) {
        actionDispatchers.pageButtons({
            movement: $(event.target).data('page-action')
        });
    });
    htmlNodes.pageSizeList.on('click', '.dropdown-option', function(event) {
        actionDispatchers.pageSizeList({
            pageSize: $(event.target).data('size')
        });
    });
}

function getActionDispatcher(store, listReduxId, fetcher, viewName, actionType) {
    return function (action) {
        action.type = actionType;
        action.listId = listReduxId;
        store.dispatch(function(dispatch) {
            dispatch(action);
            fetcher(store.getState()[viewName])
            .then(function(results) {
                store.dispatch({
                    type: 'paginatedListResults',
                    listId: listReduxId,
                    results
                });
            });
        });
    };
}

function getActionDispatchers(store, listReduxId, fetcher, viewName) {
    var actionDispatchers = {
        initialize: getActionDispatcher(store, listReduxId, fetcher, viewName, 'paginatedListInitialize'),
        pageButtons: getActionDispatcher(store, listReduxId, fetcher, viewName, 'paginatedListButtons'),
        pageSizeList: getActionDispatcher(store, listReduxId, fetcher, viewName, 'paginatedListSize'),
        searcher: getActionDispatcher(store, listReduxId, fetcher, viewName, 'paginatedListSearcher')
    };
    return actionDispatchers;
}

function getDefaultResults() {
    var defaultResults = {
        Items: [],
        TotalPages: 0
    };
    return defaultResults;
}

function getHtmlNodes(listHtmlId) {
    var htmlNodes = {
        clearKeywords: $('#' + listHtmlId + '-clear-keywords'),
        keywords: $('#' + listHtmlId + '-keywords'),
        list: $('#' + listHtmlId + '-list'),
        loader: $('#' + listHtmlId + '-loader'),
        pages: $('#' + listHtmlId + '-pages'),
        pageSize: $('#' + listHtmlId + '-page-size'),
        pageSizeList: $('#' + listHtmlId + '-page-size-dropdown'),
        paginationBar: $('#' + listHtmlId + '-pagination'),
        searcher: $('#' + listHtmlId + '-searcher'),
        wrapper: $('#' + listHtmlId + '-wrapper')
    };
    return htmlNodes;
}

function getReducer(listReduxId) {
    return function(state, action) {
        if (typeof state === 'undefined') {
            state = {
                hasSearcher: false,
                hasPagination: false,
                keywords: '',
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
        }

        if (action.listId != listReduxId) {
            return state;
        }

        switch (action.type) {
            case 'paginatedListInitialize':
                var hasSearcher = action.config && action.config.hasSearcher != null ?
                    action.config.hasSearcher :
                    state.hasSearcher;
                var hasPagination = action.config && action.config.hasPagination != null ?
                    action.config.hasPagination :
                    state.hasPagination;
                var loadPhase = action.loadPhase != null ? action.loadPhase : state.loadPhase;
                var results = action.results != null ? action.results : state.results;
                return {
                    ...state,
                    hasSearcher,
                    hasPagination,
                    loadPhase,
                    results,
                    keywords: '',
                    page: 0,
                    pageOffset: 0
                };
            case 'paginatedListButtons':
                var page = 0;
                var pageOffset = state.pageOffset;
                if (!isNaN(action.movement)) {
                    page = parseInt(action.movement);
                }
                else if (action.movement === 'previous' && (state.pageOffset - state.pagesNumber) >= 0) {
                    pageOffset = state.pageOffset - state.pagesNumber;
                }
                else if (action.movement === 'following' &&
                (state.pageOffset + state.pagesNumber) < state.totalPages) {
                    pageOffset = state.pageOffset + state.pagesNumber;
                }
                return {
                    ...state,
                    page,
                    pageOffset,
                    loadPhase: 'loading'
                };
            case 'paginatedListSize':
                return {
                    ...state,
                    loadPhase: 'loading',
                    pageSize: action.pageSize,
                    page: 0,
                    pageOffset: 0
                };
            case 'paginatedListSearcher':
                return {
                    ...state,
                    loadPhase: 'loading',
                    keywords: action.keywords,
                    page: 0,
                    pageOffset: 0
                };
            case 'paginatedListResults':
                var loadPhase = action.loadPhase != null ? action.loadPhase : 'loaded';                    
                var keywords = action.keywords != null ? action.keywords : state.keywords;                    
                return {
                    ...state,
                    loadPhase,
                    keywords,
                    results: action.results.Items,
                    totalPages: action.results.TotalPages,
                };
            default:
                return state;
        }
    }
}

function getRenderer(listHtmlId, noResultsHtml, elementDrawer) {
    noResultsHtml = noResultsHtml || '<i>No results found</i>';
    elementDrawer = elementDrawer || function(element) {
        return `<li class= "list-group-item"> ${element} </li>`;
    };

    $('#' + listHtmlId).html(
        `<div id="${listHtmlId}-wrapper" class="paginated-list">
            <div id="${listHtmlId}-searcher" class="input-group" style="display: none;">
                <span class="input-group-addon"><i class="fa fa-search"></i></span>
                <input id="${listHtmlId}-keywords" class="form-control" />
                <span id="${listHtmlId}-clear-keywords" class="fa fa-times clear-icon"></span>
            </div>
            <div class="dynamic-content">
                <ul id="${listHtmlId}-list" class="list-group clickable"></ul>
                <div id="${listHtmlId}-loader" class="loader"></div>
                <div id="${listHtmlId}-pagination" class="pagination-bar" style="display: none;">
                    <ul id="${listHtmlId}-pages" class="pagination clickable">
                    </ul>
                    <div class="dropup pull-right">
                        <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                            <span id="${listHtmlId}-page-size">10</span>
                            <span class="caret"></span>
                        </button>
                        <ul id="${listHtmlId}-page-size-dropdown" class="dropdown-menu"
                        aria-labelledby="dropdownMenu1">
                        </ul>
                    </div>
                    <div class="clearfix"></div>
                </div>
            </div>
        </div>`
    );
    js.injectLoader();

    var htmlNodes = getHtmlNodes(listHtmlId);

    return function(listState, globalState) {
           
        htmlNodes.loader.parent().removeClass(listState.loadPhases.join(' ')).addClass(listState.loadPhase);
        htmlNodes.keywords.attr('placeholder', listState.searcherPlaceholder);
        if (listState.hasSearcher) {
            htmlNodes.keywords.val(listState.keywords);
            if (listState.keywords && listState.keywords.length > 0) {
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

        if (listState.loadPhase !== 'loading') {
            if (listState.hasPagination) {
                var pagesNumber = Math.min(listState.pagesNumber, listState.totalPages - listState.pageOffset);
                if (pagesNumber) {
                    var pagination = '<li class= "' + ((listState.pageOffset - listState.pagesNumber) >= 0 ?
                        'enabled' :
                        'disabled') +
                    '"><span class= "page-button" data-page-action= "previous">&laquo;</span></li>';
                    for (var i = 0; i < pagesNumber; ++i) {
                        pagination += '<li class= "' + (listState.page === i ?
                            'active' :
                            'enabled') +
                        '"><span class= "page-button" data-page-action= "' + i + '">' +
                        (listState.pageOffset + i + 1) + '</span></li>';
                    }
                    pagination += '<li class= "' + ((listState.pageOffset + listState.pagesNumber) < listState.totalPages ?
                            'enabled' :
                            'disabled') +
                    '"><span class= "page-button" data-page-action= "following">&raquo;</span></li>';
                    htmlNodes.pages.html(pagination);

                    htmlNodes.pageSizeList.empty();
                    listState.pageSizeOptions.forEach(function(option) {
                        htmlNodes.pageSizeList.append(
                            '<li class= "text-right"><span class= "dropdown-option" data-size= "' +
                            option + '">' + option + '</span></li>');
                    });

                    htmlNodes.paginationBar.show();
                }
                else {
                    htmlNodes.paginationBar.hide();
                }

                htmlNodes.pageSize.text(listState.pageSize);
            }
            else {
                htmlNodes.paginationBar.hide();
            }

            htmlNodes.list.empty();
            if (!listState.results || !listState.results.length) {
                htmlNodes.list.append(noResultsHtml);
            }
            else {
                listState.results.map(function(element) {
                    return elementDrawer(element, globalState);
                })
                .forEach(function(element) {
                    htmlNodes.list.append(element);
                });
            }
        }
    };
};
