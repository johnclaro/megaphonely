$(function() {
    const checkboxes = $('#checkboxes');
    const composer = $('#composer');
    const composerAlert = $('#composer-alert');

    let anyChecked;
    $('#checkboxes input[type="checkbox"]').each(function() {
        if ($(this).is(":checked")) {
            anyChecked = true;
        }
        anyChecked ? composer.show() : composer.hide();
        if (anyChecked) {
            composer.show();
            composerAlert.hide();
        } else {
            composer.hide();
            composerAlert.show();
        }
    })

    $('#checkboxes input[type="checkbox"]').change(function() {
        anyChecked = false;
        $('#checkboxes input[type="checkbox"]').each(function() {
            if (this.checked) {
                anyChecked = true;
            }
            if (anyChecked) {
                composer.show();
                composerAlert.hide();
            } else {
                composer.hide();
                composerAlert.show();
            }
        })
    })
});