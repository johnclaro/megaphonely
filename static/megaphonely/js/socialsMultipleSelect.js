function countInstances(string, word) {
   return string.split(word).length - 1;
}

$(function() {
    function formatState (state) {
        if (!state.id) {
            return state.text;
        }
        const provider = state.text.split('-')[0]

        const name = state.text.split('-')[1]
        const newState = `<span><i class="fab fa-${provider}"></i> ${name}</span>`
        const $state = $(newState);
        return $state;
    };

    $('.socials-multiple').select2({
        placeholder: 'Choose social(s)',
        templateResult: formatState,
        width: '100%'
    });

    $('.socials-multiple').on("select2:selecting", function(e) {
        const provider = e.params.args.data.text.split('-')[0];
        const providerIcon = $(`#${provider}_content`)
        providerIcon.show();
    });

    $('.socials-multiple').on("select2:unselecting", function(e) {
        const provider = e.params.args.data.text.split('-')[0];
        const providerIcon = $(`#${provider}_content`)

        const selectedOptions = $(".socials-multiple option:selected").text();
        if(countInstances(selectedOptions, `${provider}-`) == 1) {
            providerIcon.hide();
        }
    });
});

