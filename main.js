


let clicklist = []
const buyin_ammount = 100
let player_count = 0
let active_players = 0
let add_on_count = 0
let rebuy_count = 0
let chipcount = 0
let prizepool = 0
let avg_stack_count = 0
let round_blinds


var Poker = (function () {
  let paus = false
  let pauseCounter = 0
  var round = 1,
    duration = 900,
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
    }, {
      small: 250,
      big: 500
    }, {
      small: 250,
      big: 500
    }, {
      small: 250,
      big: 500
    }, {
      small: 250,
      big: 500
    }],
    interval_id

  return {
    isGamePaused: function () {
      return !interval_id ? true : false
    },
    playAlarm: function () {
      $('#alarm')[0].play()
    },
    reset: function () {
      // reset timer
      this.resetTimer()

      this.stopClock()

      this.updateClock(timer)

      // reset play/pause button
      this.updatePlayPauseButton()

      // reset round
      round = 1
      // reset pause-counter
      pauseCounter = 0
      this.updateRound(round)

      // increase blinds
      this.updateBlinds(round)
    },
    resetTimer: function () {
      timer = duration
    },
    startClock: function () {
      var that = this

      interval_id = setInterval(function () {
        that.updateClock(timer)

        timer -= 1
      }, 1000)
    },
    startNextRound: function () {
      // reset timer
      this.resetTimer()

      this.stopClock()

      this.updateClock(timer)

      // reset play/pause button
      this.updatePlayPauseButton()

      // increase round
      if (!paus) {
        round += 1
        pauseCounter += 1
      }
      this.updateRound(round)

      // increase blinds
      this.updateBlinds(round)
    }, startPreviousRound: function () {
      // reset timer
      this.resetTimer()

      this.stopClock()

      this.updateClock(timer)

      // reset play/pause button
      this.updatePlayPauseButton()

      // decrease round
      if (!paus) {
        round -= 1
        pauseCounter -= 1
      }

      this.updateRound(round)

      // increase blinds
      this.updateBlinds(round)
    },
    stopClock: function () {
      clearInterval(interval_id)
      interval_id = undefined
    },
    updateBlinds: function (round) {
      if (paus) {
        $('.small-blind').html('Paus')
        $('.small-blind').html('Paus')
      }
      else {
        round_blinds = blinds[round - 1] || blinds[blinds.length]

        $('.small-blind').html(round_blinds.small)
        $('.big-blind').html(round_blinds.big)
      }
    },
    updateClock: function (timer) {
      var minute = Math.floor(timer / 60),
        second = (timer % 60) + "",
        second = second.length > 1 ? second : "0" + second

      $('.clock-min').html(minute)
      $('.clock-sec').html(second)

      if (timer <= 0) {

        this.startNextRound()

        this.playAlarm()

        this.startClock()

        // update play/pause button
        this.updatePlayPauseButton()
      }
    },
    updatePlayPauseButton: function () {
      var pause_play_button = $('#poker_play_pause a')

      if (this.isGamePaused()) {
        pause_play_button.removeClass('pause')
        pause_play_button.addClass('play')
      } else {
        pause_play_button.removeClass('play')
        pause_play_button.addClass('pause')
      }
    },
    updateRound: function (round) {
      // if(pauseCounter ===-4)
      // pauseCounter=0;

      if (pauseCounter === 4 && !paus) {
        $('#round').html(`Nästa Nivå : ${round}`)
        paus = true
        pauseCounter = 0
        $('.small-blind').html("Paus")
        $('.big-blind').html("Paus")
        $('.nextround-info').html(`Nästa nivå: ${blinds[round - 1].small}/${blinds[round - 1].big}`)


      }
      else if (paus) {
        paus = false
        $('#round').html('Nivå' + ' ' + round)
        $('.nextround-info').html(`Nästa nivå: ${blinds[round].small}/${blinds[round].big}`)


      }
      else {
        $('#round').html('Nivå' + ' ' + round)
        $('.nextround-info').html(`Nästa nivå: ${blinds[round].small}/${blinds[round].big}`)
      }

      if (pauseCounter === 3 && !paus) {
        $('.nextround-info').html(`Nästa nivå: Paus`)
      }
    }
  }
}())

$('#poker_play_pause').on('click', function (event) {
  if (Poker.isGamePaused()) {
    Poker.startClock()
  } else {
    Poker.stopClock()
  }

  // update play/pause button
  Poker.updatePlayPauseButton()
})

$('#poker_next_round').on('click', function (event) {
  Poker.startNextRound()
})
$('#poker_previous_round').on('click', function (event) {
  Poker.startPreviousRound()
})

$('body').on('keypress', function (event) {
  if (Poker.isGamePaused()) {
    Poker.startClock()
  } else {
    Poker.stopClock()
  }


  // update play/pause button
  Poker.updatePlayPauseButton()
})


