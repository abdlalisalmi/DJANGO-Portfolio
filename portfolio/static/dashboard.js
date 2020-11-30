// edit profile code
var saveProfileEdit = document.querySelector('#save-profile-edit');
if (saveProfileEdit) {
	saveProfileEdit.addEventListener('click', (e) => {
		e.preventDefault();
        // Build formData object.
        let formData = new FormData();
        formData.append('full_name', document.querySelector('#full_name').value);
        formData.append('bio', document.querySelector('#bio').value);
		formData.append('about', document.querySelector('#about').value);
		formData.append('email', document.querySelector('#email').value);
		formData.append('github', document.querySelector('#github').value);
		formData.append('facebook', document.querySelector('#facebook').value);
		formData.append('twitter', document.querySelector('#twitter').value);
		formData.append('phone', document.querySelector('#phone').value);
		
		fetch('/dashboard/profile/edit/', {
			body: formData,
			method: "post",
			credentials: 'same-origin',
			headers: {
				"X-CSRFToken": csrftoken
			}
		})
		.then(response => response.json())
		.then(data => console.log(data));
	});
}











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