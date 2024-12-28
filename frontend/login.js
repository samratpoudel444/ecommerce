   
   // Login form submission (without AJAX)
    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();
      
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
      
        fetch('http://localhost:3000/login', {  // Your backend login URL
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',  // Inform the server we are sending JSON
          },
          body: JSON.stringify({ email, password })  // Send email and password as JSON
        })
          .then(response => response.json())  // Parse JSON response from the server
          .then(data => {
            if (data.token) {
              localStorage.setItem('jwt', data.token);  // Store the token in localStorage
              console.log('Login successful, token stored');
              window.location.href = '/public/index.html';  // Redirect after successful login
            } else {
              console.error('No token received');
            }
          })
          .catch(error => {
            console.error('Error:', error);
            alert('Login failed');
          });
      });