const ip = 'broker.mqtt-dashboard.com';
const port = 8000;
const topic = 'Final06131286';
let client = undefined;

// 發佈訊息
function publishMessage(msg) {
    if (client) {
        const message = new Paho.MQTT.Message(msg);
        message.destinationName = topic;
        client.send(message);
    }
}

function initMqttService() {
    // 建立 MQTT 用戶端實體. 你必須正確寫上你設置的埠號.
    // ClientId 可以自行指定，提供 MQTT broker 認證用
    client = new Paho.MQTT.Client(ip, port, 'Final06131286WebClient');

    // 指定收到訊息時的處理動作
    // 收到訊息時...
    client.onMessageArrived = ({ payloadString }) => {
        console.log('onMessageArrived:' + payloadString);
        if (payloadString.startsWith('setMode:')) {
            const mode = Number(payloadString.split(':')[1]);
            $('#mode-text').html('目前遊玩模式: ' + `<span>${gameMode[mode - 1]}</span>`);
            $(`#gamebord-div > div.row:nth-of-type(${mode}) div.card-header`).click();
        } else if (payloadString.startsWith('mode1:')) {
            const time = payloadString.split(':')[1];
            _updateRecord('mode1', gameMode[0], time + 's');
            _displayFinishText(1);
        } else if (payloadString.startsWith('mode2:')) {
            const [threshold, isWin] = payloadString.split(':')[1].split(',');
            _updateRecord('mode2', gameMode[1],
                `挑戰吹氣${threshold}秒${isWin == 'true' ? '成功' : '失敗'}`);
            _displayFinishText(2);
        } else if (payloadString.startsWith('mode3:')) {
            const count = Number(payloadString.split(':')[1]);
            const thresholds = [1, 3, 5, 8, 11, 15, 20];

            thresholds.some((threshold, i) => {
                if (count < threshold) {
                    _updateRecord('mode3', gameMode[2], `挑戰到第${i}階(最高7階)，總共${count}秒`);
                    return true;
                } else if (i == thresholds.length - 1) {
                    _updateRecord('mode3', gameMode[2], `挑戰到第7階(最高7階)，總共${count}秒`);
                }
            });

            _displayFinishText(3);
        }

        function _updateRecord(doc, mode, result) {
            const collection = 'game-record';
            FirebaseDB.get(collection, doc).then((doc) => {
                const records = doc.records;
                if (records.length >= 30) {
                    FirebaseDB.update(collection, doc, {
                        records: FirebaseDB.arrayRemove(records[0])
                    });
                }
            });

            const date = new Date();
            FirebaseDB.update(collection, doc, {
                records: FirebaseDB.arrayUnion({
                    date: date.getFullDate() + ' ' + date.getFullTime(),
                    mode: mode, result: result
                })
            });
        }

        function _displayFinishText(i) {
            $(`#gamebord-div > div.row:nth-of-type(${i}) .finish-text`).show();
            setTimeout(() => {
                $(`#gamebord-div > div.row:nth-of-type(${i}) .finish-text`).fadeOut({
                    duration: 800
                });
            }, 3000);
        }
    };

    // 連接 MQTT broker
    client.connect({
        // 用戶端成功連接 broker 時...
        onSuccess: () => {
            // 確認連接後，才能訂閱主題
            console.log('onConnect then subscribe topic');
            client.subscribe(topic);
        }
    });
}