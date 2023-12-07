//Create Temp data
var temp_h1 = "";               //hour fist character
var temp_h2 = "";               //hour second character
var temp_m1 = "";               //minute fist character
var temp_m2 = "";               //minute second character
var temp_randomColor = "#000";
var jadwal = "";
var daftarKota = "";
var temp_hide = false;

var isAutoHide = true;
var isDynamic = true;

function loadBody() {
    getDaftarKota();
    getJadwalSholat();
    setup();
}

function setup() {
    var bg = localStorage['setBg'] || 'dynamic';
    var dispJadwal = localStorage['dispJadwal'] || 'autohide';
    if (bg == 'static') {
        isDynamic = false;
        document.querySelector('input[value="static"]').checked = true;
    }

    if (dispJadwal == 'standby') {
        isAutoHide = false;
        document.querySelector('input[value="standby"]').checked = true;
    }

    if (!isAutoHide) {
        document.getElementById('jadwal-sholat').style.opacity = '1';
    } else {
        document.getElementById('jadwal-sholat').style.removeProperty('opacity');
    }

    startTime();
}

function startTime() {
    const today = new Date();
    let h = checkTime(today.getHours());        //get hour
    let m = checkTime(today.getMinutes());      //get minute
    let s = checkTime(today.getSeconds());      //get second

    var h1 = h.substring(0, 1);  //hour fist character
    var h2 = h.substring(1);     //hour second character
    var m1 = m.substring(0, 1);  //minute fist character
    var m2 = m.substring(1);     //minute second character

    var display_h1 = h1;        //text display for div id hour1
    var display_h2 = h2;        //text display for div id hour2
    var display_m1 = m1;        //text display for div id minute1
    var display_m2 = m2;        //text display for div id minute2

    var delay_h1 = 0;           //delay to run animation 
    var delay_h2 = 0;           //delay to run animation
    var delay_m1 = 0;           //delay to run animation
    var delay_m2 = 0;           //delay to run animation

    //check current number not same with temporary data number
    if (temp_h1 != h1) {
        display_h1 = '<div class="float-temp">' + temp_h1 + '</div><div class="float-current">' + h1 + '</div>';
        temp_h1 = h1;
    }

    if (temp_h2 != h2) {
        display_h2 = '<div class="float-temp">' + temp_h2 + '</div><div class="float-current">' + h2 + '</div>';
        temp_h2 = h2;
        delay_h1 += 500;       //add 1s of delay
    }

    if (temp_m1 != m1) {
        display_m1 = '<div class="float-temp">' + temp_m1 + '</div><div class="float-current">' + m1 + '</div>';
        temp_m1 = m1;
        delay_h1 += 500;       //add 1s of delay
        delay_h2 += 500;       //add 1s of delay
    }

    if (temp_m2 != m2) {
        display_m2 = '<div class="float-temp">' + temp_m2 + '</div><div class="float-current">' + m2 + '</div>';
        temp_m2 = m2;
        delay_h1 += 500;       //add 1s of delay
        delay_h2 += 500;       //add 1s of delay
        delay_m1 += 500;       //add 1s of delay

    }
    //end check current number

    setTimeout(function () { document.getElementById('hour1').innerHTML = display_h1 }, delay_h1);
    setTimeout(function () { document.getElementById('hour2').innerHTML = display_h2 }, delay_h2);
    setTimeout(function () { document.getElementById('minute1').innerHTML = display_m1 }, delay_m1);
    setTimeout(function () { document.getElementById('minute2').innerHTML = display_m2 }, delay_m2);

    document.title.innerHTML = h + '.' + m;     //set Tittle Page

    if (isDynamic) {
        const randomColor = getRandomRolor();
        document.body.style.backgroundColor = randomColor;
        document.body.animate([
            // key frames
            { backgroundColor: temp_randomColor },
            { backgroundColor: randomColor },
        ], {
            // sync options
            duration: 1500,
        });
        temp_randomColor = randomColor;
    } else {
        document.body.style.backgroundColor = '#000';
    }

    setTimeout(startTime, 15000);
    setJadwalSholat();
}

function getJadwalSholat() {
    const today = new Date();
    let d = checkTime(today.getDate());        //get hour
    let M = checkTime(today.getMonth() + 1);      //get minute
    let Y = checkTime(today.getFullYear());      //get second

    var location = localStorage['currentLocation'] || '1301';
    var date = Y + '/' + M + '/' + d;
    fetch('https://api.myquran.com/v1/sholat/jadwal/' + location + '/' + date)
        .then(response => response.json())
        .then(json => {
            setJadwal(json.data.jadwal);
        })
}

function setJadwal(data) {
    jadwal = data;
    setJadwalSholat(jadwal);
}