$('.reset-timer').on('click', function (event) {
  Poker.reset()
})

$('.reset-money').on('click', function (event) {
  player_count = 0
  active_players = 0
  add_on_count = 0
  rebuy_count = 0
  prizepool = 0
  avg_stack_count = 0
  chipcount = 0

  $('.player-count').html(`Starting Players: ${player_count}`)
  $('.active-player-count').html(`Players left: ${active_players}`)
  $('.rebuy-count').html(`Rebuys: ${rebuy_count}`)
  $('.add-on-count').html(`Add-ons: ${add_on_count}`)
  $('.avg-stack-count').html(`Avg. stack: ${avg_stack_count}`)
  $('.prizepool-count').html(`Total Prizepool: ${prizepool}`)
  $('.payout-count').html('')
})

function calculate_prizepool() {
  chipcount = buyin_ammount * (player_count + rebuy_count + add_on_count)
  avg_stack_count = Math.round(chipcount / active_players)
  prizepool = (player_count + add_on_count + rebuy_count) * buyin_ammount
  if (player_count < 4) {
    $('.payout-count').html(`Payout:<br/>
  <br/>
  1st place: ${Math.round(prizepool)}Kr (100%)<br/>`)
  }
  else if (player_count < 7) {
    $('.payout-count').html(`Payout:<br>
  <br>
  1st place: ${Math.round(prizepool * 0.70)}Kr (70%)<br>
  2nd place: ${Math.round(prizepool * 0.30)}Kr (30%)`)
  }
  else if (player_count >= 7 && player_count <= 16) {
    $('.payout-count').html(`Payout:<br>
  <br>
  1st place: ${Math.round(prizepool * 0.50)}Kr (50%)<br>
  2nd place: ${Math.round(prizepool * 0.30)}Kr (30%)<br>
  3rd place: ${Math.round(prizepool * 0.20)}Kr (20%)`)
  }
  else if (player_count > 16) {
    $('.payout-count').html(`Payout:<br>
  <br>
  1st place: ${Math.round(prizepool * 0.50)}Kr (50%)<br>
  2nd place: ${Math.round(prizepool * 0.25)}Kr (25%)<br>
  2nd place: ${Math.round(prizepool * 0.15)}Kr (15%)<br>
  4th place: ${Math.round(prizepool * 0.10)}Kr (10%)`)
  }

}

$('#btn-add-player').on('click', function () {
  player_count++
  active_players++
  calculate_prizepool()
  $('.player-count').html(`Starting Players: ${player_count}`)
  $('.active-player-count').html(`Players left: ${active_players}`)
  $('.avg-stack-count').html(`Avg. stack: ${avg_stack_count}`)
  $('.prizepool-count').html(`Total Prizepool: ${prizepool}`)
  clicklist.push(this)
})


$('#btn-remove-player').on('click', function () {
  if (active_players > 1) {

    if (active_players === 2) {
      $('#alarm-fanfare')[0].play()
      Poker.stopClock()
      fireworks()
    }
    else {
      $('#alarm-elimination')[0].play()
    }

    active_players--
    calculate_prizepool()
    $('.active-player-count').html(`Players left: ${active_players}`)
    $('.avg-stack-count').html(`Avg. stack: ${avg_stack_count}`)
    $('.prizepool-count').html(`Total Prizepool: ${prizepool}`)
    clicklist.push(this)

  }
})
$('#btn-add-on').on('click', function () {
  add_on_count++
  calculate_prizepool()
  $('.add-on-count').html(`Add-ons: ${add_on_count}`)
  $('.prizepool-count').html(`Total Prizepool: ${prizepool}`)
  $('.avg-stack-count').html(`Avg. stack: ${avg_stack_count}`)
  clicklist.push(this)

})
$('#btn-rebuy').on('click', function () {
  rebuy_count++
  calculate_prizepool()
  $('.rebuy-count').html(`Rebuys: ${rebuy_count}`)
  $('.prizepool-count').html(`Total Prizepool: ${prizepool}`)
  $('.avg-stack-count').html(`Avg. stack: ${avg_stack_count}`)
  clicklist.push(this)
})

$('#btn-undo').on('click', function () {
  clicklist.pop()
  //kör reset-funktionen
  $('.reset-money').click()


  for (let i = 0; i < clicklist.length; i++) {
    console.log(clicklist[i])

    //kör funktionen specificerad i listan på plats i
    clicklist[i].click()
    clicklist.pop()

    /**  $('nav').on('click', '.nav-item', function () {
      if ($('#navbarSupportedContent').hasClass('show')) {
        $('#data-burgarn').click();
      }
    })

  } */
  }

})
function fireworks() {

}