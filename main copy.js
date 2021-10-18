





var Poker = (function () {
  let round_blinds;
  let paus = false;
  let pauseCounter = 0;
  var round = 1,
      duration = 3,
      timer = duration,
      blinds = [{
        small: 1,
        big: 2
      }, {
        small: 2,
        big: 4
      }, {
        small: 3,
        big: 6
      }, {
        small: 4,
        big: 8
      }, {
        small: 5,
        big: 10
      }, {
        small: 6,
        big: 12
      }, {
        small: 8,
        big: 16
      }, {
        small: 10,
        big: 20
      }, {
        small: 20,
        big: 40
      }, {
        small: 30,
        big: 60
      }, {
        small: 40,
        big: 80
      }, {
        small: 50,
        big: 100
      }, {
        small: 100,
        big: 200
      }, {
        small: 250,
        big: 500
      }],
      interval_id;

  return {
    isGamePaused: function () {
      return !interval_id ? true : false;
    },
    playAlarm: function () {

      if (round!==13){
      $('#alarm')[0].play();
      }else if (!paus && round===13){
      $('#alarm_pause3')[0].play();
      }
    },
    reset: function () {
      // reset timer
      this.resetTimer();

      this.stopClock();

      this.updateClock(timer);

      // reset play/pause button
      this.updatePlayPauseButton();

      // reset round
      round = 1;
      // reset pause-counter
      pauseCounter = 0;
      this.updateRound(round);

      // increase blinds
      this.updateBlinds(round);
    },
    resetTimer: function () {
      timer = duration;
    },
    startClock: function () {
      var that = this;

      interval_id = setInterval(function () {
        that.updateClock(timer);

        timer -= 1;
      }, 1000);
    },
    startNextRound: function () {
      // reset timer
      this.resetTimer();

      this.stopClock();

      this.updateClock(timer);

      // reset play/pause button
      this.updatePlayPauseButton();

      // increase round
      if(!paus){
      round += 1;
      pauseCounter+=1;
      }
      this.updateRound(round);

      // increase blinds
      this.updateBlinds(round);
    },startPreviousRound: function () {
      // reset timer
      this.resetTimer();

      this.stopClock();

      this.updateClock(timer);

      // reset play/pause button
      this.updatePlayPauseButton();

      // decrease round
      if(!paus){
      round -= 1;
      pauseCounter -=1;
      }

      this.updateRound(round);

      // increase blinds
      this.updateBlinds(round);
    },
    stopClock: function () {
      clearInterval(interval_id);
      interval_id = undefined;
    },
    updateBlinds: function (round) {
      if (paus){
        $('.small-blind').html('Paus')
        $('.small-blind').html('Paus')
    }
    else{
      round_blinds = blinds[round - 1] || blinds[blinds.length];

      $('.small-blind').html(round_blinds.small);
      $('.big-blind').html(round_blinds.big);
    }
    },
    updateClock: function (timer) {
      var minute = Math.floor(timer / 60),
          second = (timer % 60) + "",
          second = second.length > 1 ? second : "0" + second;

      $('.clock').html(minute + ":" + second);

      if (timer <= 0) {
        
        this.startNextRound();
        
        this.playAlarm();

        this.startClock();

        // update play/pause button
        this.updatePlayPauseButton();
      }
    },
    updatePlayPauseButton: function () {
      var pause_play_button = $('#poker_play_pause a');

      if (this.isGamePaused()) {
        pause_play_button.removeClass('pause');
        pause_play_button.addClass('play');
      } else {
        pause_play_button.removeClass('play');
        pause_play_button.addClass('pause');
      }
    },
    updateRound: function (round) {
      // if(pauseCounter ===-4)
      // pauseCounter=0;
     

      if (pauseCounter===4&& !paus){
        $('#round').html(`Nästa Nivå: ${round}`);
        paus=true;
        pauseCounter=0;
        $('.small-blind').html("Paus");
        $('.big-blind').html("Paus");
        $('#morkar').html(`Nästa nivå: ${blinds[round-1].small}/${blinds[round-1].big}`);

      }
      else if (paus){
        paus = false;
        $('#morkar').html(`Mörkar`);
        $('#round').html('Nivå' + ' ' + round);

      }
      else $('#round').html('Nivå' + ' ' + round);
    }
  };
}());

$('#poker_play_pause').on('click', function (event) {
  if (Poker.isGamePaused()) {
    Poker.startClock();
  } else {
    Poker.stopClock();
  }

  // update play/pause button
  Poker.updatePlayPauseButton();
});

$('#poker_next_round').on('click', function (event) {
  Poker.startNextRound();
});
$('#poker_previous_round').on('click', function (event) {
  Poker.startPreviousRound();
});

$('body').on('keypress', function (event) {
  if (Poker.isGamePaused()) {
    Poker.startClock();
  } else {
    Poker.stopClock();
  }

  // update play/pause button
  Poker.updatePlayPauseButton();
});


$('.reset').on('click', function (event) {
  Poker.reset();
});