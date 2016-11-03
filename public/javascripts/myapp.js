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
