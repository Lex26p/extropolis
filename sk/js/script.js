let evenStart;
let evenEnd;
let evenMove;
let evenOut;
let bodyTouch = true;

if ('ontouchstart' in document.documentElement) {
    evenStart = "touchstart";
    evenEnd = "touchend";
    evenMove = "touchmove";
    evenOut = "touchcancel";
} else {
    evenStart = "mousedown";
    evenEnd = "mouseup";
    evenMove = "mousemove";
    evenOut = "mouseout";
}

let key;
const classData = ['btm_mode-off', 'btm_mode-on', 'btm_mode-auto'];
//Уставка температуры
const SetTemp = document.querySelector('.setnemp');
const element = document.querySelector('.scrol');
const strips = document.querySelector('.strips');
let dragging = false;
let draggingQRS = false;
let startX = 0;
let startQRSY = 0;

//Шторы
const qrs1 = document.querySelector('.qrsJS');

//Вентиляция
const fanVentMode = document.querySelector('.btm_VentmodeJS'); // Кнопка режим Вентиляции
const factVentSpeed = document.querySelector('.factSpeedVentJS'); // Фактическая скорость Вентиляции
const SetSpeedVent = document.querySelector('.SetSpeedVentJS'); // Кнопки Уставка скорости Вентиляции

// Проветривание
const vintMode = document.querySelector('.btm_mode-vintJS'); // Кнопки on/off
const moreModesBtmContTime = document.querySelector('.cont-timeJS'); // Кнопки + -
const WintTimeMin = document.querySelector('.wint__time_min'); // Время осталось мин.
const WintTimeSec = document.querySelector('.wint__time_sec'); // Время осталось сек.
const WintTimeO = document.querySelector('.wint__time_o'); // Двоеточие 
const ContOff1 = document.querySelector('.cont_off1'); // Контейнер 1
const ContOff2 = document.querySelector('.cont_off2'); // контейнер 2

// Свет
const light1 = document.querySelector('.lightJS1'); // Свет 1
const light2 = document.querySelector('.lightJS2'); // Свет 2
const light3 = document.querySelector('.lightJS3'); // Свет 3
const light4 = document.querySelector('.lightJS4'); // Свет 4
// Потеря связи
const errorText = document.querySelector('.error_text'); //  попап потеряна связь текст
const popapOffline = document.querySelector('.popup__offline'); //  попап потеряна связь

// инструкция
const popapInfo = document.querySelector('.popup__info'); //  попап инструкция
const BTMinfoOpen = document.querySelector('.btn-info'); //  Открыть попап инструкция
const BTMinfoOff = document.querySelector('.btn-off'); //  Закрыть попап инструкция

// Уставка температуры колесо
element.addEventListener(evenStart, (e) => {
    dragging = true
    startX = e.pageX - Number.parseInt(element.style.backgroundPositionX || 0)
});

element.addEventListener(evenMove, (e) => {
    if (!dragging) return
    if (e.pageX - startX >= 0 && e.pageX - startX <= 240) {
        element.style.backgroundPositionX = `${e.pageX - startX}px`;
        strips.style.transform = `rotateY(${(e.pageX - startX) / 3}deg)`
        SetTemp.innerText = Math.round(28 - (e.pageX - startX) / 24);

    }
});

element.addEventListener(evenEnd, (e) => {
    if (dragging) {
        dragging = false;
        if (Math.round(28 - (e.pageX - startX) / 24) < 29 && Math.round(28 - (e.pageX - startX) / 24) > 17) {
            client.publish(`${Topic['SetTemp']}/on`, `${Math.round(28 - (e.pageX - startX) / 24)}`);
        } else if (Math.round(28 - (e.pageX - startX) / 24) > 28) {
            client.publish(`${Topic['SetTemp']}/on`, `28`);
        } else if (Math.round(28 - (e.pageX - startX) / 24) < 18) {
            client.publish(`${Topic['SetTemp']}/on`, `18`);
        }

    }
});

element.addEventListener(evenOut, (e) => {
    if (dragging) {
        dragging = false;
        if (Math.round(28 - (e.pageX - startX) / 24) < 29 && Math.round(28 - (e.pageX - startX) / 24) > 17) {
            client.publish(`${Topic['SetTemp']}/on`, `${Math.round(28 - (e.pageX - startX) / 24)}`);
        } else if (Math.round(28 - (e.pageX - startX) / 24) > 28) {
            client.publish(`${Topic['SetTemp']}/on`, `28`);
        } else if (Math.round(28 - (e.pageX - startX) / 24) < 18) {
            client.publish(`${Topic['SetTemp']}/on`, `18`);
        }
    }
});

