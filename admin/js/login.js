function login()
{
    var pass = document.getElementById("pass").value;
    var user = document.getElementById("User").value;
    
    if(user == "admin" && pass == "123")
    {
        window.location.replace("/admin_all");
        document.getElementById('sidenav').className ='sidenav2';
    }
    else
    {
        alert("Usuario/Contraseña inválidos");
        window.location.replace("/admin");
    }
}

function ani()
{
    document.getElementById('sidenav').className ='sidenav2';
    document.getElementById('main').className ='main2';
}