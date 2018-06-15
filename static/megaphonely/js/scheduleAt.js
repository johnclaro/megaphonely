$(function() {
    const dateFormat = 'YYYY/MM/DD HH:mm';
    const today = moment().format(dateFormat);
    const selectSchedule = $('#id_schedule');
    const selectedOption = $('#id_schedule option:selected');
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
    const isScheduleNow = selectedOption.text() == 'Custom';
    isScheduleNow ? scheduleAtDiv.hide() : scheduleAtDiv.hide();

    // Show scheduleAtDiv if custom changes to checked otherwise hide
    selectSchedule.change(function() {
        isCustomValue = this.value == 'custom'
        isCustomValue ? scheduleAtDiv.show() : scheduleAtDiv.hide();
    });
});