function GetTemp(data) {
    strips.style.transform = `rotateY(${((28 - data) * 24) / 3}deg)`
    SetTemp.innerText = data;
    element.style.backgroundPositionX = `${(28 - data) * 24}px`;
}

const conf = {
    "1-LightOLLD": {
        title: "Все зоны",
        devName: "1-LightOLLD",
        topicOnOff: "/devices/1-LightOLL/controls/OnOff0_0_1",
    },
    "2-LightZ1D": {
        title: "Зал зона 1",
        devName: "2-LightZ1D",
        topicOnOff: "/devices/2-LightZ1/controls/OnOff1_0_0",
    },
    "3-LightZ2D": {
        title: "Зал зона 2",
        devName: "3-LightZ2D",
        topicOnOff: "/devices/3-LightZ2/controls/OnOff1_1_0",
    },
    "4-LightZ3D": {
        title: "Зал зона 2",
        devName: "4-LightZ3D",
        topicOnOff: "/devices/4-LightZ3/controls/OnOff1_2_0",
    },
    "5-LightZOLLD": {
        title: "Зал все зоны",
        devName: "5-LightZOLLD",
        topicOnOff: "/devices/5-LightZOLL/controls/OnOff1_3_0",
    },
    "6-LightH1D": {
        title: "Холл зона 1",
        devName: "6-LightH1D",
        topicOnOff: "/devices/6-LightH1/controls/OnOff1_4_0",
    },
    "7-LightH2D": {
        title: "Холл зона 2",
        devName: "7-LightH2D",
        topicOnOff: "/devices/7-LightH2/controls/OnOff1_5_0",
    },
    "8-LightH3D": {
        title: "Холл зона 3",
        devName: "8-LightH3D",
        topicOnOff: "/devices/8-LightH3/controls/OnOff1_6_0",
    },
    "9-LightHOLLD": {
        title: "Холл все зоны",
        devName: "9-LightHOLLD",
        topicOnOff: "/devices/9-LightHOLL/controls/OnOff1_7_0",
    },
    "10-Light1D": {
        title: "Холл светильник 1",
        devName: "10-Light1D",
        topicOnOff: "/devices/10-Light1/controls/OnOff2_0_0",
    },
    "11-Light2D": {
        title: "Холл светильник 2",
        devName: "11-Light2D",
        topicOnOff: "/devices/11-Light2/controls/OnOff2_1_0",
    },
    "12-Light3D": {
        title: "Холл светильник 3",
        devName: "12-Light3D",
        topicOnOff: "/devices/12-Light3/controls/OnOff2_2_0",
    },
    "13-Light4D": {
        title: "Холл светильник 4",
        devName: "13-Light4D",
        topicOnOff: "/devices/13-Light4/controls/OnOff2_3_0",
    },
    "14-Light5D": {
        title: "Холл светильник 5",
        devName: "14-Light5D",
        topicOnOff: "/devices/14-Light5/controls/OnOff2_4_0",
    },
    "15-Light6D": {
        title: "Холл светильник 6",
        devName: "15-Light6D",
        topicOnOff: "/devices/15-Light6/controls/OnOff2_5_0",
    },
    "16-Light7D": {
        title: "Холл светильник 7",
        devName: "16-Light7D",
        topicOnOff: "/devices/16-Light7/controls/OnOff2_6_0",
    },
    "17-Light8D": {
        title: "Холл светильник 8",
        devName: "17-Light8D",
        topicOnOff: "/devices/17-Light8/controls/OnOff2_7_0",
    },
    "18-Light9D": {
        title: "Холл светильник 9",
        devName: "18-Light9D",
        topicOnOff: "/devices/18-Light9/controls/OnOff3_0_0",
    },
    "19-Light10D": {
        title: "Холл светильник 10",
        devName: "19-Light10D",
        topicOnOff: "/devices/19-Light10/controls/OnOff3_1_0",
    },
    "20-Light11D": {
        title: "Холл светильник 11",
        devName: "20-Light11D",
        topicOnOff: "/devices/20-Light11/controls/OnOff3_2_0",
    },
    "21-Light12D": {
        title: "Зал светильник 12",
        devName: "21-Light12D",
        topicOnOff: "/devices/21-Light12/controls/OnOff3_3_0",
    },
    "22-Light13D": {
        title: "Зал светильник 13",
        devName: "22-Light13D",
        topicOnOff: "/devices/22-Light13/controls/OnOff3_4_0",
    },
    "23-Light14D": {
        title: "Зал светильник 14",
        devName: "23-Light14D",
        topicOnOff: "/devices/23-Light14/controls/OnOff3_5_0",
    },
    "24-Light15D": {
        title: "Зал светильник 15",
        devName: "24-Light15D",
        topicOnOff: "/devices/24-Light15/controls/OnOff3_6_0",
    },
    "25-Light16D": {
        title: "Зал светильник 16",
        devName: "25-Light16D",
        topicOnOff: "/devices/25-Light16/controls/OnOff3_7_0",
    },
    "26-Light17D": {
        title: "Зал светильник 17",
        devName: "26-Light17D",
        topicOnOff: "/devices/26-Light17/controls/OnOff4_0_0",
    },
    "27-Light18D": {
        title: "Зал светильник 18",
        devName: "27-Light18D",
        topicOnOff: "/devices/27-Light18/controls/OnOff4_1_0",
    },
    "28-Light19D": {
        title: "Зал светильник 19",
        devName: "28-Light19D",
        topicOnOff: "/devices/28-Light19/controls/OnOff4_2_0",
    },
    "29-Light20D": {
        title: "Зал светильник 20",
        devName: "29-Light20D",
        topicOnOff: "/devices/29-Light20/controls/OnOff4_3_0",
    },
    "30-Light21D": {
        title: "Зал светильник 21",
        devName: "30-Light21D",
        topicOnOff: "/devices/30-Light21/controls/OnOff4_4_0",
    },
    "31-Light22D": {
        title: "Зал светильник 22",
        devName: "31-Light22D",
        topicOnOff: "/devices/31-Light22/controls/OnOff4_5_0",
    },
    "32-Light23D": {
        title: "Зал светильник 23",
        devName: "32-Light23D",
        topicOnOff: "/devices/32-Light23/controls/OnOff4_6_0",
    },
    "33-Light24D": {
        title: "Зал светильник 24",
        devName: "33-Light24D",
        topicOnOff: "/devices/33-Light24/controls/OnOff4_7_0",
    },
    "34-Light25D": {
        title: "Зал светильник 25",
        devName: "34-Light25D",
        topicOnOff: "/devices/34-Light25/controls/OnOff5_0_0",
    },
    "35-Light26D": {
        title: "Зал светильник 26",
        devName: "35-Light26D",
        topicOnOff: "/devices/35-Light26/controls/OnOff5_1_0",
    },
    "36-Light27D": {
        title: "Зал светильник 27",
        devName: "36-Light27D",
        topicOnOff: "/devices/36-Light27/controls/OnOff5_2_0",
    },
    "37-Light28D": {
        title: "Зал светильник 28",
        devName: "37-Light28D",
        topicOnOff: "/devices/37-Light28/controls/OnOff5_3_0",
    },
    "38-Light29D": {
        title: "Зал светильник 29",
        devName: "38-Light29D",
        topicOnOff: "/devices/38-Light29/controls/OnOff5_4_0",
    },
    "39-Light30D": {
        title: "Зал светильник 30",
        devName: "39-Light30D",
        topicOnOff: "/devices/39-Light30/controls/OnOff5_5_0",
    },
    "40-Light31D": {
        title: "Зал светильник 31",
        devName: "40-Light31D",
        topicOnOff: "/devices/40-Light31/controls/OnOff5_6_0",
    },
    "41-Light32D": {
        title: "Зал светильник 32",
        devName: "41-Light32D",
        topicOnOff: "/devices/41-Light32/controls/OnOff5_7_0",
    },
    "42-Light33D": {
        title: "Зал светильник 33",
        devName: "42-Light33D",
        topicOnOff: "/devices/42-Light33/controls/OnOff6_0_0",
    },
    "43-Light34D": {
        title: "Зал светильник 34",
        devName: "43-Light34D",
        topicOnOff: "/devices/43-Light34/controls/OnOff6_1_0",
    },
    "44-Light35D": {
        title: "Зал светильник 35",
        devName: "44-Light35D",
        topicOnOff: "/devices/44-Light35/controls/OnOff6_2_0",
    },
    "45-GrupHMD": {
        title: "Холл маленькие светильники",
        devName: "45-GrupHMD",
        topicOnOff: "/devices/45-GrupHM/controls/OnOff0_1_1",
    },
    "46-GrupHBD": {
        title: "Холл большие светильники",
        devName: "46-GrupHBD",
        topicOnOff: "/devices/46-GrupHB/controls/OnOff0_2_1",
    },
    "47-GrupZMD": {
        title: "Зал маленькие светильники",
        devName: "47-GrupZMD",
        topicOnOff: "/devices/47-GrupZM/controls/OnOff0_3_1",
    },
    "48-GrupZBD": {
        title: "Зал большие светильники",
        devName: "48-GrupZBD",
        topicOnOff: "/devices/48-GrupZB/controls/OnOff0_4_1",
    },
};

