(function() {
    var utils = window.application.utils;

    function Searcher($searcherNode, $listNode, $loaderNode, resultsHandler, elementDrawer) {
        var self = this;
        self.$searcher = $searcherNode;
        self.$list = $listNode;
        self.$loader = $loaderNode;
        self.resultsHandler = resultsHandler;
        self.keywords = '';
        self.searchTimeout = null;

        self.reload = function() {
            self.$list.empty();
            utils.longOperation(updatePromise, self.$loader);
        }

        self.$searcher.on('keyup', search);

        function updatePromise() {
            return self.resultsHandler(self.keywords)
            .then(function(results) {
                if (!results || !results.length) {
                    self.$list.append('<i>No results found</i>');
                }
                else {
                    var htmlStrings = results.map(elementDrawer);
                    htmlStrings.forEach(function(element) {
                        self.$list.append(element);
                    });
                }
            });
        }

        function search(event) {
            if (self.searchTimeout) {
                clearTimeout(self.searchTimeout);
            }
            self.searchTimeout = setTimeout(function() {
                self.searchTimeout = null;
                self.keywords = event.target.value;
                self.reload();
            }, 300);
        }
    }

    window.application = window.application || {};
    window.application.Searcher = function($searcherNode, $listNode, $loaderNode, resultsHandler, elementDrawer) {
        return new Searcher($searcherNode, $listNode, $loaderNode, resultsHandler, elementDrawer);
    }
})();