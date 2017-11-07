(function() {
    "use strict";
    kintone.events.on('app.record.index.show', function(event) {
        if (event.viewId !== 5299939) {
            return;
        }
        if (document.getElementById('my_index_button') !== null) {
            return;
        }
        //変数の定義
        var records = event.records;
        var rec_rength = records.length;
        var name, expense, date, Contents, amount, Payment, _payment_due_date = "";
        var product, subtotal = "";


        var myIndexButton = document.createElement('button');
        myIndexButton.id = 'my_index_button';
        myIndexButton.innerHTML = '経費精算CSV出力';

        // ボタンクリック時の処理
        myIndexButton.onclick = function() {
            //csvの配列
            csvExport(records);
            UpdateFlg(records);
            //alert("CSV出力が完了しました");
        };

        kintone.app.getHeaderMenuSpaceElement().appendChild(myIndexButton);
    });
})();


//csvファイルの作成
function csvExport(records){

  var accountCodes = {
    "広告宣伝費":"6113",
    "新聞図書費":"6114",
    "発送配達費":"6115",
    "旅費交通費":"6133",
    "諸会費":"6134",
    "事務用消耗品費":"6217",
    "電話等通信費":"6218",
    "租税公課":"6221",
    "備品・消耗品費":"6225",
    "交通費":"6133",
    "雑費":"5467",
    "地代家賃":"6215",
    "水道光熱費":"6219",
    "機械・装置":"1213",
    "会議費":"6111",
    "交際費":"6223",
    "交際費(5000円以下)":"6112",
    "支払手数料":"6232",
    "厚生費":"6226",
    "外注費":"6212",
    "ｺﾐｯｼｮﾝ料":"5214",
    "SaaS代":"6331",
    "郵便代":"6332",
    "工具・器具・備品":"1216",
    "ﾘｰｽ料":"6334",
    "預り金":"2117",
    "支払報酬":"6235",
    "研修費":"6660",
    "仮払金":"1156",
    "雑収入":"7118",
    "保険料":"6224",
    "立替金":"1155",
    "ｿﾌﾄｳｪｱ(ﾉｰﾘﾂ)":"1240",
    "(10万以上) 工具・器具":"1216",
    "イベント費":"6115",
  };
  var genka = {
    "外注費":"6212",
    "広告宣伝費":"6113",
    "ｺﾐｯｼｮﾝ料":"5214",
    "SaaS代":"6331",
    "仕入外注費":"6332"
  };
  var deposits = {
    "預り金":"2117",
    "仮払金":"1156"
  };
  var payers = {
    "倉貫":"1",
    "藤原":"2",
    "中谷":"3",
    "小口現金":"",
    "":""
  }

  var csv = [];
  //現在のレコード情報を取得
  csv += ['処理区分', 'データID', '伝票日付', '伝票番号', '入力日付', '借方・科目','補助コード','部門コード','取引先コード','取引先名','税種別','事業区分','税率','内外別記','金額','税額','摘要','貸方・科目','補助コード','部門コード','取引先コード','取引先名','税種別','事業区分','税率','内外別記','金額','税額','摘要',  '\n'];
  //1行目の項目名は手動で設ける必要がある
  for (var i = 0; i < records.length; i++) {

        var arry_expense = records[i]['expense']['value'].split(":");
        // 1 処理区分
        csv += "1" + ',';
        // 2 データID
        csv += "" + ',';
        // 3 伝票日付
        csv += records[i]['date']['value'] + "" + ',';
        // 4 伝票番号
        csv += "" + ',';
        // 5 入力日付
        csv += "" + ',';
        //--------------------------借方
        // 6 借方・科目
        csv += arry_expense[1] + ',';
        // 7 補助コード
        if(arry_expense[0] == "外注費") {
          csv += "13" + ',';
        }
        else{
          csv += "" + ',';
        }
        // 8 部門コード
        csv += "" + ',';
        // 9 取引先コード
        csv += "" + ',';
        // 10 取引先名
        csv += "" + ',';
        // 11 税種別
        if(genka[arry_expense[0]] == undefined) {
          // 原価ではない経費は60
          csv += "60" + ',';
        } else {
          // 原価は50
          csv += "50" + ',';
        }
        // 12 事業区分
        csv += "1" + ',';
        // 13 税率
        csv += "8" + ','; // 税率8%
        // 14 内外別記
        csv += "1" + ','; // 内税表記は1
        // 15 金額
        csv += records[i]['amount']['value'] + "" + ',';
        // 16 税額
        csv += "" + ',';
        // 17 摘要
        csv += records[i]['Contents']['value'] + ":" + records[i]['Payment']['value'] + ',';
        //--------------------------貸方
        // 18 貸方・科目（小口現金の場合は1118）
        if(arry_expense[0] == "小口現金") {
          csv += "1118" + ',';
        } else {
          csv += "2114" + ',';
        }
        // 19 補助コード
        var payer_code = payers[records[i]['name']['value']];
        if ( payer_code == undefined ) {
          payer_code = "";
        }
        csv += payer_code + ',';
        // 20 部門コード
        csv += "" + ',';
        // 21 取引先コード
        csv += "" + ',';
        // 22 取引先名
        csv += "" + ',';
        // 23 税種別
        if(genka[arry_expense[0]] == undefined) {
          // 原価ではない経費は60
          csv += "60" + ',';
        } else {
          // 原価は50
          csv += "50" + ',';
        }
        // 24 事業区分
        csv += "1" + ',';
        // 25 税率
        csv += "8" + ','; // 税率8%
        // 26 内外別記
        csv += "1" + ','; // 内税表記は1
        // 27 金額
        csv += records[i]['amount']['value'] + ',';
        // 28 税額
        csv += "" + ',';
        // 29 摘要
        csv += records[i]['Contents']['value'] + ":" + records[i]['Payment']['value'] + '\n';

        //csv += expense + ',' + Contents + ',' + amount + ',' + Payment + ',' + date +  ',' + name +  '\n';
   }
   downloadFile(csv);
}

