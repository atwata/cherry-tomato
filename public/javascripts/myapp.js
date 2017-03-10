// デスクトップ通知の表示
function showNotification(){
    var Notification = window.Notification || window.mozNotification || window.webkitNotification;
 
    // Notificationの権限チェック
    Notification.requestPermission(function (permission) {
        console.log(permission);
    });
    var instance = new Notification(
        "cherry tomato", 
        {
            body: "お疲れ様でした！\n作業終了の時間です！",
            icon: "images/honoo_hi_fire.png"
        }
    );
}

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


// timerオブジェクト
var timer = {
  setTitle: function(title){
    $('#modal-timer-title').text(title);
  },
  setImg: function(img){
    $('#modal-img').attr("src", img);
  },
  start: function(smin, rmin){
    var scount = smin * 60;
    var rcount = rmin * 60;
    console.log(scount);
    var task = document.getElementById("task");
    timer.setTitle(task.value);
    timer.setImg('images/honoo_hi_fire.png');

    intervalId = setInterval(function(){
      var min = parseInt(scount / 60);
      var sec = scount % 60;
      var dispStr = ("0"+min).slice(-2) +"：" + ("0"+sec).slice(-2);
      $('#modal-message').text(dispStr);
      scount--;
      // 作業タイマー終了
      if ( scount < 0 ){
        // timer終了、通知、休憩timer開始
        clearInterval( intervalId );
        showNotification();
        timer.rest(rcount);
      }
    },1000);
  },
  rest: function(rcount){
    timer.setTitle('Interval');
    timer.setImg('images/drink_chabashira.png');
    $('#modal-img').jrumble();
    $('#modal-img').trigger('startRumble');

    intervalId = setInterval(function(){
      var min = parseInt(rcount / 60);
      var sec = rcount % 60;
      var dispStr = ("0"+min).slice(-2) +"：" + ("0"+sec).slice(-2);
      $('#modal-message').text(dispStr);
      rcount--;
      if ( rcount < 0 ){
        clearInterval( intervalId );
        insertTask();
      }
    },1000);
  }
}

$(function() {

  $('#modal-timer').on('show.bs.modal', function(event) {
    var button = $(event.relatedTarget);
    var pomodoro = button.data('pomodoro');
    var breaktime = button.data('breaktime');
    timer.start(pomodoro, breaktime);
  });

  $('#modal-timer').on('hide.bs.modal', function(event) {
    clearInterval( intervalId );
  });

  $('#modal-options').on('hide.bs.modal', function(event) {
    location.reload(true);
  });

  $("#task").keydown(function() {
    if( event.keyCode == 13 ) {
      $("#modal-button").click();
    }
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
    window.location.href = "http://app.atwata.com/cherry-tomato/";
  });
}

function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://app.atwata.com/cherry-tomato/tokensignin');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    console.log('Signed in as: ' + xhr.responseText);
    window.location.href = "http://app.atwata.com/cherry-tomato/";
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

function saveOptions() {
  console.log("saveOptions called");
  var pomodoro = document.getElementById("pomodoro").value;
  var shortbreak = document.getElementById("shortbreak").value;
  var longbreak = document.getElementById("longbreak").value;
  var perround = document.getElementById("perround").value;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://app.atwata.com/cherry-tomato/saveoptions');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    console.log('save options ' + xhr.responseText);
//    window.location.href = "http://app.atwata.com/cherry-tomato/";
  };
  xhr.send('pomodoro=' + pomodoro + '&shortbreak=' + shortbreak + '&longbreak=' + longbreak + '&perround=' + perround);
}



