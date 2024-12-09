document.getElementById('verifyBtn').addEventListener('click', async () => {
	const fileInput = document.getElementById('proofFile');
	const resultDiv = document.getElementById('result');

	if (fileInput.files.length === 0) {
		alert('Please upload a proof file!');
		return;
	}

	const file = fileInput.files[0];
	const reader = new FileReader();

	reader.onload = async function() {
		try {
			const proofData = JSON.parse(reader.result);
			const response = await fetch('/verify-proof', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					proof: proofData,
					publicInputs: [] // Add public inputs here if necessary
				})
			});
			const result = await response.json();
			console.log(result);
			resultDiv.classList.remove('hidden');
			if (result.valid) {
				resultDiv.textContent = 'Proof is valid!';
				resultDiv.classList.add('valid');
				resultDiv.classList.remove('invalid');
			} else {
				resultDiv.textContent = 'Proof is invalid!';
				resultDiv.classList.add('invalid');
				resultDiv.classList.remove('valid');
			}
		} catch (error) {
			alert('Error verifying proof: ' + error.message);
		}
	};

	reader.readAsText(file);
});
