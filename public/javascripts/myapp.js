function insertTask(){
  var form = document.createElement('form');
  form.setAttribute('action','/done');
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
  var form = document.createElement('form');
  form.setAttribute('action','/remove');
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
  start: function(count){
    var task = document.getElementById("task");
    timer.setTitle(task.value);
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
