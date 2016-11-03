function start(){
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

$(function() {
  $('#modal-example').on('show.bs.modal', function(event) {
      var count = 20;
      intervalId = setInterval(function(){
        var min = parseInt(count / 60);
        var sec = count % 60;
        var dispStr = ("0"+min).slice(-2) +"：" + ("0"+sec).slice(-2);
        $('#modal-message').text(dispStr);
        count--;
        if ( count < 0 ){
          clearInterval( intervalId );
          start();
        }
      },1000);
  });
});
