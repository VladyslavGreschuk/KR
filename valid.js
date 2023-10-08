document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('name');
    const errorMessage = document.getElementById('name-error');
    const submitButton = document.querySelector('.but1');

    const passError = document.getElementById('pass-error');
    const passError2 = document.getElementById('pass2-error');
    const passwordInput = document.getElementById('password');
    const password2Input = document.getElementById('password2');

    nameInput.addEventListener('input', function() {
        const inputValue = this.value;
        const cyrillicPattern = /[а-яА-ЯёЁ]/;
        const nameLength = inputValue.length;
        if (cyrillicPattern.test(inputValue)) {
            errorMessage.textContent = 'Використовуйте англійські літери!';
            nameInput.classList.add('error');
            submitButton.disabled = true;
        } else if (nameLength < 4 || nameLength > 15)
        {
            errorMessage.textContent = 'Ім\'я повинно містити від 4 до 15 символів!';
            nameInput.classList.add('error');
            submitButton.disabled = true;
        } else
        {
            errorMessage.textContent = '';
            nameInput.classList.remove('error');
            submitButton.disabled = false;
        }
    });

    passwordInput.addEventListener('input', checkPasswords);
    password2Input.addEventListener('input', checkPasswords);

    function checkPasswords() {
        const passwordValue = passwordInput.value;
        const password2Value = password2Input.value;
        const passLength = passwordValue.length;

        if (passLength < 4 || passLength > 25)
        {
            passError.textContent = 'Пароль надто короткий!';
            nameInput.classList.add('error');
            submitButton.disabled = true;
        } else if (passwordValue !== password2Value)
        {
            passError2.textContent = 'Паролі не співпадають!';
            passError.textContent = '';
            passwordInput.classList.add('error');
            password2Input.classList.add('error');
            submitButton.disabled = true;
        } else
        {
            passError.textContent = '';
            passError2.textContent = '';
            passwordInput.classList.remove('error');
            password2Input.classList.remove('error');
            submitButton.disabled = false;
        }
    }
});