$(function() {
    const dateFormat = 'YYYY-MM-DD HH:mm';
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

    // Show scheduleAtDiv if date is initially checked otherwise hide
    const isScheduleNow = selectedOption.text() == 'Date';
    isScheduleNow ? scheduleAtDiv.show() : scheduleAtDiv.hide();

    // Show scheduleAtDiv if date changes to checked otherwise hide
    selectSchedule.change(function() {
        isDateValue = this.value == 'date'
        isDateValue ? scheduleAtDiv.show() : scheduleAtDiv.hide();
    });
});