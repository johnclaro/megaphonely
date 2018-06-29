$(function() {
    const selectSchedule = $('#id_schedule');
    const selectedOption = $('#id_schedule option:selected');
    const scheduleAtDiv = $('#div_id_schedule_at');
    const dateFormat = "F j, Y H:i"
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
        enableTime: true,
        time_24hr: true,
        minuteIncrement: 30,
        disableMobile: true
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