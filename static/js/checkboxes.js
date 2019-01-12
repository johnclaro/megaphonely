function checkbox() {
    const checkboxes = $('#checkboxes');
    const composer = $('#composer');
    const composerAlert = $('#composer-alert');
    const twitterCheckboxAlert = $('#twitter-checkbox-alert');

    let anyChecked;
    let twitterChecked;
    let twitterCheckboxId;

    $('#checkboxes input[type="checkbox"]').each(function() {
        if (this.checked) {
            anyChecked = true;

            if (this.id.indexOf('twitter') >= 0) {
                twitterChecked = true;
                twitterCheckboxId = this.id;
            }
        }

        if (anyChecked) {
            composer.show();
            composerAlert.hide();
        } else {
            composer.hide();
            composerAlert.show();
        }
    })

    // If there is one twitter checkbox checked, then hide all the other twitter checkboxes. 
    if (twitterChecked) {
        $('#checkboxes input[type="checkbox"]').each(function() {
            if (this.id.indexOf('twitter') >= 0 && this.id != twitterCheckboxId) {
                let checkboxId = this.id.split('id_socials_')[1]
                twitterCheckbox = $(`#${checkboxId}`);
                twitterCheckbox.hide();
                twitterCheckboxAlert.show();
            }
        })
    } else {  // If there are not any twitter checkbox checked, then show all other twitter checkboxes.
        $('#checkboxes input[type="checkbox"]').each(function() {
            if (this.id.indexOf('twitter')) {
                let checkboxId = this.id.split('id_socials_')[1]
                twitterCheckbox = $(`#${checkboxId}`);
                twitterCheckbox.show();
                twitterCheckboxAlert.hide();
            }
        })
    }
}

$(function() {
    // Initialise checkboxes
    $('#checkboxes input[type="checkbox"]').ready(function() {
        checkbox();
    })

    // Trigger twitter checkboxes when it changes
    $('#checkboxes input[type="checkbox"]').change(function() {
        checkbox();
    })
});