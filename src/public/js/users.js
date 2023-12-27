const updateUserRole = async (uid) => {
	const row = document.getElementById(uid);
	const newRole = row.cells[2].querySelector("input").value;
	const response = await fetch(`/api/users/premium/${uid}`, {
		method: 'PUT',
		body: JSON.stringify({
			newRole
		}),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	const data = await response.json();

	if (response.ok) {
		console.log('User role update successfully');
	} else {
		if (data.error.includes('You are missing the following documents')) {
			const documentsError = data.error.replace('You are missing the following documents: ', '');
			console.error(`You are missing the following documents: ${documentsError}`);
		} else {
			console.error(`${data.error}`);
		}
	}
};

const deleteUser = async (userId) => {
	const response = await fetch(`/api/users/${userId}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		}
	});

	const data = await response.json()
	console.log(response.ok)
	if (response.ok) {
		console.log('User deleted successfully');
	} else {
		console.error(`An error occurred while deleting the user: ${data.error || 'Unknown error'}`);
	}
}

const deleteInactiveUsers = async () => {
	const response = await fetch('/api/users/', {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	const data = await response.json()

	if (response.ok) {
		console.log('Users deleted successfully');
	} else {
		console.error(`An error occurred while deleting the users: ${data.error || 'Unknown error'}`);
	}
}

const uploadDocuments = async (uid) => {
	const fileInput = document.getElementById(`documents-${uid}`);
	const files = fileInput.files;
	const formData = new FormData();

	for (let i = 0; i < files.length; i++) {
		formData.append('documents', files[i]);
	}

	try {
		const response = await fetch(`api/users/${uid}/documents`, {
			method: 'POST',
			body: formData,
		});

		const data = await response.json();

		if (response.ok) {
			console.log('Document uploaded successfully');
		} else {
			console.error(`An error occurred while uploading documents: ${data.error || 'Unknown error'}`);
		}
	} catch (error) {
		console.error('An unexpected error occurred');
	}
};
