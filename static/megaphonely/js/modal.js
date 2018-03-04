$('#paymentModal').on('show.bs.modal', function (event) {
    const button = $(event.relatedTarget)
    const plan = button.data('plan')
    const modal = $(this)
    modal.find('.modal-title').text(`Upgrading to ${plan.capitalize()}`)
})

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
