$('#id_message').keyup(function () {
    var len = $(this).val().length;
    $('#text_count').text(len);
});

$(function() {
    const message = $('#id_message');
    if (message[0]) {
        const messageTextCount = message.val();
        $('#text_count').text(messageTextCount.length);
    }
});