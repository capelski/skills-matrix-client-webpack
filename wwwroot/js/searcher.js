(function() {

    function Searcher($htmlNode, updateHandler) {
        var self = this;
        self.$node = $htmlNode;
        self.keywords = null;
        self.searchTimeout = null;

        self.search = function(event) {
            if (self.searchTimeout) {
                clearTimeout(self.searchTimeout);
            }
            self.searchTimeout = setTimeout(function() {
                self.keywords = event.target.value;
                updateHandler(self.keywords);
                self.searchTimeout = null;
            }, 300);
        };

        this.$node.on('keyup', this.search);
    }

    window.application = window.application || {};
    window.application.Searcher = function($htmlNode, updateHandler) {
        return new Searcher($htmlNode, updateHandler);
    }
})();