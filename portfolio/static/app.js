let form = document.getElementById('form');
let formSubmitBtn = document.getElementById('form-submit');
let formName = document.getElementById('form-name');
let formEmail = document.getElementById('form-email');
let formMessage = document.getElementById('form-message');
let rechaptcha = false;
let resendMessage = true;


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

const showPassword = document.querySelector('.show-password');
if (showPassword) {
    showPassword.addEventListener('click', () => {
        const passwordInput = document.querySelector('#password-input');
        if (passwordInput.type == 'password') {
            passwordInput.type = 'text';
            showPassword.classList.remove('fa-eye')
            showPassword.classList.add('fa-eye-slash')
        } else {
            passwordInput.type = 'password'
            showPassword.classList.remove('fa-eye-slash')
            showPassword.classList.add('fa-eye')
        }
    })
}

function RecaptchaCallback() {
    rechaptcha = true;
}

if (formName) {
    formName.addEventListener("change", () => {
        document.getElementById('recaptcha').style.display = 'block';
    })
}

if (formSubmitBtn && resendMessage) {
    formSubmitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        resendMessage = false;

        if (!rechaptcha) {
            document.getElementById('recaptcha').style.display = 'block';
            document.getElementById('recaptcha-error').innerHTML = `<small class="error-text"><i class="fa fa-exclamation-triangle"></i> Oops, you have to check the recaptcha !</small>`;
            resendMessage = true;
        } else {
            document.getElementById('recaptcha-error').innerHTML = ``;
            // Build formData object.
            let formData = new FormData();
            formData.append('name', formName.value);
            formData.append('email', formEmail.value);
            formData.append('message', formMessage.value);
            formData.append('rechaptcha', rechaptcha);
    
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
                        resendMessage = false;
                        document.getElementById('modal-toggle').click();
                        grecaptcha.reset();
                        document.getElementById('recaptcha').style.display = 'none';
                    } else {
                        resendMessage = true;
                        if (data.errors.name) {
                            changeToF(formName);
                            document.getElementById('name-error').innerHTML = `<small class="error-text"><i class="fa fa-exclamation-triangle"></i> ${data.errors.name}</small>`
                        } else {
                            changeToS(formName);
                            document.getElementById('name-error').innerHTML = '';
                        }
    
                        if (data.errors.email) {
                            changeToF(formEmail);
                            document.getElementById('email-error').innerHTML = `<small class="error-text"><i class="fa fa-exclamation-triangle"></i> ${data.errors.email}</small>`
                        } else {
                            changeToS(formEmail);
                            document.getElementById('email-error').innerHTML = '';
                        }
                        if (data.errors.message) {
                            changeToF(formMessage);
                            document.getElementById('message-error').innerHTML = `<small class="error-text"><i class="fa fa-exclamation-triangle"></i> ${data.errors.message}</small>`
                        } else {
                            changeToS(formMessage);
                            document.getElementById('message-error').innerHTML = '';
                        }
                    }
                });

        }

    })
}


function truncateString(str, num) {
    if (str.length > num) {
        return str.slice(0, num) + "...";
    } else {
        return str;
    }
}

const searchBtn = document.querySelector('#search-btn');

if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // document.getElementById('search-form').submit();
        searchText = document.getElementById('search-input');
        if (searchText.value.length != 0) {
            // Build formData object.
            let formData = new FormData();
            formData.append('searchText', searchText.value);
    
            fetch("/search/",
                {
                    body: formData,
                    method: "post",
                    credentials: 'same-origin',
                    headers: {
                        "X-CSRFToken": csrftoken
                    }
                }).then(response => response.json())
                .then(data => {
                    projectsContainer = document.getElementById('projectsContainer');
                    if (data.success == true) {
                        projectsContainer.innerHTML = '';
                        data.projects.forEach(project => {
                            projectsContainer.innerHTML += `
                            <div class="col-lg-4 mb-4">
                                <div class="card-loader card-loader--tabs"></div>
                            </div>
                            `;
                        });

                        setTimeout(() => {
                            projectsContainer.innerHTML = '';
                            data.projects.forEach(project => {
                                projectsContainer.innerHTML += `
                                <div class="col-lg-4 mb-4 ">
                                    <a href="${project.url}">
                                        <div class="card project-card mirror-face">
                                            <div class="project-card-img">
                                                <img src="${project.image_url}">
                                            </div>
                                            <div class="card-body pt-0">
                                                <h1 class="project-card-title">${truncateString(project.title, 22)}</h1>
                                                <p class="project-card-disc">${truncateString(project.description, 100)}</p>
                                            </div>
                                        </div>
                                        </a>
                                </div>
                                `;
                            });
                            projectsContainer.innerHTML += `
                            <div class="col-12 my-4 text-center">
                                <div class="back-to-projects">
                                    <a href="/projects">Back to Projects</a>
                                </div>
                            </div>
                            `;
                        }, 2000);
                    } else {
                        projectsContainer.classList.add('justify-content-center')
                        projectsContainer.innerHTML = `
                            <div class="col-lg-4 text-center s-color">
                                <p>There are no projects with the name '<strong class="color-primary">${data.searchText}</strong>'</p>
                                <div class="back-to-projects">
                                    <a href="/projects">Back to Projects</a>
                                </div>
                            </div>
                            `;
                    }
                })
        }
    })
}