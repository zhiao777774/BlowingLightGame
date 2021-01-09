const rendererList = {};
let selfID = undefined;
let preRenderer = undefined,
    currentPage = 1;

(function (global, $) {
    'use strict';

    const Renderer = {};
    global.Renderer = Renderer || {};

    function execRendering(panelTitle, html, callback, ...args) {
        $('#main-div > div').each((i, div) => $(div).hide());

        const $body = $('#main-div').children(`div#main-div-body-${panelTitle}`);
        if ($body.length > 0) {
            $body.show();
        } else {
            $('#main-div').append(`<div id="main-div-body-${panelTitle}"></div>`);
        }
        $('#main-div').children(`div#main-div-body-${panelTitle}`).html(html);

        if (callback && $.isFunction(callback)) {
            if (args.length > 0) callback.call(null, ...args);
            else callback.call();
        }
    }

    Renderer.GameBoard = function () {
        this.rendererID = 'Gameboard';
        const collection = 'game-control';

        this.rendering = function () {
            execRendering(this.rendererID, `
            <h4 style="font-weight: bold; margin-bottom: 20px;">遊戲</h4>
            <div id="gamebord-div" class="scrollbar">
                <div class="row">
                    <div id="mode1-div" class="col-xl-12 col-lg-5">
                        <div class="card shadow mb-4">
                            <!-- Card Header -->
                            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 class="m-0 font-weight-bold text-primary">${gameMode[0]}</h6>
                            </div>
                            <!-- Card Body -->
                            <div class="card-body">
                                <div>
                                    <h5 class="bold" style="display: inline;">最近遊玩結果</h5>
                                    <span class="bold finish-text" style="color: red;">完成遊戲</span>
                                    <table class="table result-table">
                                        <thead>   
                                            <tr> 
                                                <th scope="col">時間</th>
                                                <th scope="col">遊玩結果</th>
                                            </tr>
                                        </thead>
                                        <tbody class="scrollbar"></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div id="mode2-div" class="col-xl-12 col-lg-5">
                        <div class="card shadow mb-4">
                            <!-- Card Header -->
                            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 class="m-0 font-weight-bold text-primary">${gameMode[1]}</h6>
                            </div>
                            <!-- Card Body -->
                            <div class="card-body">
                                <div class="input-group">
                                    <input id="n-threshold" type="text" class="form-control" placeholder="請輸入門檻值(0~100)" aria-label="請輸入門檻值(0~100)">
                                    <div class="input-group-append">
                                        <button id="btnChangeThreshold" class="btn btn-primary">更改</button>
                                        <span id="text-threshold" class="btn disabled bold">現有門檻值</span>
                                    </div>
                                </div>
                                <hr />
                                <div>
                                    <h5 class="bold" style="display: inline;">最近遊玩結果</h5>
                                    <span class="bold finish-text" style="color: red;">完成遊戲</span>
                                    <table class="table result-table">
                                        <thead>   
                                            <tr> 
                                                <th scope="col">時間</th>
                                                <th scope="col">遊玩結果</th>
                                            </tr>
                                        </thead>
                                        <tbody class="scrollbar"></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div id="mode3-div" class="col-xl-12 col-lg-5">
                        <div class="card shadow mb-4">
                            <!-- Card Header -->
                            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 class="m-0 font-weight-bold text-primary">${gameMode[2]}</h6>
                            </div>
                            <!-- Card Body -->
                            <div class="card-body">
                                <div>
                                    <h5 class="bold" style="display: inline;">最近遊玩結果</h5>
                                    <span class="bold finish-text" style="color: red;">完成遊戲</span>
                                    <table class="table result-table">
                                        <thead>   
                                            <tr> 
                                                <th scope="col">時間</th>
                                                <th scope="col">遊玩結果</th>
                                            </tr>
                                        </thead>
                                        <tbody class="scrollbar"></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `);

            FirebaseDB.onSnapshot(collection, () => _selectThreshold());

            $('#gamebord-div > div.row div.card-header').click(function () {
                $('#gamebord-div > div.row > div').removeClass('active');
                $(this).parent().parent().addClass('active');

                const currentMode = $(this).parent().parent().parent().index() + 1;
                $('#mode-text').html('目前遊玩模式: ' +
                    `<span>${gameMode[currentMode - 1]}</span>`);
                publishMessage('setModeToClient:' + currentMode);
                /*$.get('/chageMode?mode=' + currentMode, (resp) => {
                    console.log(resp.error ? '失敗' : '成功');
                });*/
            });
            $('#gamebord-div > div.row:nth-of-type(1) div.card-header').click();

            FirebaseDB.onSnapshot('game-record', () => _selectRecords());

            function _selectRecords() {
                $('table.result-table tbody').empty();
                FirebaseDB.get('game-record').then((docs) => {
                    let i = 1;
                    docs.forEach((doc) => {
                        const records = doc.data().records;
                        if (records.length) {
                            const { date, result } = records[records.length - 1];
                            $(`#gamebord-div > div.row:nth-of-type(${i++}) ` +
                                'table.result-table tbody').append(`
                                <tr>
                                    <td>${date}</td>
                                    <td>${result}</td>
                                </tr>
                                `);
                        }
                    });
                });
            }

            $('#btnChangeThreshold').click(() => {
                const threshold = Number($('#n-threshold').val());
                if (!threshold) {
                    alert('請輸入欲更改的值');
                    return;
                }

                publishMessage('setThreshold:' + threshold);
                FirebaseDB.update(collection, 'mode2', { threshold })
                    .then(() => {
                        alert('更改成功!');
                        $('#n-threshold').val('');
                    });
            });

            $('#n-threshold').keyup((e) => {
                e = e.target;

                if (!/^\d+$/.test(e.value)) {
                    $(e).val(/^\d+/.exec($(e).val()));
                } else if (e.value <= 0 || e.value > 100) {
                    $(e).val('');
                }

                return false;
            });

            $('.finish-text').hide();

            function _selectThreshold() {
                FirebaseDB.get(collection).then((docs) => {
                    docs.forEach((doc) => {
                        const data = doc.data();
                        const threshold = data && data.threshold;
                        $('#text-threshold').text(`現有門檻值: ${threshold}`);
                    });
                });
            }
        };

        this.empty = function () {

        };
    };

    Renderer.GameRecord = function () {
        this.rendererID = 'GameRecord';
        const collection = 'game-record';

        this.rendering = function () {
            execRendering(this.rendererID, `
            <div>
                <h4 style="font-weight: bold; margin-bottom: 20px;">遊玩紀錄</h4>
                <table id="game-record-table" class="table scrollable">
                    <thead>   
                        <tr> 
                            <th scope="col">#</th>
                            <th scope="col">新增日期</th>
                            <th scope="col">遊玩模式</th>
                            <th scope="col">遊玩結果</th>
                        </tr>
                    </thead>
                    <tbody class="scrollbar"></tbody>
                </table>
            </div>
            `);

            FirebaseDB.onSnapshot(collection, () => _selectRecords());

            function _selectRecords() {
                FirebaseDB.get(collection).then((docs) => {
                    let count = 1;
                    $('#game-record-table tbody').empty();
                    docs.forEach((doc) => {
                        doc.data().records.forEach((d) => {
                            const { date, mode, result } = d;
                            $('#game-record-table tbody').append(`
                            <tr>
                                <td>${count++}</td>
                                <td>${date}</td>
                                <td>${mode}</td>
                                <td>${result}</td>
                            </tr>
                            `);
                        });
                    });
                });
            }
        };

        this.empty = function () {

        };
    };

    Renderer.GameBattle = function () {
        this.rendererID = 'GameBattle';
        const collection = 'game-battle';

        this.rendering = function () {
            execRendering(this.rendererID, `
            <div>
                <h4 style="font-weight: bold; margin-bottom: 20px;">雙人對決</h4>
                <div class="input-group">
                    <input id="n-self-code" type="text" class="form-control" placeholder="請輸入編號" aria-label="請輸入編號">
                    <div class="input-group-append">
                        <button id="btnConfirmCode" class="btn btn-success">確定</button>
                    </div>
                </div>
                <div class="input-group" style="margin-top: 20px;">
                    <input id="n-battle-code" type="text" class="form-control" placeholder="請輸入對手編號" aria-label="請輸入對手編號">
                    <div class="input-group-append">
                        <button id="btnPair" class="btn btn-danger">配對</button>
                    </div>
                </div>
                <label id="pair-text" class="bold" style="margin-top: 15px"></label>
                <hr />
            </div>
            `);

            $('#btnConfirmCode').click(function () {
                const id = $('#n-self-code').val();
                if (!id) {
                    alert('請輸入編號');
                    return;
                }

                FirebaseDB.add(collection, { id }).then(() => {
                    selfID = id;
                    alert('成功');
                    $('#n-self-code').attr('disabled', true);
                    $(this).attr('disabled', true);
                });
            });

            $('#btnPair').click(function () {
                if (!selfID) {
                    alert('請先設定自己的編號');
                    return;
                }

                const id = $('#n-battle-code').val();
                if (!id) {
                    alert('請輸入對手編號');
                    return;
                }

                FirebaseDB.ref(collection)
                    .where('id', '==', id)
                    .get().then((users) => {
                        if (users.size > 0) {
                            users.forEach((user) => {
                                user.ref.update({
                                    pair: selfID
                                }).then(() => {
                                    alert('配對成功');
                                    user.ref.get().then((d) => {
                                        const opponentID = d.data().id;
                                        $('#pair-text').text(`配對: ${selfID} <-> ${opponentID}`);
                                    }); 
                                });
                            });

                            return;
                        }

                        alert('對手不存在');
                    });
            });
        };

        this.empty = function () {

        };
    };
})(window, jQuery);