const Topic = {
    'Temp': '/devices/wb-msw-v4_75/controls/Temperature',
    'RH': '/devices/wb-msw-v4_75/controls/Humidity',
    'CO2': '/devices/wb-msw-v4_75/controls/CO2',
    'SetTemp': '/devices/climat/controls/SetTemp',
    'SetmodeClim': '/devices/climat/controls/SetmodeClim',
    'levelSet': '/devices/climat/controls/levelSet',
    'level': '/devices/climat/controls/level',
    'modeClim': '/devices/climat/controls/modeClim',
    'SetSpeedVentZal': '/devices/Torkov_6/controls/SetSpeed',
    'SetSpeedVentHoll': '/devices/Torkov_5/controls/SetSpeed',
    'OnOffVentZal': '/devices/Torkov_6/controls/OnOff',
    'OnOffVentHoll': '/devices/Torkov_5/controls/OnOff',
    'SpeedFan': '/devices/climat/controls/ФактСкорость',
    'SetModeVent': '/devices/Vent/controls/OnOff',
    'SpeedVent': '/devices/Vent/controls/Speed',
    'TopicWintOnOff': '/devices/Климат/controls/ПровРежим',
    'TopicWintSec': '/devices/Климат/controls/ПровВремя',
    '1-LightOLL': '/devices/1-LightOLL/controls/OnOff0_0_1',
    '2-LightZ1': '/devices/2-LightZ1/controls/OnOff1_0_0',
    '3-LightZ2': '/devices/3-LightZ2/controls/OnOff1_1_0',
    '4-LightZ3': '/devices/4-LightZ3/controls/OnOff1_2_0',
    '5-LightZOLL': '/devices/5-LightZOLL/controls/OnOff1_3_0',
    '6-LightH1': '/devices/6-LightH1/controls/OnOff1_4_0',
    '7-LightH2': '/devices/7-LightH2/controls/OnOff1_5_0',
    '8-LightH3': '/devices/8-LightH3/controls/OnOff1_6_0',
    '9-LightHOLL': '/devices/9-LightHOLL/controls/OnOff1_7_0',
    '10-Light1': '/devices/10-Light1/controls/OnOff2_0_0',
    '11-Light2': '/devices/11-Light2/controls/OnOff2_1_0',
    '12-Light3': '/devices/12-Light3/controls/OnOff2_2_0',
    '13-Light4': '/devices/13-Light4/controls/OnOff2_3_0',
    '14-Light5': '/devices/14-Light5/controls/OnOff2_4_0',
    '15-Light6': '/devices/15-Light6/controls/OnOff2_5_0',
    '16-Light7': '/devices/16-Light7/controls/OnOff2_6_0',
    '17-Light8': '/devices/17-Light8/controls/OnOff2_7_0',
    '18-Light9': '/devices/18-Light9/controls/OnOff3_0_0',
    '19-Light10': '/devices/19-Light10/controls/OnOff3_1_0',
    '20-Light11': '/devices/20-Light11/controls/OnOff3_2_0',
    '21-Light12': '/devices/21-Light12/controls/OnOff3_3_0',
    '22-Light13': '/devices/22-Light13/controls/OnOff3_4_0',
    '23-Light14': '/devices/23-Light14/controls/OnOff3_5_0',
    '24-Light15': '/devices/24-Light15/controls/OnOff3_6_0',
    '25-Light16': '/devices/25-Light16/controls/OnOff3_7_0',
    '26-Light17': '/devices/26-Light17/controls/OnOff4_0_0',
    '27-Light18': '/devices/27-Light18/controls/OnOff4_1_0',
    '28-Light19': '/devices/28-Light19/controls/OnOff4_2_0',
    '29-Light20': '/devices/29-Light20/controls/OnOff4_3_0',
    '30-Light21': '/devices/30-Light21/controls/OnOff4_4_0',
    '31-Light22': '/devices/31-Light22/controls/OnOff4_5_0',
    '32-Light23': '/devices/32-Light23/controls/OnOff4_6_0',
    '33-Light24': '/devices/33-Light24/controls/OnOff4_7_0',
    '34-Light25': '/devices/34-Light25/controls/OnOff5_0_0',
    '35-Light26': '/devices/35-Light26/controls/OnOff5_1_0',
    '36-Light27': '/devices/36-Light27/controls/OnOff5_2_0',
    '37-Light28': '/devices/37-Light28/controls/OnOff5_3_0',
    '38-Light29': '/devices/38-Light29/controls/OnOff5_4_0',
    '39-Light30': '/devices/39-Light30/controls/OnOff5_5_0',
    '40-Light31': '/devices/40-Light31/controls/OnOff5_6_0',
    '41-Light32': '/devices/41-Light32/controls/OnOff5_7_0',
    '42-Light33': '/devices/42-Light33/controls/OnOff6_0_0',
    '43-Light34': '/devices/43-Light34/controls/OnOff6_1_0',
    '44-Light35': '/devices/44-Light35/controls/OnOff6_2_0',
    '45-GrupHM': '/devices/45-GrupHM/controls/OnOff0_1_1',
    '46-GrupHB': '/devices/46-GrupHB/controls/OnOff0_2_1',
    '47-GrupZM': '/devices/47-GrupZM/controls/OnOff0_3_1',
    '48-GrupZB': '/devices/48-GrupZB/controls/OnOff0_4_1',
    'Conect': '/devices/Conect/controls/send',
};
const options = {
    hostname: `${window.location.hostname}`,
    protocol: "mqtt",
    path: "/mqtt",
    port: 80
};