//ダウンロード関数
function downloadFile(csv) {
   //ファイル名
   var filename = '未払計上仕訳_' + getTimeStamp() + '.csv';

   //Blob準備
   var str_array = ECL.charset.Unicode.parse(csv);
   var sjis_array = ECL.charset.convert_array(str_array, "SJIS");
   var uint8_array = new Uint8Array(sjis_array);
   var blob = new Blob([uint8_array], { type: "text/csv;" });

   //var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
   //var blob = new Blob([bom, csv], {type: 'text/csv'});

   if (window.navigator.msSaveBlob) {
       window.navigator.msSaveBlob(blob, filename);
   } else {
       var url = (window.URL || window.webkitURL);
       var blobUrl = url.createObjectURL(blob);
       var e = document.createEvent('MouseEvents');
       e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
       var a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
       a.href = blobUrl;
       a.download = filename;
       a.dispatchEvent(e);
   }
}

//ファイル名に付与する日付の取得
function getTimeStamp() {
    var d = new Date();
    var YYYY = d.getFullYear();
    var MM = (d.getMonth() + 1);
    var DD = d.getDate();
    var hh = d.getHours();
    var mm = d.getMinutes();
    if (MM < 10) { MM = '0' + MM; }
    if (DD < 10) { DD = '0' + DD; }
    if (hh < 10) { hh = '0' + hh; }
    else if (mm < 10) { mm = '0' + mm; }
    String();
    return '' + YYYY + MM + DD;
}
//済の更新
function UpdateFlg(records) {
   //1行目の項目名は手動で設ける必要がある
   for (var i = 0; i < records.length; i++) {
      var body = {
          "app": 15,
          "id": records[i].レコード番号.value,
          "record": {
              "ExportCSV": {
                  "value": ["済"]
              }
          }
      };

      kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', body, function(resp) {
          // success
          console.log(resp);
      }, function(error) {
          // error
          console.log(error);
      });
   }
}

