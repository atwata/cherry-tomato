function insertTask(){
  var form = document.createElement('form');
  form.setAttribute('action','add');
  form.setAttribute('method','post');
  document.body.appendChild(form);
  var input = document.createElement('input');
  var task = document.getElementById("task");
  input.setAttribute('type', 'hidden');
  input.setAttribute('name', 'task');
  input.setAttribute('value',task.value);
  form.appendChild(input);
  form.submit();
}

function deleteTask(id){
  if(confirm("本当に削除しますか？") == false) {
    return false;
  }
  var form = document.createElement('form');
  form.setAttribute('action','remove');
  form.setAttribute('method','post');
  document.body.appendChild(form);
  var input = document.createElement('input');
  input.setAttribute('type', 'hidden');
  input.setAttribute('name', 'id');
  input.setAttribute('value',id);
  form.appendChild(input);
  form.submit();
}


var timer = {
  setTitle: function(title){
    $('#modal-title').text(title);
  },
  setImg: function(img){
    $('#modal-img').attr("src", img);
  },
  start: function(count){
    var task = document.getElementById("task");
    timer.setTitle(task.value);
    timer.setImg('images/honoo_hi_fire.png');
    intervalId = setInterval(function(){
      var min = parseInt(count / 60);
      var sec = count % 60;
      var dispStr = ("0"+min).slice(-2) +"：" + ("0"+sec).slice(-2);
      $('#modal-message').text(dispStr);
      count--;
      if ( count < 0 ){
        clearInterval( intervalId );
        timer.rest(300);
      }
    },1000);
  },
  rest: function(count){
    timer.setTitle('Interval');
    timer.setImg('images/drink_chabashira.png');
    intervalId = setInterval(function(){
      var min = parseInt(count / 60);
      var sec = count % 60;
      var dispStr = ("0"+min).slice(-2) +"：" + ("0"+sec).slice(-2);
      $('#modal-message').text(dispStr);
      count--;
      if ( count < 0 ){
        clearInterval( intervalId );
        insertTask();
      }
    },1000);
  }
}

$(function() {

  $('#modal-example').on('show.bs.modal', function(event) {
//    timer.count = 1500; //25min
    timer.start(1500)
//    timer.count = 300; //5min
//    timer.start()
//    start();
  });

  $('#modal-example').on('hide.bs.modal', function(event) {
      clearInterval( intervalId );
  });

});

function startAgain(taskValue){
  var task = document.getElementById("task");
  task.value = taskValue;
  $('#modal-button').click();
}

// tab
$(function() {
  $('#tabs a[href^="#panel"]').on('click', function(){
    $("#tabs .panel").hide();
    $("#tabs .active").removeClass('active');
    $(this.hash).fadeIn();
    $(this).parent().addClass('active');
    return false;
  });
  $('#tabs a[href^="#panel"]:eq(0)').trigger('click');
});

// Google OAuth
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
    window.location.href = "http://app.atwata.com/cherry-tomato/done";
  });
}

function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://app.atwata.com/cherry-tomato/tokensignin');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    console.log('Signed in as: ' + xhr.responseText);
    window.location.href = "http://app.atwata.com/cherry-tomato/done";
  };
  xhr.send('idtoken=' + id_token);
}

function onSignIn2(googleUser){
  var id_token = googleUser.getAuthResponse().id_token;
  var form = document.createElement('form');
  form.setAttribute('action','tokensignin');
  form.setAttribute('method','post');
  document.body.appendChild(form);
  var input = document.createElement('input');
  input.setAttribute('type', 'hidden');
  input.setAttribute('name', 'idtoken');
  input.setAttribute('value',idtoken);
  form.appendChild(input);
  form.submit();
}



