$(function() {
    const selectSchedule = $('#id_schedule');
    const selectedOption = $('#id_schedule option:selected');
    const scheduleAtDiv = $('#div_id_schedule_at');
    const scheduleTimeAtDiv = $('#div_id_schedule_time_at');
    const dateFormat = "YYYY-MM-DD"
    const scheduleAt = $('#id_schedule_at');
    const today = new Date();
    const subscriptionEndsAt = new Date(userCustomerSubscriptionEndsAt);
    const datePopulated = scheduleAt.val();

    let initialDate = moment(datePopulated).format(dateFormat);
    if (today >= initialDate) {
        initialDate = today;
    }

    $("#id_schedule_at").flatpickr({
        defaultDate: datePopulated,
        minDate: "today",
        maxDate: subscriptionEndsAt,
    });

    // Show scheduleAtDiv if date is initially checked otherwise hide
    const isScheduleNow = selectedOption.text() == 'Date';
    isScheduleNow ? scheduleAtDiv.show() : scheduleAtDiv.hide();
    if (isScheduleNow) {
        scheduleAtDiv.show();
        scheduleTimeAtDiv.show();
    } else {
        scheduleAtDiv.hide();
        scheduleTimeAtDiv.hide();
    }

    // Show scheduleAtDiv if date changes to checked otherwise hide
    selectSchedule.change(function() {
        isDateValue = this.value == 'date'
        if (isDateValue) {
            scheduleAtDiv.show();
            scheduleTimeAtDiv.show();
        } else {
            scheduleAtDiv.hide();
            scheduleTimeAtDiv.hide();
        }
    });
});