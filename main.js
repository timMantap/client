$( document ).ready(function() {
    auth()
})

const hideElement = element => {
    return $(element).hide()
}

const showElement = element => {
    return $(element).show()
}

const hideShowElement = (target, hide, show) => {
    $(target).on('click', (e) => {
        e.preventDefault()
        hideElement(hide)
        showElement(show)
    })
}

function auth() {
    if (localStorage.getItem('token')) {
        hideElement('#signup-container')
        hideElement('#signin-container')
        $( '#page-content-wrapper-food' ).show()
        $( '#navbar' ).show()
    } else {
        $( '#page-content-wrapper-food' ).hide()
        $( '#navbar' ).hide()
        showElement('#signup-container')
        hideElement('#signin-container')
        hideShowElement('#signup-bottom-btn','#signin-container','#signup-container')
        hideShowElement('#signin-bottom-btn','#signup-container','#signin-container')
    }
}

function signOut() {
    localStorage.clear()
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
    auth()
}

$('#signup-btn').click(e => {
    e.preventDefault()
    if($('#email-signup').val() == '' || $('#password-signup').val() == '') {
        return $('.auth')
    }
    $.ajax({
        method:'post',
        url: 'http://localhost:3000/users/register',
        data: {
            email: $('#email-signup').val(),
            password: $('#password-signup').val(),
        }
    })
    .done(result => {
        localStorage.setItem('token', result.token)
        auth()
    })
    .fail(err => {
        console.log(err)
        formnotif(err.responseJSON.errors[0].message)
    })
})

$('#signin-btn').click(e => {
    e.preventDefault()
    $.ajax({
        method:'post',
        url: 'http://localhost:3000/users/login',
        data: {
            email: $('#email-signin').val(),
            password: $('#password-signin').val(),
        }
    })
    .done(result => {
        localStorage.setItem('token', result.token)
        auth()
    })
    .fail(err => {
        console.log(err)
        formnotif(err.responseJSON.errors[0].message)
    })
})

function onSignIn(googleUser) {
    let id_token = googleUser.getAuthResponse().id_token;  
    $.ajax({
        method: 'post',
        url: 'http://localhost:3000/users/googleLogin',
        data: {
            id_token
        }
    })
    .done(result => {
        localStorage.setItem('token', result.token)
        auth()
    })
    .fail(err => {
        console.log(err)
        formnotif(err.responseJSON.errors[0].message)
    })
}


