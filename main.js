let clicklist = []

const buyin_amount_sek = 100
const start_stack = 200
let player_count = 0
let active_players = 0
let add_on_count = 0
let rebuy_count = 0
let chipcount = 0
let prizepool = 0
let avg_stack_count = 0


var Poker = (function () {
  let paus = false
  let pauseCounter = 0
  let round = 1
  const  duration = 900
  let  timer = duration
  const blinds = [
      [1, 2],
      [2, 4],
      [3, 6],
      [4, 8],
      [5, 10],
      [6, 12],
      [8, 16],
      [10, 20],
      [15, 30],
      [20, 40],
      [30, 60],
      [40, 80],
      [60, 120],
      [80, 160],
      [120, 240],
      [140, 280],
      [180, 360],
      [300, 600],
      [300, 600],
      [300, 600],
      [300, 600],
      [300, 600],
      [300, 600],
      [300, 600],
      [300, 600],
    ]
  let interval_id

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
      } else {
        let round_blinds = blinds[round - 1] || blinds[blinds.length]

        $('.small-blind').html(round_blinds[0])
        $('.big-blind').html(round_blinds[1])
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
        $('.nextround-info').html(`Nästa nivå: ${blinds[round - 1][0]}/${blinds[round - 1][1]}`)


      }
      else if (paus) {
        paus = false
        $('#round').html('Nivå' + ' ' + round)
        $('.nextround-info').html(`Nästa nivå: ${blinds[round][0]}/${blinds[round][1]}`)


      }
      else {
        $('#round').html('Nivå' + ' ' + round)
        $('.nextround-info').html(`Nästa nivå: ${blinds[round][0]}/${blinds[round][1]}`)
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
  chipcount = start_stack * (player_count + rebuy_count + add_on_count)
  avg_stack_count = Math.round(chipcount / active_players)
  prizepool = (player_count + add_on_count + rebuy_count) * buyin_amount_sek
  if (player_count < 4) {
    $('.payout-count').html(`Payout:<br/>
    <br/>
    1st place: ${Math.round(prizepool)}Kr (100%)<br/>`)
  } else if (player_count < 7) {
    $('.payout-count').html(`Payout:<br>
      <br>
      1st place: ${Math.round(prizepool * 0.70)}Kr (70%)<br>
      2nd place: ${Math.round(prizepool * 0.30)}Kr (30%)`)
  } else if (player_count >= 7 && player_count <= 16) {
    $('.payout-count').html(`Payout:<br>
      <br>
      1st place: ${Math.round(prizepool * 0.50)}Kr (50%)<br>
      2nd place: ${Math.round(prizepool * 0.30)}Kr (30%)<br>
      3rd place: ${Math.round(prizepool * 0.20)}Kr (20%)`)
  } else if (player_count > 16) {
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