const client = mqtt.connect(options);

client.on('connect', function () {
    for (let k in Topic) {
        client.subscribe(Topic[k]);
    }
    console.log('connect')
});

client.on('offline', function () {
    popapOffline.classList.add('popap__open');
    errorText.innerText = "Потеряна связь с контроллером!"
    client.on('connect', function () {
        errorText.innerText = "Связь восстановлена!"
        setTimeout(() => popapOffline.classList.remove('popap__open'), 2000);
        setTimeout(() => location.reload(), 1000);
    });
});

client.on("message", function (topic, payload) {
    if (topic === '/devices/Conect/controls/send') {
        if (+payload > 0) {
            setTimeout(() => client.publish(`/devices/Conect/controls/response/on`, 1), 500);
        }
    } else if (topic === Topic['Temp']) {  // Показываем температуру с датчика
        document.getElementById('Temperature').innerText = (+payload).toFixed(1);
    } else if (topic === Topic['CO2']) {  // Показываем CO2 с датчика
        document.getElementById('CO2').innerText = (+payload).toFixed(0);
    } else if (topic === Topic['RH']) {  // Показываем влажность с датчика
        document.getElementById('Humidity').innerText = (+payload).toFixed(0);
    } else if (topic === Topic['SetTemp']) {  // Показываем уставку температуры
        GetTemp(+payload);
    } else if (topic === Topic['SetmodeClim']) {  // Показываем режим фанкойлов
        if (+payload >= 0 && +payload < 4) {
            for (let i = 0; i < 4; i++) {
                document.getElementById('SetmodeClim').children[i].classList.remove(`btn-fan_act`, `btn-fan_act_off`);
            }
            document.getElementById('SetmodeClim').children[+payload].classList.add(document.getElementById('SetmodeClim').children[+payload].getAttribute('data-class'));
        }
    } else if (topic === Topic['levelSet']) {  // Показываем режим фанкойлов
        if (+payload >= 0 && +payload < 4) {
            for (let i = 0; i < 4; i++) {
                document.getElementById('levelSet').children[i].classList.remove(`btn-fan_act`);
            }
            document.getElementById('levelSet').children[+payload].classList.add(`btn-fan_act`);
        }
    } else if (topic === Topic['level']) {  // 
        document.getElementById('level').innerText = +payload;
    } else if (topic === Topic['modeClim']) {  // 
        if (+payload === 0) {
            document.getElementById('modeClim').innerText = "Охлаж";
        } else if (+payload === 1) {
            document.getElementById('modeClim').innerText = "Нагрев";
        } else if (+payload === 2) {
            document.getElementById('modeClim').innerText = "Выкл";
        }


    } else if (conf[key] != undefined) {
        if (topic === `/devices/${conf[key].devName}/controls/LightR`) {
            if (document.querySelector('.light_input__detailR')) {
                document.querySelector('.light_input__detailR').value = +payload;
            }
            if (document.querySelector('.lightR')) {
                document.querySelector('.lightR').innerText = +payload;
            }
        } else if (topic === `/devices/${conf[key].devName}/controls/LightG`) {
            if (document.querySelector('.light_input__detailG')) {
                document.querySelector('.light_input__detailG').value = +payload;
            }
            if (document.querySelector('.lightG')) {
                document.querySelector('.lightG').innerText = +payload;
            }
        } else if (topic === `/devices/${conf[key].devName}/controls/LightB`) {
            if (document.querySelector('.light_input__detailB')) {
                document.querySelector('.light_input__detailB').value = +payload;
            }
            if (document.querySelector('.lightB')) {
                document.querySelector('.lightB').innerText = +payload;
            }
        } else if (topic === `/devices/${conf[key].devName}/controls/Light`) {
            if (document.querySelector('.light_input__colorRGB')) {
                document.querySelector('.light_input__colorRGB').value = +payload;
            }
            client.unsubscribe(topic);
        } else if (topic === `/devices/${conf[key].devName}/controls/Temperature`) {
            if (document.querySelector('.light_input__colorW')) {
                document.querySelector('.light_input__colorW').value = +payload;
            }
            client.unsubscribe(topic);
        } else if (topic === `/devices/${conf[key].devName}/controls/DimmLivel`) {
            if (document.querySelector('.light_input')) {
                document.querySelector('.light_input').value = +payload;
            }
            if (document.querySelector('.lightLB')) {
                document.querySelector('.lightLB').innerText = +payload;
            }
        } else if (topic === conf[key].topicOnOff) {
            if (document.querySelector('.light_btmJS')) {
                if (+payload === 0) {
                    document.querySelector('.light_btmJS').children[1].classList.add(`btn-fan_act_off`);
                    document.querySelector('.light_btmJS').children[0].classList.remove(`btn-fan_act`);
                } else {
                    document.querySelector('.light_btmJS').children[1].classList.remove(`btn-fan_act_off`);
                    document.querySelector('.light_btmJS').children[0].classList.add(`btn-fan_act`);
                }
            }
        }
    } else if (topic === Topic['SetSpeedVentZal']) {  // Показываем уставку скорости вентиляции
        if (+payload >= 0 && +payload < 4) {
            for (let i = 0; i < 4; i++) {
                console.log();
                document.querySelector('.SetSpeedVentZalJS').children[i].classList.remove(`btn-fan_act`);
            }
            document.querySelector('.SetSpeedVentZalJS').children[+payload].classList.add(`btn-fan_act`);
        }
    } else if (topic === Topic['SetSpeedVentHoll']) {  // Показываем уставку скорости вентиляции
        if (+payload >= 0 && +payload < 4) {
            for (let i = 0; i < 4; i++) {
                console.log();
                document.querySelector('.SetSpeedVentHollJS').children[i].classList.remove(`btn-fan_act`);
            }
            document.querySelector('.SetSpeedVentHollJS').children[+payload].classList.add(`btn-fan_act`);

        }
    } else if (topic === Topic['OnOffVentZal']) {
        document.querySelector(`.OnOffVentZalJS`).classList.remove('btm_mode-on', 'btm_mode-off');
        document.querySelector(`.OnOffVentZalJS`).classList.add(classData[+payload]);
        document.querySelector(`.OnOffVentZalJS`).setAttribute("data-set", `${+!+payload}`);
    } else if (topic === Topic['OnOffVentHoll']) {
        document.querySelector(`.OnOffVentHollJS`).classList.remove('btm_mode-on', 'btm_mode-off');
        document.querySelector(`.OnOffVentHollJS`).classList.add(classData[+payload]);
        document.querySelector(`.OnOffVentHollJS`).setAttribute("data-set", `${+!+payload}`);
    }

    if (topic === Topic[topic.split("/")[2]]) {
        if (document.querySelector(`._${topic.split("/")[2]}`)) {
            if (+payload === 1) {
                document.querySelector(`._${topic.split("/")[2]}`).classList.add("light_ECG_act");
            } else if (+payload === 0) {
                document.querySelector(`._${topic.split("/")[2]}`).classList.remove("light_ECG_act");
            }
        }
    }

    if (topic === "/devices/5-LightZOLL/controls/OnOff1_3_0") {
        if (document.querySelector(`.lightJS1`)) {
            document.querySelector(`.lightJS1`).classList.remove('btm_mode-on', 'btm_mode-off');
            document.querySelector(`.lightJS1`).classList.add(classData[+payload]);
            document.querySelector(`.lightJS1`).setAttribute("data-set", `${+!+payload}`);
        }
    } else if (topic === "/devices/9-LightHOLL/controls/OnOff1_7_0") {
        if (document.querySelector(`.lightJS2`)) {
            document.querySelector(`.lightJS2`).classList.remove('btm_mode-on', 'btm_mode-off');
            document.querySelector(`.lightJS2`).classList.add(classData[+payload]);
            document.querySelector(`.lightJS2`).setAttribute("data-set", `${+!+payload}`);
        }
    }

});


