(function() {
    window.application = window.application || {};
    window.application.paginatedList = {
        fill: function(listNode, results, options) {
            options = options || {};
            options.noResultsHtml = options.noResultsHtml || '<i>No results found</i>';
            options.elementDrawer = options.elementDrawer || function (element) {
                return '<li class="list-group-item">' + element + '</li>';
            };

            listNode.empty();
            if (!results || !results.length) {
                listNode.append(options.noResultsHtml);
            }
            else {
                results.map(options.elementDrawer)
                .forEach(function(element) {
                    listNode.append(element);
                });
            }
        },
        defaultInstance: {
            Items: [],
            TotalPages: 0
        },
        getHtmlNodes: function(listId) {
            return {
                paginationBar: $('#'+ listId + '-pagination'),
                pages: $('#'+ listId + '-pages'),
                pageSize: $('#'+ listId + '-page-size'),
                pageSizeList: $('#'+ listId + '-page-size-dropdown')
            };
        },
        getState: function() {
            var state = {
                page: 0,
                pageSize: 10,
                pageSizeOptions: [10, 25, 50],
                pageOffset: 0,
                pagesNumber: 5,
                totalPages: 0,
            };
            return state;
        },
        htmlUpdater: function(htmlNodes, state) {
            var pagesNumber = Math.min(state.paginatedList.pagesNumber, state.paginatedList.totalPages - state.paginatedList.pageOffset);
            if (pagesNumber) {

                var pagination = '<li class="' + ((state.paginatedList.pageOffset - state.paginatedList.pagesNumber) >= 0 ? 'enabled' : 'disabled') +
                '"><span class="page-button" data-page-action="previous">&laquo;</span></li>';
                for (var i = 0; i < pagesNumber; ++i) {
                    pagination += '<li class="' + (state.paginatedList.page === i ? 'active' : 'enabled') + '"><span class="page-button" data-page-action="' +
                    i + '">' + (state.paginatedList.pageOffset + i + 1) + '</span></li>';
                }
                pagination += '<li class="' + ((state.paginatedList.pageOffset + state.paginatedList.pagesNumber) < state.paginatedList.totalPages ? 'enabled' : 'disabled') +
                '"><span class="page-button" data-page-action="following">&raquo;</span></li>';
                htmlNodes.pages.html(pagination);

                htmlNodes.pageSizeList.empty();
                state.paginatedList.pageSizeOptions.forEach(function(option) {
                    htmlNodes.pageSizeList.append('<li class="text-right"><span class="dropdown-option" data-size="' + option + '">' + option + '</span></li>');
                });

                htmlNodes.paginationBar.show();
            }
            else {
                htmlNodes.paginationBar.hide();
            }
            htmlNodes.pageSize.text(state.paginatedList.pageSize);
        },
        stateUpdaters: {
            pages: function(state, event) {
                var action = $(event.target).data('page-action');
                if (!isNaN(action)) {
                    state.paginatedList.page = parseInt(action);
                }
                else if (action === 'previous') {
                    if ((state.paginatedList.pageOffset - state.paginatedList.pagesNumber) >= 0) {
                        state.paginatedList.pageOffset -= state.paginatedList.pagesNumber;                    
                    }
                    state.paginatedList.page = 0;
                }
                else if (action === 'following') {
                    if ((state.paginatedList.pageOffset + state.paginatedList.pagesNumber) < state.paginatedList.totalPages) {
                        state.paginatedList.pageOffset += state.paginatedList.pagesNumber;
                    }
                    state.paginatedList.page = 0;
                }
            },
            pageSize: function(state, event) {
                var element = $(event.target);
                state.paginatedList.pageSize = element.data('size');
                state.paginatedList.page = 0;
                state.paginatedList.pageOffset = 0;
            }
        },
        attachEvents: function(htmlNodes, eventHandlers) {
            htmlNodes.pageSizeList.on('click', '.dropdown-option', eventHandlers.pageSizeList);
            htmlNodes.pages.on('click', '.enabled > .page-button', eventHandlers.pageButtons);
        }
    };
})();