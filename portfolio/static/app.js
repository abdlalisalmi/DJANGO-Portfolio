let form = document.getElementById('form');
let formSubmitBtn = document.getElementById('form-submit');
let formName = document.getElementById('form-name');
let formEmail = document.getElementById('form-email');
let formMessage = document.getElementById('form-message');


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');


formSubmitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Build formData object.
    let formData = new FormData();
    formData.append('name', formName.value);
    formData.append('email', formEmail.value);
    formData.append('message', formMessage.value);

    fetch("/",
        {
            body: formData,
            method: "post",
            credentials: 'same-origin',
            headers: {
                "X-CSRFToken": csrftoken
            }
        }).then(response => response.json())
        .then(data => {
            function changeToF(element) {
                if (element.parentElement.classList.contains('has-success')) {
                    element.parentElement.classList.remove('has-success');
                    element.parentElement.classList.add('has-danger');
                } else {
                    element.parentElement.classList.add('has-danger');
                }
            }
            function changeToS(element) {
                if (element.parentElement.classList.contains('has-danger')) {
                    element.parentElement.classList.remove('has-danger');
                    element.parentElement.classList.add('has-success');
                } else {
                    element.parentElement.classList.add('has-success');
                }
            }
            function clearInputs() {
                formName.parentElement.classList.remove('has-danger');
                formEmail.parentElement.classList.remove('has-danger');
                formMessage.parentElement.classList.remove('has-danger');
                formName.parentElement.classList.remove('has-success');
                formEmail.parentElement.classList.remove('has-success');
                formMessage.parentElement.classList.remove('has-success');
                document.getElementById('name-error').innerHTML = '';
                document.getElementById('email-error').innerHTML = '';
                document.getElementById('message-error').innerHTML = '';
            }

            if (data.success) {
                formName.value = '';
                formEmail.value = '';
                formMessage.value = '';
                clearInputs();
                document.getElementById('modal-toggle').click();
            } else {
                if (data.errors.name) {
                    changeToF(formName);
                    document.getElementById('name-error').innerHTML = `<small class="text-danger">${data.errors.name}</small>`
                } else {
                    changeToS(formName);
                    document.getElementById('name-error').innerHTML = '';
                }

                if (data.errors.email) {
                    changeToF(formEmail);
                    document.getElementById('email-error').innerHTML = `<small class="text-danger">${data.errors.email}</small>`
                } else {
                    changeToS(formEmail);
                    document.getElementById('email-error').innerHTML = '';
                }
                if (data.errors.message) {
                    changeToF(formMessage);
                    document.getElementById('message-error').innerHTML = `<small class="text-danger">${data.errors.message}</small>`
                } else {
                    changeToS(formMessage);
                    document.getElementById('message-error').innerHTML = '';
                }
            }
        });
})