document.querySelector('.page').addEventListener(evenStart, (e) => { // Обработка нажатий
    if (e.target.getAttribute('data-topic')) {
        client.publish(e.target.getAttribute('data-topic'), `${e.target.getAttribute('data-set')}`);
    } else if (e.target.getAttribute('data-light')) {
        key = e.target.getAttribute('data-light');
        console.log(key);
        var html = `<div class="popup-light">
        <span class="cont-light_title">Управление светом, ${conf[key].title}</span>
        <div class="cont-light">
          
          <div class="cont-light_item">
            <span class="light_title">Детальное управление цветом RGB</span>
              <div class="light-input_cont_detail">     
                <input  class="light_input__detailR" type="range" min="0" max="255" value="0" name="range" step="1" data-topic="/devices/${conf[key].devName}/controls/LightR/on" oninput="setLight(this.value,this.getAttribute('data-topic'))" onchange="setLightNum(this.value,this.getAttribute('data-topic'))">
                <span class="title_0" style="pointer-events: none">0</span>
                <span class="title_255" style="pointer-events: none">255</span>
              </div>

              <div class="light-input_cont_detail">     
                <input  class="light_input__detailG" type="range" min="0" max="255" value="0" name="range" step="1" data-topic="/devices/${conf[key].devName}/controls/LightG/on" oninput="setLight(this.value,this.getAttribute('data-topic'))" onchange="setLightNum(this.value,this.getAttribute('data-topic'))">
                <span class="title_0" style="pointer-events: none">0</span>
                <span class="title_255" style="pointer-events: none">255</span>
              </div>

              <div class="light-input_cont_detail">     
                <input  class="light_input__detailB" type="range" min="0" max="255" value="0" name="range" step="1" data-topic="/devices/${conf[key].devName}/controls/LightB/on" oninput="setLight(this.value,this.getAttribute('data-topic'))" onchange="setLightNum(this.value,this.getAttribute('data-topic'))">
                <span class="title_0" style="pointer-events: none">0</span>
                <span class="title_255" style="pointer-events: none">255</span>
              </div>
          </div>

          <div class="cont-light_item">
              <div class="cont-light_status">
                <span class="color_title">Красный (0-255) -</span>
                <span class="color_titleN lightR" id="/devices/${conf[key].devName}/controls/LightR/on">224</span>
              </div>
              <div class="cont-light_status">
                <span class="color_title">Зеленый (0-255) -</span>
                <span class="color_titleN lightG" id="/devices/${conf[key].devName}/controls/LightG/on">224</span>
              </div>
              <div class="cont-light_status">
                <span class="color_title">Синий (0-255) -</span>
                <span class="color_titleN lightB" id="/devices/${conf[key].devName}/controls/LightB/on">224</span>
              </div>
              <div class="cont-light_status">
                <span class="color_title">Яркость (0-100) -</span>
                <span class="color_titleN lightLB" id="/devices/${conf[key].devName}/controls/DimmLivel/on">224</span>
              </div>
              <div class="cont-light_btm light_btmJS">
                <span class="light_btm" data-topic="${conf[key].topicOnOff}/on" data-set="1"><span class="light_btm_title" style="pointer-events: none">Включить</span></span>
                <span class="light_btm" data-topic="${conf[key].topicOnOff}/on" data-set="0"><span class="light_btm_title" style="pointer-events: none">Выключить</span></span>
              </div>
          </div>
        </div>

        <span class="dimm_title">Цвет</span>
        <div class="light-input_cont">     
          <input  class="light_input__colorRGB" type="range" min="0" max="1530" value="0" name="range" step="1" data-topic="/devices/${conf[key].devName}/controls/Light/on" oninput="setLightRGB(this.value,this.getAttribute('data-topic'))" onchange="setLightNum2()">         
        </div>
        <span class="dimm_title">Температура</span>
        <div class="light-input_cont">     
          <input  class="light_input__colorW" type="range" min="0" max="255" value="0" name="range" step="1" data-topic="/devices/${conf[key].devName}/controls/Temperature/on" oninput="setLightDImm(this.value,this.getAttribute('data-topic'))" onchange="setLightNum2()">
        </div>
        <span class="dimm_title">Яркость</span>
        <div class="light-input_cont">     
          <input  class="light_input" type="range" min="0" max="100" value="0" name="range" step="1" data-topic="/devices/${conf[key].devName}/controls/DimmLivel/on" oninput="setLightDImm2(this.value,this.getAttribute('data-topic'))" onchange="setLightNum2()">          
        </div>
        <div class="btm-close" data-lightOff="ee"><span class="btm-close_title" style="pointer-events: none">X</span></div>
      </div>`

        document.querySelector('.popup-lightJS').innerHTML = html;
        document.querySelector('.popup-lightJS').classList.add(`popap__open`);
        client.subscribe(`/devices/${conf[key].devName}/controls/LightR`);
        client.subscribe(`/devices/${conf[key].devName}/controls/LightG`);
        client.subscribe(`/devices/${conf[key].devName}/controls/LightB`);
        client.subscribe(`/devices/${conf[key].devName}/controls/Light`);
        client.subscribe(`/devices/${conf[key].devName}/controls/Temperature`);
        client.subscribe(`/devices/${conf[key].devName}/controls/DimmLivel`);
        client.unsubscribe(conf[key].topicOnOff);
        client.subscribe(conf[key].topicOnOff);
    } else if (e.target.getAttribute('data-lightOff')) {
        document.querySelector('.popup-lightJS').innerHTML = "";
        document.querySelector('.popup-lightJS').classList.remove(`popap__open`);
        client.unsubscribe(`/devices/${conf[key].devName}/controls/LightR`);
        client.unsubscribe(`/devices/${conf[key].devName}/controls/LightG`);
        client.unsubscribe(`/devices/${conf[key].devName}/controls/LightB`);
        client.unsubscribe(`/devices/${conf[key].devName}/controls/Light`);
        client.unsubscribe(`/devices/${conf[key].devName}/controls/Temperature`);
        client.unsubscribe(`/devices/${conf[key].devName}/controls/DimmLivel`);
        key = "";
    } else if (e.target.getAttribute('data-lightMap')) {
        document.querySelector('.popup-lightMapJS').classList.add(`popap__open`);
    } else if (e.target.getAttribute('data-lightMapOff')) {
        document.querySelector('.popup-lightMapJS').classList.remove(`popap__open`);
    } else if (e.target.getAttribute('data-lightReset')) {
        let isReset = confirm("Сбросить настройки светильников?");
        if (isReset) {
            client.publish("/devices/LightReset/controls/Reset/on", `1`);
        }
    }
});

function setLight(data, topic) {
    document.getElementById(`${topic}`).innerText = data;
    client.publish(`/devices/${conf[key].devName}/controls/LightW/on`, 0);
    client.publish(topic, data);
}

function setLightRGB(data, topic) {
    client.publish(topic, data);
}

function setLightDImm(data, topic) {

    client.publish(topic, data);

}

function setLightDImm2(data, topic) {

    client.publish(topic, data);
    document.querySelector('.lightLB').innerText = data;
}

function setLightNum(data, topic) {
    //document.getElementById(`${topic}`).innerText = data;
}

function setLightNum2() {}