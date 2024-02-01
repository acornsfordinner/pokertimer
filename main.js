


let clicklist = []
let buyin_amount = 100
let start_stack = 200
let player_count = 0
let active_players = 0
let add_on_count = 0
let rebuy_count = 0
let chipcount = 0
let prizepool = 0
let avg_stack_count = 0
let custom_itm_count = ""
let duration = 900
let undoer = false


var Poker = (function () {
  getStateFromLocalStorage()
  getSettingsFromLocalStorage()

  let paus = false
  let pauseCounter = 0
  let round = 1


  let timer = duration
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
    [500, 1000],
    [800, 1600],
    [1000, 2000],
    [1500, 3000],
    [2000, 4000],
    [3000, 6000],
    [5000, 10000],
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
      if (round === 1 && timer == duration) {
        $('#alarm-start')[0].play()
      }

      var that = this

      interval_id = setInterval(function () {
        if (timer === 900) { timer -= 1 }
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
        $('.small-blind').html('Break')
        $('.big-blind').html('Break')
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
      var pause_play_button = $('#poker_play_pause_span a')

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
        $('#round').html(`Next Level : ${round}`)
        paus = true
        pauseCounter = 0
        $('.small-blind').html("Break")
        $('.big-blind').html("Break")
        $('.nextround-info').html(`Next level: ${blinds[round - 1][0]}/${blinds[round - 1][1]}`)


      }
      else if (paus) {
        paus = false
        $('#round').html('Level' + ' ' + round)
        $('.nextround-info').html(`Next level: ${blinds[round][0]}/${blinds[round][1]}`)


      }
      else {
        $('#round').html('Level' + ' ' + round)
        $('.nextround-info').html(`Next level: ${blinds[round][0]}/${blinds[round][1]}`)
      }

      if (pauseCounter === 3 && !paus) {
        $('.nextround-info').html(`Next level: Break`)
      }
    }
  }
}())

$('#poker_play_pause_span').on('click', function (event) {
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
  if (event.originalEvent.code === "Space") {
    if (Poker.isGamePaused()) {
      Poker.startClock()
    } else {
      Poker.stopClock()
    }
    // update play/pause button
    Poker.updatePlayPauseButton()
  }
})


$('.reset-timer').on('click', function (event) {
  Poker.reset()
})


$('#btn-settings').on('click', function (event) {
  hideGameCustomization()
})

$('#btn-settings-save').on('click', function (event) {
  saveSettingsToLocalStorage()

  // recalculate winnings etc
  calculate_prizepool()

  hideGameSettings()
})
$('#btn-settings-close').on('click', function (event) {
  //TODO reset settings from localstorage
  getSettingsFromLocalStorage()
  hideGameSettings()
})
function hideGameCustomization() {
  $('.game-customization-box > .holder-butn-oval').hide(200, "swing", showGameSettings)
}

function showGameSettings() {
  $('.game-customization-box > .game-settings').show(200, "swing")
  //populate values with data from localstorage


}

function hideGameSettings() {
  $('.game-customization-box > .game-settings').hide(200, "swing", showGameCustomization)
}
function showGameCustomization() {
  $('.game-customization-box > .holder-butn-oval').show(200, "swing")
}



