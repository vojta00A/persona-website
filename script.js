//pozadí úvodní obrazovky

const canvas = document.getElementById("sit-pozadi");
const ctx = canvas.getContext('2d');
const dosah = 150;
const rychlostTecek = 1;
const sila = 0.005;


const mys = {
    x: null,
    y: null,
    dosah: 200
};

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    inicializace();
});


window.addEventListener('mousemove', function(event){
    const rect = canvas.getBoundingClientRect();
    
    mys.x = event.clientX - rect.left;
    mys.y = event.clientY - rect.top;
});

window.addEventListener('mouseout', function(){
    mys.x = null;
    mys.y = null;
});


let poleTecek = [];

class Tecka{
    constructor(){
        //počáteční pozice
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        //rychlost v daném směru
        this.rychlostX = (Math.random() - 0.5) * rychlostTecek;
        this.rychlostY = (Math.random() - 0.5) * rychlostTecek;
        //velikost tečky
        this.velikost = Math.random() * 2 + 1;
    }

    //nakreslení tečky
    nakresli(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.velikost, 0, Math.PI * 2);
        ctx.fillStyle = '#888888';
        ctx.fill();
    }

    aktualizuj(){
        if(this.x > canvas.width || this.x < 0){
            this.rychlostX = -this.rychlostX;
        }
        if(this.y > canvas.height || this.y < 0){
            this.rychlostY = -this.rychlostY;
        }

        if(mys.x != null && mys.y != null){
            let dx = mys.x - this.x;
            let dy = mys.y - this.y;
            let vzdalenost = Math.sqrt(dx * dx + dy * dy);

            if(vzdalenost < mys.dosah){
                this.x -= dx * sila;
                this.y -= dy * sila;
            }
        }

        this.x += this.rychlostX;
        this.y += this.rychlostY;
        
        this.nakresli();
    }
}

function inicializace(){
    poleTecek = [];

    let pocetTecek = (canvas.width * canvas.height) / 9000;
    for(let i = 0; i < pocetTecek; i++){
        poleTecek.push(new Tecka());
    }
}

function animuj(){
    requestAnimationFrame(animuj);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(let i = 0; i < poleTecek.length; i++){
        poleTecek[i].aktualizuj();

        for(let j = i; j < poleTecek.length; j++){
            let dx = poleTecek[i].x - poleTecek[j].x;
            let dy = poleTecek[i].y - poleTecek[j].y;
            let vzdalenost = Math.sqrt(dx * dx + dy * dy);

            if(vzdalenost < dosah){
                ctx.beginPath();
                ctx.strokeStyle = `rgba(136, 136, 136, ${1 - vzdalenost/dosah})`;
                ctx.lineWidth = 1;
                ctx.moveTo(poleTecek[i].x, poleTecek[i].y);
                ctx.lineTo(poleTecek[j].x, poleTecek[j].y);
                ctx.stroke();
            }
        }

        if(mys.x != null && mys.y != null){
            let dxMys = poleTecek[i].x - mys.x;
            let dyMys = poleTecek[i].y - mys.y;
            let vzdalenostMys = Math.sqrt(dxMys * dxMys + dyMys * dyMys);

            if(vzdalenostMys < mys.dosah){
                ctx.beginPath();
                ctx.strokeStyle = `rgba(136, 136, 136, ${1 - vzdalenostMys/mys.dosah})`;
                ctx.lineWidth = 1;
                ctx.moveTo(poleTecek[i].x, poleTecek[i].y);
                ctx.lineTo(mys.x, mys.y);
                ctx.stroke();
            }
        }
    }
}

inicializace();
animuj();

//menu pro telefon

const burger = document.getElementById("burger-menu");
const menuUl = document.querySelector('.menu nav ul');
const menuLinks = document.querySelectorAll('.menu nav ul a');

burger.addEventListener('click', () => {
    menuUl.classList.toggle('active');
});


menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuUl.classList.remove('active');
    });
});


//switch modů

const switchInput = document.getElementById("switch");
const proElem = document.querySelectorAll(".pro");
const realElem = document.querySelectorAll(".real");

switchInput.addEventListener("change", function(){
    if(this.checked){ 
        proElem.forEach(el => el.classList.add("hidden"));
        realElem.forEach(el => el.classList.remove("hidden"));
    } else {
        proElem.forEach(el => el.classList.remove("hidden"));
        realElem.forEach(el => el.classList.add("hidden"));
    }
})

//toast
const form = document.getElementById("contact-form");
const toast = document.getElementById("toast");

form.addEventListener("submit", function(event){

    event.preventDefault();

    if (switchInput.checked){
        toast.innerHTML = "Fakt moc děkuju za zprávu :-("
    }else{
        toast.innerHTML = "Děkuji za zprávu! Brzy se ozvu."
    }

    toast.classList.add("show");
    form.reset();

    setTimeout(function() {
        toast.classList.remove("show");
    }, 3500);
});

