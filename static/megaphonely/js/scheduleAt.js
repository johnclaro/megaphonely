$(function() {
    const selectSchedule = $('#id_schedule');
    const selectedOption = $('#id_schedule option:selected');
    const scheduleAtDiv = $('#div_id_schedule_at');
    const scheduleTimeAtDiv = $('#div_id_schedule_time_at');
    const scheduleAt = $('#id_schedule_at');
    const scheduleTimeAt = $('#id_schedule_time_at');
    const dateFormat = "YYYY-MM-DD"
    const datePopulated = scheduleAt.val();
    const initialTime = scheduleTimeAt.val();
    const today = new Date();
    const subscriptionEndsAt = new Date(userCustomerSubscriptionEndsAt);
    const times = [
        '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', 
        '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30',
        '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', 
        '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', 
        '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
        '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
    ]

    let initialDate = moment(datePopulated).format(dateFormat);
    if (today >= initialDate) {
        initialDate = today;
    }


    // Initialise time picker with the default time
    const currentIndex = times.indexOf(initialTime);
    const remainingTimes = times.slice(currentIndex, times.length);
    for (remainingTime in remainingTimes) {
        const time = `<option>${remainingTimes[remainingTime]}</option>`;
        scheduleTimeAt.append(time);
    }

    $("#id_schedule_at").flatpickr({
        defaultDate: initialDate,
        minDate: "today",
        maxDate: subscriptionEndsAt,
        disableMobile: true,
        onChange: (dateObj, dateStr) => {
            scheduleTimeAt.empty();
            if (dateStr == initialDate) {
                const currentIndex = times.indexOf(initialTime);
                const remainingTimes = times.slice(currentIndex, times.length);
                for (remainingTime in remainingTimes) {
                    const time = `<option>${remainingTimes[remainingTime]}</option>`;
                    scheduleTimeAt.append(time);
                }
            } else {
                // Resets the whole time picker
                for (time in times) {
                    const newTime = `<option>${times[time]}</option>`;
                    scheduleTimeAt.append(newTime);
                }
            }
        }
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