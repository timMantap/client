const baseUrl = `http://localhost:8080`

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
        hideElement('.limiter')
        $( '#mainpage' ).show()
        readMain()
    } else {
        $( '#mainpage' ).hide()
        showElement('.limiter')
        showElement('#signup-container')
        hideElement('#signin-container')
        hideShowElement('#signup-bottom-btn','#signin-container','#signup-container')
        hideShowElement('#signin-bottom-btn','#signup-container','#signin-container')
    }
}

function signOut(e) {
    e.preventDefault()
    localStorage.clear()
    auth()
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
}

$('#signup-btn').click(e => {
    e.preventDefault()
    // if($('#email-signup').val() == '' || $('#password-signup').val() == '') {
    //     return $('.auth')
    // }
    $.ajax({
        method:'post',
        url: 'http://localhost:3000/users/register',
        data: {
            email: $('#email-signup').val(),
            password: $('#password-signup').val()
        }
    })
    .done(result => {
        localStorage.setItem('token', result.token)
        auth()
    })
    .fail(err => {
        console.log(err)
        // formnotif(err.responseJSON.errors[0].message)
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
        $('#email-signin').val('')
        $('#password-signin').val('')
        auth()
    })
    .fail(err => {
        console.log(err)
        formnotif(err.responseJSON.errors[0].message)
        $('#email-signin').val('')
        $('#password-signin').val('')
        auth()
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
    })
}

const readMain = () => {
    $( '#card-container' ).empty()
    $.ajax({
        method: 'GET',
        headers: {
            'token': localStorage.token
        },
        url: `http://localhost:3000/feature`
    })
    .done(data => {
        // console.log(data)
        let appendItems = ''
        data.restaurants.forEach(el => {
            console.log(el)
            appendItems += `<div class="card col-xl-3 m-3 d-flex flex-column align-items-center" id="card" style="width:200px">
              <div class="card-body">
                <img src="${el.thumb}" class="img-fluid" alt="${el.name}">
                  <h4 class="card-title">${el.name}</h4>
                  <p class="card-text">Cuisine: ${el.cuisines}</p>
                  <p class="card-text">Average cost: ${el.avg_cost_for_two}</p>
                  <p class="card-text">Open: ${el.timings}</p>
                  <p class="card-text">${el.address}</a><br><br>
                  <a href="${el.url}" class="btn btn-primary">Visit Place</a>
                </div>
            </div>\n`
        })
        $( '#card-container' ).append(appendItems)
    })
    .fail(err => {
        console.log(err)
        // err.responseJSON.errors.forEach(data => {
        //     console.log(data.message)
        // })
    })
}


