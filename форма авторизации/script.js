const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const clearButton = document.getElementById("clearButton");
const authForm = document.getElementById("authForm");
const loginContainer = document.getElementById("loginContainer");
const clearButtonContainer = document.getElementById("clearButtonContainer");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function drawLine() {
    const x1 = Math.random() * canvas.width;
    const y1 = Math.random() * canvas.height;
    const x2 = Math.random() * canvas.width;
    const y2 = Math.random() * canvas.height;
    const color = getRandomColor();

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
}

const drawingInterval = setInterval(drawLine, 100);

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

clearButton.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    if (username === "1" && password === "1") {
    
        loginContainer.style.display = "none";
    
        clearButtonContainer.style.display = "block";
        canvas.style.display = "block";
    } else {
        alert("Неправильный логин или пароль. Попробуйте еще раз.");
    }
});
