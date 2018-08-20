
var taskCards = [];
var fullDayNames = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
var fullMonthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
$(function(){
  $('#input-form').submit(function(event){
    event.preventDefault();
    var userTask = $('#task-description').val()
    var userDueTime = new Date($('#task-due').val())
    var priorityOption = $('#priority-select').val();
    var newTask = new Task(userTask,userDueTime, priorityOption)
  });
});
var timeUpdate = setInterval(function(){
  taskCards.forEach(function(card,i){
    var timeLeftMS = card.timeLeft()
    $('#due-date-'+i).text(timeLeftMS)
  })
},1000)
function Task(description,dueTime,priority) {
  this.description = description;
  this.dueTime = dueTime;
  this.priority = priority;
  this.div = undefined
  taskCards.push(this)
  this.createCard()
}
Task.prototype.timeLeft = function() {
  return msToTime(this.dueTime - Date.now())
}
Task.prototype.createCard = function() {
  var index = taskCards.length-1;
  var checkbox = `<button id="done-button-`+index+`" type="button" class="btn btn-success done-button">Done!</button>`;

  $('#display-area').append(
    `<div id="task-card-`+index+`" class="card task-card">
      <div class="card-body ` + this.priority + `Pri"><div class="row"><div class="col">` + this.description + `</div><div class="col">` + prettyDate(this.dueTime) + `</div><div class="col"><div id="due-date-`+index+`">`+this.timeLeft()+`</div></div><div class="col">` + checkbox + `</div></div></div>`
    );
  $('#done-button-'+index).click(function () {

    $(`#task-card-`+index).animate({
      'height': 0,
      'opacity': 0
    },500)
  setTimeout(function() {
    $('#task-card-'+index).remove();
  },500);
  this.div = $(`#task-card-`+index)
  });
}
function msToTime(duration) {
    var seconds = parseInt((duration/1000)%60)
    var minutes = parseInt((duration/(1000*60))%60)
    var hours = parseInt(duration/(1000*60*60));
    var days = Math.floor(hours/24)
    hours = hours%24;
    days = (days === 0) ? days = "" : days;
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return days + " days, " + hours + ":" + minutes + ":" + seconds
}
function prettyDate(dateObj) {
    var result = "";
    var monthName = fullMonthNames[dateObj.getMonth()];
    var dayName = fullDayNames[dateObj.getDay()];
    var hour = dateObj.getHours()
    var minute = dateObj.getMinutes()
    result = dayName + ", " + monthName + " " + dateObj.getDate() + " " + dateObj.getFullYear() + " by " + standardTime(hour,minute);
    return result
}
function standardTime(hour,min) {
    var newHour = hour
    var newMin = min
    var ampm = "AM"
    if (hour === 0) {
      newHour = "12"
    } else if (hour===12) {
      ampm = "PM"
    } else if (hour > 12) {
      newHour = hour-12
      ampm = "PM"
    }
    if (min < 10) {
      newMin = "0" + min
    }
    return newHour+":"+newMin+" "+ampm
}
