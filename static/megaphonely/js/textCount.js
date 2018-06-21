$('#id_message').keyup(function () {
    var len = $(this).val().length;
    $('#text_count').text(len);
});

$(function() {
    const messageTextCount = $('#id_message').val();
    $('#text_count').text(messageTextCount.length);
});