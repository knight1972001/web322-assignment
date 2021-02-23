function all(){
    Login();
    document.querySelector('#Register').onclick = Register;
    document.querySelector('#Login').onclick = Login;
}

function Register(){
    document.querySelector('#Register').style.color='white';
    document.querySelector('#Register').style.backgroundColor = '#0b4652';
    document.querySelector('#Login').style.color='#0b4652';
    document.querySelector('#Login').style.backgroundColor = 'rgb(0,0,0,0)';
    var divForm = document.querySelector("#form");
    divForm.innerHTML='';
    divForm.innerHTML="<form>\n            <label for=\"email\">Email:<\/label><br>\n            <input type=\"email\" id=\"email\" name=\"email\"><br>\n            <label for=\"username\">Username:<\/label><br>\n            <input type=\"text\" id=\"username\" name=\"username\"><br>\n            <label for=\"pwd\">Password:<\/label><br>\n            <input type=\"password\" id=\"pwd\" name=\"pwd\"><br>\n            <input onclick='registedButton()' type=\"button\" value=\"Submit!\">\n        <\/form>";
}

function Login(){
    document.querySelector('#Login').style.color='white';
    document.querySelector('#Login').style.backgroundColor = '#0b4652';
    document.querySelector('#Register').style.color='#0b4652';
    document.querySelector('#Register').style.backgroundColor = 'rgb(0,0,0,0)';
    var divForm = document.querySelector("#form");
    divForm.innerHTML='';
    divForm.innerHTML="<form>\n            <label for=\"username\">Username:<\/label><br>\n            <input type=\"text\" id=\"username\" name=\"username\"><br>\n            <label for=\"pwd\">Password:<\/label><br>\n            <input type=\"password\" id=\"pwd\" name=\"pwd\"><br>\n            <input onclick='loginButton()' type=\"button\" value=\"Submit!\">\n<\/form>";
}

function loginButton(){
    alert('Login!!')
    Login();
}

function registedButton(){
    alert('Registed!');
    Register();
}