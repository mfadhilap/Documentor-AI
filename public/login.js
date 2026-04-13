function showRegister() {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("registerBox").style.display = "block";
}
function showss() {
    let docu = document.getElementsByClassName("Documentor");
    let container = document.getElementsByClassName("container");

    if (docu.length > 0) {
        docu[0].style.display = "none";  
    }

    if (container.length > 0) {
        container[0].style.display = "block"; 
    }
}

function showLogin() {
    document.getElementById("registerBox").style.display = "none";
    document.getElementById("loginBox").style.display = "block";
}

async function login() {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    // alert("Logging in with " + username);
    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    
    if (data.success) {
        window.location.href = "/timeline"; 
    } else {
        alert("Login failed: " + data.error); 
    }
}

async function register() {
    const name = document.getElementById("registerName").value;
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;

    const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password })
    });

    const data = await response.json();

    if (data.success) {
        alert("Registration successful! You can now log in.");
        document.getElementById("registerBox").style.display = "none";
        document.getElementById("loginBox").style.display = "block";
    } else {
        alert("Registration failed: " + data.error);
    }
}