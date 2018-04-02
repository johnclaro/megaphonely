$(function() {
    const dateFormat = 'YYYY-MM-DD HH:mm';
    const today = moment().format(dateFormat);
    const scheduleCustom = $('#id_schedule_2');
    const scheduleAt = $('#id_schedule_at');
    const scheduleAtDiv = $('#div_id_schedule_at');

    const datePopulated = scheduleAt.val();
    let initialDate = moment(datePopulated).format(dateFormat);
    if (today >= initialDate) {
        initialDate = today;
    }

    scheduleAt.datetimepicker({
        icons: {
            time: 'fas fa-clock',
        },
        format: dateFormat,
        minDate: today,
        date: initialDate
    });

    // Show scheduleAtDiv if custom is initially checked otherwise hide
    const isScheduleCustomChecked = scheduleCustom.is(':checked');
    isScheduleCustomChecked ? scheduleAtDiv.show() : scheduleAtDiv.hide();

    // Show scheduleAtDiv if custom changes to checked otherwise hide
    $('input[type=radio][name=schedule]').change(function() {
        isCustomValue = this.value == 'custom'
        isCustomValue ? scheduleAtDiv.show() : scheduleAtDiv.hide();
    });
});