function setJadwalSholat() {
    if (jadwal != "") {
        var shubuh = jadwal.subuh.toString();
        var terbit = jadwal.terbit.toString();
        var dhuhur = jadwal.dzuhur.toString();
        var ashar = jadwal.ashar.toString();
        var maghrib = jadwal.maghrib.toString();
        var isya = jadwal.isya.toString();

        const today = new Date();
        let h = checkTime(today.getHours());        //get hour
        let m = checkTime(today.getMinutes());      //get minute
        let s = checkTime(today.getSeconds());      //get second
        if (parseInt(h + m) <= parseInt(shubuh.replace(':', ''))) {
            removeActiveClass();
            document.getElementById('shubuh').parentElement.className += ' blink active';
        } else if (parseInt(h + m) <= parseInt(terbit.replace(':', ''))) {
            removeActiveClass();
            document.getElementById('terbit').parentElement.className += ' blink active';
        } else if (parseInt(h + m) <= parseInt(dhuhur.replace(':', ''))) {
            removeActiveClass();
            document.getElementById('dhuhur').parentElement.className += ' blink active';
        } else if (parseInt(h + m) <= parseInt(ashar.replace(':', ''))) {
            removeActiveClass();
            document.getElementById('ashar').parentElement.className += ' blink active';
        } else if (parseInt(h + m) <= parseInt(maghrib.replace(':', ''))) {
            removeActiveClass();
            document.getElementById('maghrib').parentElement.className += ' blink active';
        } else if (parseInt(h + m) <= parseInt(isya.replace(':', ''))) {
            removeActiveClass();
            document.getElementById('isya').parentElement.className += ' blink active';
        } else {
            removeActiveClass();
        }
        document.getElementById('shubuh').innerHTML = shubuh.replace(':', '.');
        document.getElementById('terbit').innerHTML = terbit.replace(':', '.');
        document.getElementById('dhuhur').innerHTML = dhuhur.replace(':', '.');
        document.getElementById('ashar').innerHTML = ashar.replace(':', '.');
        document.getElementById('maghrib').innerHTML = maghrib.replace(':', '.');
        document.getElementById('isya').innerHTML = isya.replace(':', '.');
    }
}

//remove class active for jadwal sholat box
function removeActiveClass() {
    const elements = document.querySelectorAll('fieldset');
    elements.forEach((element) => {
        element.classList.remove('active');
        element.classList.remove('blink');
    });
}

//get Random dark Color
function getRandomRolor() {
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += Math.floor(Math.random() * 5);
    }
    return color;
}

// add zero in front of numbers < 10
function checkTime(i) {
    if (i < 10) { i = "0" + i };
    return i.toString();
}

function addFooterHover() {
    var checkSetup = document.getElementById('setup').classList.contains('active');
    if ((!temp_hide || checkSetup) && isAutoHide) {
        document.getElementById('jadwal-sholat').style.opacity = '1';
        document.getElementById('setup-button').style.opacity = '1';
        temp_hide = true;
        setTimeout(function () {
            document.getElementById('jadwal-sholat').style.removeProperty('opacity');
            if (!checkSetup) {
                document.getElementById('setup-button').style.removeProperty('opacity');
            }
            temp_hide = false;
        }, 10000);
    }
}

function getDaftarKota() {
    fetch('https://api.myquran.com/v1/sholat/kota/semua')
        .then(response => response.json())
        .then(json => {
            setDaftarKota(json);
        })
}

function setDaftarKota(data) {

    var location = localStorage['currentLocation'] || '0506';
    daftarKota = data;
    var namaKota = daftarKota.find(data => data.id === location).lokasi;
    document.getElementById('setKota').value = namaKota;
}

function searchKota() {

    var keyword = document.getElementById('setKota').value;
    let kota;
    keyword = keyword.toUpperCase();
    if (keyword.length > 2 && keyword.trim() !== "KOTA" && keyword.trim() !== "KOT" && keyword.trim() !== "KAB") {
        kota = daftarKota.filter(data => {
            var lokasi = data.lokasi;
            if (lokasi.indexOf(keyword) > -1) {
                return true;
            } else {
                return false;
            }
        });

    } else {
        kota = [];
    }
    document.getElementById('daftarKota').innerHTML = "";
    if (kota.length > 0) {
        kota.forEach((value) => {
            document.getElementById('daftarKota').innerHTML += "<option value='" + value.lokasi + "'>";
        });
    }
}

function setKota(id) {
    localStorage['currentLocation'] = id;
    getJadwalSholat();
}

function saveConfig() {
    var kota = document.getElementById('setKota').value;
    var idKota = daftarKota.find(data => data.lokasi === kota).id;
    localStorage['setBg'] = document.querySelector('input[name="setBg[]"]:checked').value;
    localStorage['dispJadwal'] = document.querySelector('input[name="setDispJadwal[]"]:checked').value;
    setKota(idKota);
    toggleSetup();
    setup();
}

function toggleSetup() {
    document.getElementById('setup').classList.toggle('active');
}