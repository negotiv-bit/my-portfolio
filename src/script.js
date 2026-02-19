document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    if(name.length < 2) {
        alert("Пожалуйста, введите корректное имя");
        return;
    }
    alert("Сообщение успешно отправлено! (Имитация)");
    this.reset();
});