
var taskCards = [];
var activeCards = [];
var overdueCards = [];
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
var timeUpdateLoop = setInterval(function(){
  activeCards.forEach(function(card,i){
    var timeLeft = card.timeLeft()
    var timeLeftMS = parseInt(card.dueTime - Date.now())
    console.log("this.dueTime " + card.dueTime)
    console.log("Date.now() " + Date.now())
    console.log(timeLeftMS)
    if (timeLeftMS <= 0 && !card.throbbing) {
      $('#task-card-'+card.index+'>.card-body').css({
        'background-color' : 'green'
      })
      console.log("turning card " + i + " green!")
      var amountOverdue = Math.abs(timeLeftMS)
      console.log("overdue by " + amountOverdue)
      $('#due-date-'+card.index).text("OVERDUE by " + msToTime(amountOverdue))
      // activeCards.splice(i,1)
      overdueCards.push(card)
      card.throbbing = setInterval(function(){
        card.throb(1.01);
      },300)
    } else {
      $('#due-date-'+i).text(timeLeft)
    }
  })
},1000)

// var throbLoop = setInterval(function(){
  // overdueCards.forEach(function(card,i){
  //   if (!card.throbbing) {
  //     if (i % 2 === 0) {
  //       card.throbbing = true
  //       setTimeout(function(){
  //         card.throb(1.01);
  //       },300)
  //     } else {
  //       card.throb(1.01);
  //     }
  //   }
  // })
// },2000)

function Task(description,dueTime,priority) {
  this.description = description;
  this.dueTime = dueTime;
  this.priority = priority;
  this.div = undefined
  this.index = taskCards.length;
  this.throbbing = false;
  taskCards.push(this)
  activeCards.push(this)
  this.createCard()
}
Task.prototype.timeLeft = function() {
  return msToTime(this.dueTime - Date.now())
}
Task.prototype.throb = function(amount) {
  var element = `#task-card-`+this.index
  $(element).css({
    'transform' : 'scaleX('+(amount*1.01)+') scaleY('+(amount*1.01)+')'
  });
  setTimeout(function(){
    $(element).css({
      'transform' : 'scaleX(1) scaleY(1)'
    });
    setTimeout(function(){
      $(element).css({
        'transform' : 'scaleX('+(amount)+') scaleY('+(amount)+')'
      });
      setTimeout(function(){
        $(element).css({
          'transform' : 'scaleX(1) scaleY(1)'
        });
      },100);
    },100);
  },100);
}
Task.prototype.createCard = function() {
  var index = this.index
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
