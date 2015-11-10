var current = 3;
var game = 0;
var cate;
var checkGameState = false;
var checkState = false;
var lastState = false;
var clicked = false;
var trueAnswer = 0;

var infoState = false;

var question_quantity;
var countToOpen = 0;
var video = document.getElementById("bg_video");

function checkEmail() {
    var reg = /^([\w\.])+@([a-zA-Z0-9\-])+\.([a-zA-Z]{2,4})(\.[a-zA-Z]{2,4})?$/;
    return (reg.test($('#email').val()));
}
$(document).ready(function(){
  FastClick.attach(document.body);
  startgame();
  setInterval(function(){
    countToOpen = 0;
  }, 3000);
})

function gotoPage(id){
    
    $(".page").hide();
    $(".page[page-id="+id+"]").fadeIn(300);
    
    current = id;
}
  
function nextBUTTON() {
    $(window).scrollTop(0);
    video.pause();
    current += 1;
    if (current == 4) {
       checkState = true;
       gotoGamePage(game);
       $('.next_btn').hide();
    }
    if (current == 5) {
       $('#true_answer').text('Số câu hỏi bạn trả lời đúng là: '+ trueAnswer+'/'+question_quantity);
       if (trueAnswer == question_quantity) {
          $('#congrat').text('Chúc mừng bạn đã chiến thắng');
       }
       else{
          $('#congrat').text('Bạn chưa đạt yêu cầu !! Hãy thử lại nhé.');
       }
    }
    if (current == 6) {
      letCountUser()

      if (trueAnswer == question_quantity) {
        infoState = false;
        lastState = true;
        gotoPage(7);
      }
      else{
        infoState = false;
        lastState = true;
        gotoPage(7);
      }   
    }
    if (current == 7) {
        if (lastState == true) {
        }
        else{
          checkInfo();
        }
        if (infoState == true) {
           current = 6;
           return;
        }
        setTimeout(function(){
           window.location.reload();
        },3000);
    }
    gotoPage(current);
}

function gotoGamePage(id){
    
    $(".question").hide();
    $(".question[game-id="+id+"]").fadeIn(300);
    
    game = id;
}
  
function nextQUESTION() {
   $(window).scrollTop(0);
   $('.rad_answer i').hide();
   $('.next_btn1').hide();
   
   game += 1;
   clicked = false;
   if (game == question_quantity) {
      checkGameState = true;
   }
   if (checkGameState == true) {
      $('.next_btn').show();
      $('.next_btn1').hide();
      checkState = false;
   }
   gotoGamePage(game);  
}

function addQuestion(num) {
   for(var i = 0; i < num;i++){
      var tempDiv ='';
      if (i == 0) {
         tempDiv += '<div style="display:block" class="question" game-id="'+i+'">';   
      }
      else{
         tempDiv += '<div class="question" game-id="'+i+'">';
      }
      // tempDiv +='<h1>'+title[cate].category+'</h1><br>';
      tempDiv +='<div class="answer">';
      tempDiv +='<h2>'+(i+1)+'. '+title[cate].question[i].ques+'</h2><br/>';
      tempDiv +='<div class="rad_answer"><p qs-id="a" '+ (title[cate].question[i].true == 'a' ? 'istrue="true"': 'istrue="false"') +'>'+title[cate].question[i].a+'</p></div>';
      tempDiv +='<div class="rad_answer"><p qs-id="b" '+(title[cate].question[i].true == 'b' ? 'istrue="true"': 'istrue="false"')+'>'+title[cate].question[i].b+'</p></div>';
      tempDiv +='<div class="rad_answer"><p qs-id="c" '+(title[cate].question[i].true == 'c' ? 'istrue="true"': 'istrue="false"')+'>'+title[cate].question[i].c+'</p></div>';
      tempDiv +='<div class="rad_answer"><p qs-id="d" '+(title[cate].question[i].true == 'd' ? 'istrue="true"': 'istrue="false"')+'>'+title[cate].question[i].d+'</p></div>';
      tempDiv +='</div>';
      tempDiv +='<div class="next_btn1 animated" onclick="nextQUESTION()">NEXT</div>';
      tempDiv +='</div>';
      
      $('.page[page-id="4"]').append(tempDiv);
   }
   chooseAnswer();
}
function chooseAnswer() {
   $('.rad_answer').click(function(){
      $('.next_btn1').fadeIn(300);
      
      if (game == question_quantity - 1) {
         $('.next_btn').show();
         $('.next_btn1').hide();
         checkState = false;
      }
      if (clicked == true) {
         return;
      }
      else{
         clicked = true;
         var select = $(this).find('p').attr('istrue');
         
         if (select == "true") {   
            $(this).addClass('true');
            trueAnswer += 1;
         }
         else{
            $(this).addClass('false');
            $(this).parents('.answer').find('.rad_answer p[istrue = "true"]').parent().addClass('true');
         }
      }
   })
}

function checkInfo() {
    if ($('#name').val() == '' || $('#birthday').val() == '' || $('#email').val() == '' || $('#phone').val() == '') {
        alert("Hãy nhập đầy đủ thông tin");
        infoState = true;
    }
    else if (checkEmail() == false) {
        alert('Hãy nhập đúng Email(ví dụ: aaa@gmail.com)');
        infoState = true;
    }
    else if ($('#birthday').val().length != 4) {
        //$('#birthday').val('');
        $('#birthday').focus();
        alert('năm sinh chỉ 4 ký tự')
        infoState = true;
    }
    else{
        infoState = false;
        $.ajax({
            type:'POST',
            url:'ajax.php',
            data:{
                'action':'addPlayer',
                'name':$('#name').val(),
                'birthday':$('#birthday').val(),
                'phone':$('#phone').val(),
                'email':$('#email').val(),
            },
            success:function(msg){
                $temp = JSON.parse(msg);
                if ($temp.result == 1) {
                    console.log("Nhập dữ liệu thành công");
                }
                else{
                    console.log("Nhập dữ liệu thất bại");
                }
            }
        })
    }
}


function startgame() {
   randTitle(0, title.length -1);
   question_quantity = title[cate].question.length;
   addQuestion(question_quantity);
}
function randTitle(min,max) {
   cate = Math.floor(Math.random()*(max-min+1)+min);
    console.log(cate +'__'+ title[cate].category);
   return cate;
}


function letCountUser() {
  countUser = localStorage.getItem("countUser");
  if (countUser == null) {
    countUser == 0;
  }
  localStorage.setItem('countUser', ++countUser);
}

function reset() { 
  if (countToOpen >= 2) {
    window.location.reload();
    countToOpen = 0;
  }
  countToOpen++;
}

function openHidenPanel() {
  if (countToOpen >= 2) {
    $(".page[page-id=8]").find("h2").text('Số người đã chơi là '+localStorage.getItem('countUser'));
    gotoPage(8); 
    countToOpen = 0;       
  }
  countToOpen++;
  console.log(countToOpen);
}

function clearData() {
  if (confirm('Are you sure to delete counting data?')) {
    $(".page[page-id=8]").find("h2").text('Số người đã chơi là 0');
    localStorage.setItem('countUser', 0);
  }
}