$('#reset-money').on('click', function (event) {
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
  //custom_itm_count
  let payout_positions = 0
  if (custom_itm_count == "" || !custom_itm_count || custom_itm_count == 0) {
    // if nr of payout positions is set to auto
    if (player_count < 4) {
      payout_positions = 1
    }
    if (player_count < 7) {
      payout_positions = 2
    } else if (player_count >= 7 && player_count <= 12) {
      payout_positions = 3
    } else if (player_count > 12 && player_count <= 16) {
      payout_positions = 4
    } else {
      payout_positions = 5
    }
  } else if (custom_itm_count > player_count) {
    // not more payouts than players
    payout_positions = player_count
  } else {
    // sure, why not, infinite payouts
    payout_positions = custom_itm_count
  }



  if (player_count > 0) {
    chipcount = start_stack * (player_count + rebuy_count + add_on_count)
    avg_stack_count = Math.round(chipcount / active_players)
    prizepool = (player_count + add_on_count + rebuy_count) * buyin_amount



    if (payout_positions === 1) {
      $('.payout-count').html(`Payout:<br/>
    <br/>
    1st place: ${Math.round(prizepool)}Kr (100%)<br/>`)
    } else if (payout_positions === 2) {
      $('.payout-count').html(`Payout:<br>
      <br>
      1st place: ${Math.round(prizepool * 0.70)}Kr (70%)<br>
      2nd place: ${Math.round(prizepool * 0.30)}Kr (30%)`)
    } else if (payout_positions === 3) {
      $('.payout-count').html(`Payout:<br>
      <br>
      1st place: ${Math.round(prizepool * 0.50)}Kr (50%)<br>
      2nd place: ${Math.round(prizepool * 0.30)}Kr (30%)<br>
      3rd place: ${Math.round(prizepool * 0.20)}Kr (20%)`)
    } else if (payout_positions === 4) {
      $('.payout-count').html(`Payout:<br>
      <br>
      1st place: ${Math.round(prizepool * 0.50)}Kr (50%)<br>
      2nd place: ${Math.round(prizepool * 0.25)}Kr (25%)<br>
      3rd place: ${Math.round(prizepool * 0.15)}Kr (15%)<br>
      4th place: ${Math.round(prizepool * 0.10)}Kr (10%)`)
    } else if (payout_positions === 5) {
      $('.payout-count').html(`Payout:<br>
      <br>
      1st place: ${Math.round(prizepool * 0.40)}Kr (40%)<br>
      2nd place: ${Math.round(prizepool * 0.25)}Kr (25%)<br>
      3rd place: ${Math.round(prizepool * 0.20)}Kr (20%)<br>
      4th place: ${Math.round(prizepool * 0.10)}Kr (10%)<br>
      5th place: ${Math.round(prizepool * 0.05)}Kr (5%)`)
    } else {
      let infinite_payouts = ""
      let sillyPayout = Math.round(prizepool / payout_positions)
      let sillyPercentage = (prizepool/payout_positions)*0.1
      for (let i = 1; i <= payout_positions; i++) {
        
        infinite_payouts = infinite_payouts.concat(`
      ${i}${((i.toString().charAt(i.toString().length - 1) == "1") && i != 11) ? "st" : (i.toString().charAt(i.toString().length - 1) == "2") && i != 12 ? "nd" : (i.toString().charAt(i.toString().length - 1) == "3") && i != 13 ? "rd" : "th"} place: ${sillyPayout}Kr (${sillyPercentage}%)<br>
      `)
      }
      $('.payout-count').html(`Payout:<br>
        <br>${infinite_payouts}`)
    }


    $('.rebuy-count').html(`Rebuys: ${rebuy_count}`)
    $('.prizepool-count').html(`Total Prizepool: ${prizepool}`)
    $('.avg-stack-count').html(`Avg. stack: ${avg_stack_count}`)
    $('.player-count').html(`Starting Players: ${player_count}`)
    $('.active-player-count').html(`Players left: ${active_players}`)
    $('.add-on-count').html(`Add-ons: ${add_on_count}`)
  }
  saveStateToLocalStorage()
}
$('#btn-add-player').on('click', function (eventet) {

  if (!undoer) {
    $('#btn-add-player').addClass("yellow_pulse")
    $('#alarm-coin')[0].play()
  }
  clicklist.push(this.id)


  player_count++
  active_players++
  calculate_prizepool()
})

$('#btn-rebuy').on('click', function (eventet) {
  if (active_players < 1) {
    $('#btn-rebuy').addClass("grey_pulse")
    $('#alarm-no')[0].play()
    return
  }
  if (!undoer) {
    $('#btn-rebuy').addClass("yellow_pulse")
    $('#alarm-heartbeats')[0].play()
  }
  clicklist.push(this.id)
  rebuy_count++
  calculate_prizepool()
})

$('#btn-add-on').on('click', function (eventet) {
  if (active_players < 1) {
    $('#btn-add-on').addClass("grey_pulse")
    $('#alarm-no')[0].play()
    return
  }
  if (!undoer) {
    $('#btn-add-on').addClass("yellow_pulse")
    $('#alarm-sword')[0].play()
  }
  clicklist.push(this.id)
  add_on_count++
  calculate_prizepool()
})

$('#btn-remove-player').on('click', function (eventet) {
  if (active_players > 1) {
    if (!undoer) {
      $('#btn-remove-player').addClass("red_pulse")

      if (active_players === 2) {
        $('#alarm-fanfare')[0].play()
        Poker.stopClock()
        //fireworkers()
      }
      else {
        $('#alarm-elimination')[0].play()
      }
    }
    clicklist.push(this.id)
    active_players--
    calculate_prizepool()
  } else {
    if (!undoer) {
      $('#btn-remove-player').addClass("orange_pulse")
      $('#alarm-no')[0].play()
    }
  }
})

$('#btn-undo').on('click', function () {
  undoer = true
  if (clicklist.length === 0) {
    $('#btn-undo').addClass("grey_red_pulse")
    $('#alarm-no')[0].play()
    return
  } else {
    $('#btn-undo').addClass("grey_green_pulse")
  }
  // change .pop to "fake a click on the item with this id
  clicklist.pop()
  $('#alarm-oops')[0].play()
  //kör reset-funktionen
  $('#reset-money').click()


  for (let i = 0; i < clicklist.length; i++) {

    // skip the sounds and animations
    clicklist[i].value = "undoing"
    $('#' + clicklist[i]).click()
    clicklist[i].value = ""
    clicklist.pop()
  }
  saveStateToLocalStorage()
  undoer = false
})
function fireworkers() {
  fireworks.start()
}



$('#btn-add-player').on("animationstart", listener)
$('#btn-add-player').on("animationend", listener)


$('#btn-rebuy').on("animationstart", listener)
$('#btn-rebuy').on("animationend", listener)

$('#btn-add-on').on("animationstart", listener)
$('#btn-add-on').on("animationend", listener)

$('#btn-remove-player').on("animationstart", listener)
$('#btn-remove-player').on("animationend", listener)

$('#btn-undo').on("animationstart", listener)
$('#btn-undo').on("animationend", listener)


function listener(event) {

  switch (event.type) {
    case "animationstart":
      break

    case "animationend":

      if (event.target.id === "btn-add-player") {
        $('#btn-add-player').removeClass("yellow_pulse")
        $('#btn-add-player').removeClass("focus_pulse")
      }
      else if (event.target.id === "btn-rebuy") {
        $('#btn-rebuy').removeClass("yellow_pulse")
        $('#btn-rebuy').removeClass("grey_pulse")
      }
      else if (event.target.id === "btn-add-on") {
        $('#btn-add-on').removeClass("yellow_pulse")
        $('#btn-add-on').removeClass("grey_pulse")
      }
      else if (event.target.id === "btn-remove-player") {
        $('#btn-remove-player').removeClass("red_pulse")
        $('#btn-remove-player').removeClass("orange_pulse")
      }
      else if (event.target.id === "btn-undo") {
        $('#btn-undo').removeClass("grey_green_pulse")
        $('#btn-undo').removeClass("grey_red_pulse")
      }
      break

    default:
      break
  }
}

function saveSettingsToLocalStorage() {

  // save settings to local storage
  localStorage.setItem("Buy-In", $('#settings-buyin-amount').val())
  localStorage.setItem("Chips", $('#settings-starting-chips').val())
  localStorage.setItem("ITM", $('#settings-payout-positions').val())
  localStorage.setItem("Lvl_duration", $('#settings-level-time').val() * 60)

  getSettingsFromLocalStorage()

}

function getSettingsFromLocalStorage() {

  buyin_amount = Number(localStorage.getItem("Buy-In") || 100)
  start_stack = Number(localStorage.getItem("Chips") || 100)
  custom_itm_count = Number(localStorage.getItem("ITM") || "")
  duration = Number(localStorage.getItem("Lvl_duration") || 900)

  $('#settings-buyin-amount').val(buyin_amount)
  $('#settings-starting-chips').val(start_stack)
  $('#settings-payout-positions').val(custom_itm_count > 0 ? custom_itm_count : "")

  $('#settings-level-time').val(duration / 60)
  calculate_prizepool()
}

function saveStateToLocalStorage() {
  localStorage.setItem("clicklist", JSON.stringify(clicklist))
  localStorage.setItem("player_count", player_count)
  localStorage.setItem("active_players", active_players)
  localStorage.setItem("rebuy_count", rebuy_count)
  localStorage.setItem("chipcount", chipcount)
  localStorage.setItem("prizepool", prizepool)
  localStorage.setItem("avg_stack_count", avg_stack_count)
  localStorage.setItem("add_on_count", add_on_count)
}

function getStateFromLocalStorage() {

  clicklist = localStorage.getItem("clicklist") ? JSON.parse(localStorage.getItem("clicklist")) : []

  player_count = Number(localStorage.getItem("player_count") || 0)
  active_players = Number(localStorage.getItem("active_players") || 0)
  rebuy_count = Number(localStorage.getItem("rebuy_count") || 0)
  chipcount = Number(localStorage.getItem("chipcount") || 0)
  prizepool = Number(localStorage.getItem("prizepool") || 0)
  avg_stack_count = Number(localStorage.getItem("avg_stack_count") || 0)
  add_on_count = Number(localStorage.getItem("add_on_count") || 0)
  calculate_prizepool()
}
