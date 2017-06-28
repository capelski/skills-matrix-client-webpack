(function() {
    var utils = window.application.utils;

    function SearchList(searchListId, resultsPromise, options) {
        var self = this;
        self.$kewyords = $('#' + searchListId + '-keywords');
        self.$list = $('#' + searchListId + '-list');
        self.$loader = $('#' + searchListId + '-loader');
        self.resultsPromise = resultsPromise;

        options = options || {};
        self.keywords = options.keywords || '';
        self.noResultsHtml = options.noResultsHtml || '<i>No results found</i>';
        self.elementDrawer = options.elementDrawer || function (element) {
            return '<li class="list-group-item">' + element + '</li>';
        };

        self.reload = function() {
            self.$list.empty();
            utils.longOperation(updatePromise, self.$loader);
        };

        self.$kewyords.on('keyup', utils.eventDelayer(search));

        function updatePromise() {
            return self.resultsPromise(self.keywords)
            .then(function(results) {
                if (!results || !results.length) {
                    self.$list.append(self.noResultsHtml);
                }
                else {
                    var htmlStrings = results.map(self.elementDrawer);
                    htmlStrings.forEach(function(element) {
                        self.$list.append(element);
                    });
                }
            });
        }

        function search(event) {
            self.keywords = event.target.value;
            self.reload();
        }
    }

    window.application = window.application || {};
    window.application.SearchList = SearchList;
})();