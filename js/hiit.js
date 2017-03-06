function toggleDiv(hideDiv, showDiv)
{
  $(hideDiv).hide();
  $(showDiv).show();
}

function displayInput(divID, num)
{
  var name = '';
  for(var i=1; i<=num; i++)
  {
	name = divID.slice(1) + i;
	$(divID + 'Input').append(
	 '<label for="' + name + '">Input the name for move ' + i + ': </label>' +
	 '<input type="text" id="' + name + '" name="' + name + '"><br>'
	);
  }
}

function getMoveList(baseDivID)
{
  var arr = [];
  $(baseDivID + 'Names input[type=text]').each(function()
  {
    if(!$(this).val())
	{
	  displayError();
	}
	else
	{
	  arr.push($(this).val());
	}
  });
  
  return arr;
}

function doTheMath(baseDivID)
{
  var total;
  var arr = [];
  
  if(!$(baseDivID + 'NumMoves').val() || 
	     !$(baseDivID + 'NumRounds').val() ||
		 !$(baseDivID + 'MoveLength').val() ||
		 !$(baseDivID + 'RestLength').val() )
  {
	displayError();
  }
  else
  {
    toggleDiv(baseDivID + 'Set', baseDivID + 'MoveNames');
	// display x amount of input
	displayInput(baseDivID + 'Move', $(baseDivID + 'NumMoves').val());
	arr.push(parseInt($(baseDivID + 'NumRounds').val()));
	arr.push(parseInt($(baseDivID + 'MoveLength').val()));
	arr.push(parseInt($(baseDivID + 'RestLength').val()));
	total = (arr[1] + arr[2]) * parseInt($(baseDivID + 'NumMoves').val()) * arr[0];
	arr.push(total);
  }
  
  return arr;
}

 function displayConfirmDiv(divArr, moveArr, totalTimes)
 {
   var j;
   var sum = 0;
   var currentTime = new Date();
   
   divArr.forEach(function(element,i)
   {
     $(element + 'Confirm').show();
	 $(element + 'Math').append(totalTimes[i]);
	 for(j=0; j<moveArr[i].length; j++)
	 {
	   $(element + 'Names').append(moveArr[i][j] + '<br>');
	 }
	 
	 sum = sum + totalTimes[i];
   });
   
   currentTime.setSeconds(currentTime.getSeconds() + sum);
   
   $('#totalMath').append(sum + 'seconds');
   $('#workoutEndTime').append(currentTime.getHours() + ':' +
                               currentTime.getMinutes() + ':' +
							   currentTime.getSeconds()
                              );
 }

function displayError()
{
}	

function displayTimer(move, time)
{
  var timeChange = time;
  
  $("#moveName").html(move);
  
  var interval = setInterval(function()
  {
    $("#timer").html("<b>" + timeChange + "</b>");
    timeChange--;  
	
	if (timeChange < 0)
	{
	  clearInterval(interval);
	}
  }, 1000);
}

$(function()
{
  var moveSetArr = [];
  var divArr = [];
  var warmUpTimes = [];
  var workoutTimes = [];
  var coolDownTimes = [];
  var warmUpMoves = [];
  var workoutMoves = [];
  var coolDownMoves = [];
  
  // add event listeners
  $("#toFirstSection").click(function()
  {
	// check for checked boxes
	$('#workoutSections input[type=checkbox]').each(function()
	{
	  if(this.checked)
	  {
	    moveSetArr.push('#' + this.id + 'Set');
	  }
	});
	
	if(moveSetArr.length==0)
	{
	  // if there is no checked box, display error
	  displayError();
	}
	else
	{
	  // otherwise display the appropriate div
	  divArr = moveSetArr.slice(0);
	  moveSetArr.reverse();
	  toggleDiv('#workoutSections', moveSetArr[moveSetArr.length-1]);
	  moveSetArr.pop();
	}
  });
  
  $("#setWarmUpMoveNames").click(function()
  {
	warmUpTimes = doTheMath('#warmUp').slice(0);
  });
  
  $("#setWorkoutMoveNames").click(function()
  {
	workoutTimes = doTheMath('#workout').slice(0);
  });
  
  $("#setCoolDownMoveNames").click(function()
  {
	coolDownTimes = doTheMath('#coolDown').slice(0);
  });
  
  $("#confirmWarmUpNames").click(function()
  {
	warmUpMoves = getMoveList('#warmUpMove').slice(0);
	if(warmUpMoves.length != $('#warmUpMoveNames input[type=text]').length)
	{
	  displayError();
	}
	else
	{
	  if(moveSetArr.length==0)
	  {
		toggleDiv('#warmUpMoveNames', '#confirmWorkout');
	    displayConfirmDiv(divArr,[warmUpMoves],[warmUpTimes[3]]);
	  }
	  else
	  {
		toggleDiv('#warmUpMoveNames', moveSetArr[moveSetArr.length-1]);
		moveSetArr.pop();
	  }
	}
  });
  
  $("#confirmWorkoutNames").click(function()
  {
	workoutMoves = getMoveList('#workoutMove').slice(0);
	if(workoutMoves.length != $('#workoutMoveNames input[type=text]').length)
	{
	  displayError();
	}
	else
	{
	  if(moveSetArr.length==0)
	  {
		toggleDiv('#workoutMoveNames', '#confirmWorkout');
		if(warmUpMoves.length != 0)
		{
	      displayConfirmDiv(divArr,[warmUpMoves,workoutMoves],[warmUpTimes[3],workoutTimes[3]]);
		}
		else
		{
	      displayConfirmDiv(divArr,[workoutMoves],[workoutTimes[3]]);
		}
	  }
	  else
	  {
		toggleDiv('#workoutMoveNames', moveSetArr[moveSetArr.length-1]);
		moveSetArr.pop();
	  }
	}
  });
  
  $("#confirmCoolDownNames").click(function()
  {
	coolDownMoves = getMoveList('#coolDownMove');
	if(coolDownMoves.length!=$('#coolDownMoveNames input[type=text]').length)
	{
      displayError();
	}
	else
	{
      toggleDiv('#coolDownMoveNames', '#confirmWorkout');
	  if(warmUpMoves.length!=0 && workoutMoves.length!=0)
	  {
	    displayConfirmDiv(divArr,[warmUpMoves,workoutMoves,coolDownMoves],[warmUpTimes[3],workoutTimes[3],coolDownTimes[3]]);
	  }
	  else if(warmUpMoves.length!=0)
	  {
	    displayConfirmDiv(divArr,[warmUpMoves,coolDownMoves],[warmUpTimes[3],coolDownTimes[3]]);
	  }
	  else if(workoutMoves.length!=0)
	  {
	    displayConfirmDiv(divArr,[workoutMoves,coolDownMoves],[workoutTimes[3],coolDownTimes[3]]);		  
	  }
	  else
	  {
	    displayConfirmDiv(divArr,[coolDownMoves],[coolDownTimes[3]]);
	  }
	}
  });

  $('#cancel').click(function()
  {
	  toggleDiv('#confirmWorkout','#workoutSections');
  });
  
  $('#submit').click(function()
  {
    toggleDiv('#initiate','#workoutTimer');
	displayTimer("Rest", 20);
  });
	displayTimer("Rest", 20);
});