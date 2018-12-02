$(document).ready(() => {
    $('#createTrip').on('cick', )
});

function navigate(page) {
    $.ajax({
        type: 'get',
        url: page,

    });
}

{/* <li><a id="createTrip" href="/createtrip">+NewTrip</a></li>
<li><a id="current" href="/current">CurrentTrip</a></li>
<li><a id="allTrips" href="/alltrips">Trips</a></li>
<li><a id="profile" href="/profile">Profile</a></li>
<li><a id="signOut" href="/">SignOut</a></li>
</ul> */}

      $("#signIn").on("click", function(e){
        e.preventDefault();
        $.ajax(
            {
                type: 'post',
                url: '/api/auth',
                dataType: 'json',
                data: { password: $("#pwdForSignIn").val(), email: $("#emailForSignIn").val() },
                success: function(data){
                    console.log(data.token);
                    localStorage.setItem('token', data.token);
                    location.href = '/alltrips';
                },
                error: function(e){
                    console.log(e.responseText);
                    alert(e.responseText);
                }
            }
      )}

      $("#signedUp").on("click", function(e){
        e.preventDefault();
        $.ajax(
            {
                type: 'post',
                url: '/api/users',
                dataType: 'json',
                data: { username: $("#username").val(), password: $("#pwd").val(), email: $("#email").val(), age: $("#age").val(), gender: $("#gender").val() },
                success: function(data){

                    console.log('Created user at Username: ${data.username} Email: ${data.email}');
                    $("#welcomeMoment").fadeIn(500);
                    $("#signUpMoment").fadeOut();
                },
                error: function(e){
                    console.log(e.responseText);
                    alert(e.responseText);
                }
            }
      )});

