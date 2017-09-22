(function() {
    
    function create() {
        $('.loader').html(
            '<div class="sk-chasing-dots">' +
            '    <div class="sk-child sk-dot1"></div>' +
            '    <div class="sk-child sk-dot2"></div>' +
            '</div>'
        );
    }

    create();

    window.Loader = {
        create
    };
})();