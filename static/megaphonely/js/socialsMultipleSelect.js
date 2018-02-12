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
});