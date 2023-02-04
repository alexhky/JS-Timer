//gibt die verbleibende Zeit zurück
function getTimeRemaining(endtime) {
  const total = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds
  };
}



function initializeCountdown(id, endtime, starttime) {
  const countdown = document.getElementById(id);
  const hoursSpan = countdown.querySelector('.cd_hours');
  const minutesSpan = countdown.querySelector('.cd_minutes');

  function updateCountdown() {
    const t = getTimeRemaining(endtime);
    //document.getElementById("demo").innerHTML = t; Debugzwecke dies das

    if (t.days == 0) {
      //wenn mehr als eine Stunde übrig ist, dann Stunden anzeigen
      if (t.hours > 1) {
        hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
        minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
      } else if (t.hours == 1) {
          //ab 60 Minuten Restzeit nur die Minuten anzeigen (Sonderfall genau 1h)
          if (t.minutes == 0) {
            minutesSpan.innerHTML = '60';
            document.getElementsByClassName('cd_hour_hide')[0].style.visibility = 'hidden';
          }
          else {
           hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
           minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
          }
      } else {
        // Stundenzähler wird ausgeblendet, wenn t.hours = 0 ist
        document.getElementsByClassName('cd_hour_hide')[0].style.visibility = 'hidden';
        if (t.minutes == 0) {
          if (t.seconds == 0) {
            minutesSpan.innerHTML = ('0');
          }
          else {
            //Soll hier für den den 1 Minuten-Offset sorgen. Macht es allerdings nur bei der letzten Minute, damit nicht die ganze Zeit 0 dasteht.
            minutesSpan.innerHTML = ('1');
          }
        } else {
          minutesSpan.innerHTML = (t.minutes);
        }
      }
    } else {
      //keine Anzeige für verbleibende Tage, deshalb mit Stunden multipliziert
      hoursSpan.innerHTML = ('0' + t.hours + t.days*24).slice(-2);
      minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    }
    if (t.total <= 0) {
      clearInterval(timeinterval);
      //lokale Daten löschen, weil braucht man nicht mehr
      localStorage.clear();
    }

    //Fortschritt aktualisieren
    var laufzeit = endtime - starttime;
    var restlaufzeit = new Date();
    restlaufzeit = endtime - restlaufzeit;

    var fortschritt = 100-(restlaufzeit * 100 / laufzeit);
    var s = document.getElementById('progressbar');
    s.value = fortschritt;
  }
  //Ruft updateCountdown() alle 1000 ms auf
  const timeinterval = setInterval(updateCountdown, 1000);

}



//aktuelle Zeit anzeigen
function initializeClock(id) {
  const clock = document.getElementById(id);
  const hoursSpanClk = clock.querySelector('.clk_hours');
  const minutesSpanClk = clock.querySelector('.clk_minutes');
  const secondsSpanClk = clock.querySelector('.clk_seconds');
  function updateClock() {
    var currentdatetime = new Date();
    var currenthour = currentdatetime.getHours();
    var currentminute = currentdatetime.getMinutes();
    var currentsecond = currentdatetime.getSeconds();
    hoursSpanClk.innerHTML = ('0' + currenthour).slice(-2);
    minutesSpanClk.innerHTML = ('0' + currentminute).slice(-2);
    secondsSpanClk.innerHTML = ('0' + currentsecond).slice(-2);
  }
  const timeinterval = setInterval(updateClock, 1000);
}



//auf den OK Button reagieren, startet den Countdown und zeigt die Endzeit an
document.getElementById("time-button-pressed").addEventListener("click", function() {
    const startzeit = new Date();
    var enddatum = document.getElementById("date-picker").value;
    var endzeit = document.getElementById("time-picker").value;
    const deadline = new Date(enddatum + "T" + endzeit);
    // Êndzeit anzeigen
    const endzeitclock = document.getElementById('endzeitdiv');
    const hoursSpanEndzeit = endzeitclock.querySelector('.endzeit_hours');
    const minutesSpanEndzeit = endzeitclock.querySelector('.endzeit_minutes')
    hoursSpanEndzeit.innerHTML = ('0' + deadline.getHours()).slice(-2);
    minutesSpanEndzeit.innerHTML = ('0' + deadline.getMinutes()).slice(-2);
//    document.getElementById("demo").innerHTML = deadline;
//Deadline und Startzeit lokal speichern
    localStorage.setItem("deadline", deadline);
    localStorage.setItem("startzeit", startzeit);
    initializeCountdown('countdowndiv', deadline, startzeit);
    initializeClock('clockdiv');
})



// Voreinstellung der Zeit
var today = new Date();
var stunde = today.getHours();
if (stunde == 22) {
  document.querySelector("#time-picker").value = "00:00";
} else if (stunde == 23) {
  document.querySelector("#time-picker").value = "01:00";
} else {
  stunde = stunde +2;
  document.querySelector("#time-picker").value = ('0' + stunde).slice(-2) + ":00";
}



// Voreinstellung des Datums
var today = new Date();
var stunde = today.getHours();
if (stunde > 21) {
  var neuertag = today.getDate();
  neuertag = neuertag + 1;
  var aktuellermonat = today.getMonth()+1;
  document.querySelector("#date-picker").value = today.getFullYear() + "-" + ('0' + String(aktuellermonat)).slice(-2) + "-" + ('0' + neuertag).slice(-2);
} else {
  var aktuellermonat = today.getMonth()+1;
  document.querySelector("#date-picker").value = today.getFullYear() + "-" + ('0' + aktuellermonat).slice(-2) + "-" + ('0' + today.getDate()).slice(-2);
}



/* Topbarspäße beim Öffnen */
function openNav() {
  document.getElementById("myTopbar").style.height = "25%";
  document.getElementById("main").style.marginTop = "250px";
}



/* Topbarspäße beim Schließen */
function closeNav() {
  document.getElementById("myTopbar").style.height = "0";
  document.getElementById("main").style.marginTop = "0";
}



/* übergibt beim Laden der Seite den letzten gespeicherten Wert, falls vorhanden
Speicher wird gelöscht, falls die Deadline in der Vergangenheit liegt */
function loadsavedvalues() {

  if (localStorage.hasOwnProperty('deadline') === false) {
    return;
  } else {
    startzeit = new Date (localStorage.getItem("startzeit"));
    deadline = new Date (localStorage.getItem("deadline"));
    var jetzt = new Date();
    if (Date.parse(jetzt) < Date.parse(deadline)) {
      const endzeitclock = document.getElementById('endzeitdiv');
      const hoursSpanEndzeit = endzeitclock.querySelector('.endzeit_hours');
      const minutesSpanEndzeit = endzeitclock.querySelector('.endzeit_minutes')
      hoursSpanEndzeit.innerHTML = ('0' + deadline.getHours()).slice(-2);
      minutesSpanEndzeit.innerHTML = ('0' + deadline.getMinutes()).slice(-2);
      initializeCountdown('countdowndiv', deadline, startzeit);
      initializeClock('clockdiv');
    } else {
      window.localStorage.removeItem('deadline');
      window.localStorage.removeItem('startzeit');
    }
  }
}



//Umsetzung des Resetbuttons
function resetpage() {
  window.localStorage.clear();
  location.reload();
}