// edit profile code
var saveProfileEdit = document.querySelector('#save-profile-edit');
if (saveProfileEdit) {
	saveProfileEdit.addEventListener('click', (e) => {
		e.preventDefault();
        // Build formData object.
        let formData = new FormData();
        formData.append('name_complete', document.querySelector('#full_name').value);
        formData.append('mini_about', document.querySelector('#mini-about').value);
		formData.append('about', document.querySelector('#about').value);
		formData.append('email', document.querySelector('#email').value);
		formData.append('github', document.querySelector('#github').value);
		formData.append('linkedin', document.querySelector('#linkedin').value);
		formData.append('facebook', document.querySelector('#facebook').value);
		formData.append('instagram', document.querySelector('#instagram').value);
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
		.then(data => {
			console.log(data)
			if (data.success == true) {
				document.querySelector('#change-success').click();
				setTimeout(() => {  location.reload(); }, 3000);
			} else {
				document.querySelector('#form-errors').innerHTML = "* Something's wrong, please check your information!";
			}
		});
	});
}
// edit profile picture
const profilePic = document.querySelector('#profile-pic');
if (profilePic) {
    profilePic.addEventListener('change', () => {
        if (profilePic.length != 0) {
            document.querySelector('#profile-form').submit();
        }
    })
}

///////////////////////// messages page ////////////////////////////
// remove message
const deleteMessageBtns = document.querySelectorAll('.delete-message');
if (deleteMessageBtns) {
	deleteMessageBtns.forEach(messageBtn => {
		messageBtn.addEventListener('click', (e) => {
			e.preventDefault();
			let ID = messageBtn.attributes.id.value.split('-')[1]
			// Build formData object.
			let formData = new FormData();
			formData.append('message_id', ID);
			formData.append('option_type', "delete");
			
			fetch('/dashboard/messages/api/', {
				body: formData,
				method: "post",
				credentials: 'same-origin',
				headers: {
					"X-CSRFToken": csrftoken
				}
			})
			.then(response => response.json())
			.then(data => {
				if (data.status == "success") {
					document.querySelector('#row-'+ID).style.display = 'none';
				}
			});
		})
	})
}

// set the message as read
const viewMessage = document.querySelectorAll('.view-message');
if (viewMessage) {
	viewMessage.forEach(view => {
		view.addEventListener('click', (e) => {
			e.preventDefault();
			let ID = view.attributes.id.value.split('-')[1]
			// Build formData object.
			let formData = new FormData();
			formData.append('message_id', ID);
			formData.append('option_type', "view");
			
			fetch('/dashboard/messages/api/', {
				body: formData,
				method: "post",
				credentials: 'same-origin',
				headers: {
					"X-CSRFToken": csrftoken
				}
			})
			.then(response => response.json())
			.then(data => {
				if (data.status == "success") {
					document.querySelector('#view-'+ID).parentElement.classList.remove('new-message')
				}
			});
		})
	})
}

// search for messages
const messageSearchBtn = document.querySelector('#search-btn');
if (messageSearchBtn) {
	messageSearchBtn.addEventListener('click', (e) => {
		e.preventDefault();
		// Build formData object.
		input = document.querySelector('#search-input').value;
		let formData = new FormData();
		formData.append('search_text', input);
		formData.append('option_type', "search");
		
		fetch('/dashboard/messages/api/', {
			body: formData,
			method: "post",
			credentials: 'same-origin',
			headers: {
				"X-CSRFToken": csrftoken
			}
		})
		.then(response => response.json())
		.then(data => {
			if (data.status == "success") {
				console.log(data.messages);
			}
		});
	})
}
///////////////////////// end messages page /////////////////////////



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