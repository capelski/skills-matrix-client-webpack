(function(js) {

    var PaginatedList = {
        attachEvents: function(htmlNodes, state, render, resultsUpdater) {

            resultsUpdater = resultsUpdater || function(state) {
                state.loadPhase = 'loaded';
            };

            function initialize(event) {
                state.loadPhase = 'loading';
                state.keywords = '';
                state.page = 0;
                state.pageOffset = 0;
                render();
                resultsUpdater(state);
            }

            function pageButtons(event) {
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
                render();
                resultsUpdater(state);
            }

            function pageSizeList(event) {
                state.loadPhase = 'loading';            
                var element = $(event.target);
                state.pageSize = element.data('size');
                state.page = 0;
                state.pageOffset = 0;
                render();
                resultsUpdater(state);
            }

            function searcher(event) {
                state.loadPhase = 'loading';
                state.keywords = event.target.value;
                state.page = 0;
                state.pageOffset = 0;
                render();
                resultsUpdater(state);
            }

            htmlNodes.keywords.on('keyup', js.eventDelayer(searcher));
            htmlNodes.pageSizeList.on('click', '.dropdown-option', pageSizeList);
            htmlNodes.pages.on('click', '.enabled > .page-button', pageButtons);
            htmlNodes.clearKeywords.on('click', initialize);
        },
        defaultInstance: {
            Items: [],
            TotalPages: 0
        },
        fill: function(htmlNodes, results, options) {
            options = options || {};
            options.noResultsHtml = options.noResultsHtml || '<i>No results found</i>';
            options.elementDrawer = options.elementDrawer || function (element) {
                return '<li class="list-group-item">' + element + '</li>';
            };

            htmlNodes.list.empty();
            if (!results || !results.length) {
                htmlNodes.list.append(options.noResultsHtml);
            }
            else {
                results.map(options.elementDrawer)
                .forEach(function(element) {
                    htmlNodes.list.append(element);
                });
            }
        },
        getHtmlNodes: function(listId) {
            return {
                clearKeywords : $('#'+ listId + '-clear-keywords'),
                keywords : $('#'+ listId + '-keywords'),
                list : $('#'+ listId + '-list'),
                loader : $('#'+ listId + '-loader'),
                pages: $('#'+ listId + '-pages'),
                pageSize: $('#'+ listId + '-page-size'),
                pageSizeList: $('#'+ listId + '-page-size-dropdown'),
                paginationBar: $('#'+ listId + '-pagination'),
                wrapper: $('#'+ listId + '-wrapper')
            };
        },
        getState: function() {
            var state = {
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
            return state;
        },
        render: function(htmlNodes, state, options) {
            htmlNodes.keywords.val(state.keywords);
            htmlNodes.clearKeywords.hide();
            if (state.keywords && state.keywords.length > 0) {
                htmlNodes.clearKeywords.show();
            }

            htmlNodes.loader.parent().removeClass(state.loadPhases.join(' ')).addClass(state.loadPhase);

            if (state.loadPhase !== 'loading') {
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

                window.PaginatedList.fill(htmlNodes, state.results, options);
            }
        }
    };
    window.PaginatedList = PaginatedList;

})(window.JsCommons);