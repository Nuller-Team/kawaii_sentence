import { serve } from "https://deno.land/std@0.182.0/http/server.ts";

const PORT = 8000;
console.log(`Server running on port ${PORT}`);
// カタカナをひらがなに変換する
function kanaToHira(str) {

  return str.replace(/[\u30a1-\u30f6]/g, function (match) {
    var chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}
const handler = async (req: Request): Promise<Response> => {
  if (req.method === "POST") {
    const formData = await req.formData();
    let input = formData.get("input") ?? "";
    //絵文字のリストを作成
    var emojis = ["👏🏻", "💕", "✨", "👀", "🤦🏻‍♀️", "💞", "🥺", "🫶🏻", "🤭", "💖", "🙈", "🫰🏻", "✌🏻", "🫶🏻",
      "👍 🏻", "😾", "💞"
    ];
    //元の文の文字に関する処理を行う
    let output = input.replace(/[^\u0000-\uFFFF]/g, "") // 絵文字や顔文字を削除
    output = input.replace(/、/g, function (match, offset) {
      return (offset % 10 === 0) ? match : "";
    });
    // 絵文字や顔文字を正規表現で検出して削除
    output = output.replace(
      /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]|！/gu, "");
    output = output.replace(/(\(|（)[^\(\)（）]*(\)|）)/g, "");
    output = output.replace(/w|ｗ+$|草|大草原|くさ+$|www+$/g, "笑笑");
    output = output.replace(/。+$/g, "");
    // カタカナをひらがなに変換する
    output = kanaToHira(output);
    // 文末に「っ!!」か「っ?!」を追加
    var endings = ["っ!!", "っ?!", "笑笑?!", "笑笑"];
    //半角空白を削除する
    output = output.replace(/\s+/g, '');
    // 0から1までのランダムな値を生成
    var rand = Math.random();
    // 0.5未満なら「っ!!」、0.5以上なら「っ?!」を選択
    if (rand < 0.5) {
      var rand = Math.random();
      if (rand < 0.5) {
        if (rand < 0.5) {
          if (rand < 0.5) {
            output += endings[0];
          }
        } else {
          output += endings[1];
        }
      } else {
        output += endings[2]

      }
    } else {
      output += endings[3];
      output += emojis[Math.floor(Math.random() * emojis.length)];
    }

    // 男らしい言い回しを正規表現で削除して、かわいい女子風な言い方に変える
    output = output.replace(/俺|おれ|ｵﾚ|僕|ぼく|おいら|我|おじさん|おぢさん/g, "わたし");
    output = output.replace(/おまえ|お前|てめえ|おめえ|貴様|きさま/g, "あなた");
    output = output.replace(/あいつ|アイツ/g, "あの子");
    //語尾編集
    output = output.replace(/です|なのだ|でございます|でござる|ですわ|であります|である|でっす|でーす|で～す+$/g, "だよ");
    output = output.replace(/ました|ましたん+$/g, "ました～");
    output = output.replace(/ませんか|ましょ|ましょう+$/g, "ましょ～");
    output = output.replace(/しろ+$/g, "してね");
    output = output.replace(/な+$/g, "ね");
    output = output.replace(/しろよ|しろや|しなさい+$/g, "してほしい");
    output = output.replace(/だよ+$/g, "だよ～");
    //言葉遣いを丁寧にする・暴言除去
    output = output.replace(/めんどい|面倒くさい|めんどくさい|だるい/g, "大変");
    output = output.replace(/すごい|凄い/g, "すごい～");
    output = output.replace(/やめろ/g, "やめてね");
    output = output.replace(/嫌い|きらい/g, "いやだなぁ....🤔");
    output = output.replace(/やばい|ヤバイ|やばみ/g, "やば～い");
    output = output.replace(/かっこいい|カッコイイ/g, "かっこいいね～");
    output = output.replace(/せよ+$|せい+$/g, "してくれると嬉しいな～");
    output = output.replace(/れや+$|れ+$|れよ+$/g, "れる");
    output = output.replace(/しね|死ね|死ね|キモい|キモすぎ|きもすぎ|きもい|きめえな|きめえ|きしょい|消えろ|いなくなれ|きえろ|きしょ|きしょいな|殺す/g, "う～ん...");
    output = output.replace(/ふざけんな|ふざけるな|ふざけんなよ/g, "ねえ～笑笑");
    output = output.replace(/るなよ+$|るな+$/g, "らないでくれる");
    // 「漢字」→「ひらがな」に変換する
    output = output.replace(/おはよう|おはよ|お早う/g, "おはよ～🥱");
    output = output.replace(/嬉しい/g, "うれしい");
    output = output.replace(/ありがとう|有難う|有り難う/g, "ありがとー");
    output = output.replace(/確か/g, "たしか");
    output = output.replace(/なるほど/g, "なるほどね");
    output = output.replace(/理解/g, "りかい");
    output = output.replace(/了解/g, "りょうかい");
    output = output.replace(/可愛/g, "かわい");
    output = output.replace(/眠い/g, "ねむい");
    output = output.replace(/楽しい/g, "たのし～");
    output = output.replace(/気持ち/g, "きもち");
    output = output.replace(/大好き/g, "だいすき");
    output = output.replace(/好き|ちゅき/g, "すき");
    output = output.replace(/うんこ|糞|💩/g, "うんち");
    output = output.replace(/悪い/g, "わるい");
    const html = `
    <!DOCTYPE html>
    <html>
    
    <head>
      <meta charset="UTF-8">
      <title>【便利アプリ】かわいいせんてんすっ!!</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css?family=M+PLUS+Rounded+1c&display=swap" rel="stylesheet">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.16/tailwind.min.css">
    </head>
    
    <body class="bg-pink-100 font-sans">
      <div class="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-lg">
        <div class="bg-pink-500 rounded-t-lg px-4 py-2">
          <h1 class="text-white font-bold text-2xl">かわいいせんてんすっ!!<br>（β）</h1>
          <h3 class="text-white font-medium text-sm">かわいい文にする変換あぷりっ!!</h3>
          <h4 class="text-white font-medium text-xs">タップでコピーできるよ</h4>
        </div>
        <div class="px-4 py-2">
          <div class="bg-pink-500 rounded-lg p-2 mb-2">
            <div class="text-white font-bold" id="chats">${output}</div>
          </div>
        </div>
        <form method="POST">
          <div class="px-4 py-2 bg-pink-100 rounded-b-lg">
            <input type="text" name="input" placeholder="メッセージを入力"
              class="bg-white border-2 border-pink-400 rounded-lg py-2 px-4 w-full text-gray-700 font-medium focus:outline-none focus:border-pink-500 mb-2">
            <button type="submit"
              class="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">送信</button>
          </div>
        </form>
      </div>
    </body>
    
    </html>
    <script>
    document.getElementById("chats").addEventListener('click', function () {
      //メッセージコピー処理
      //コンテンツを選択する
      var range = document.createRange();
      range.selectNodeContents(document.getElementById("chats"));
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      //コピーする
      document.execCommand('copy');
      //選択を解除する
      selection.removeAllRanges();
      //コピー成功のメッセージを表示する
      alert('コピーされました！');
  });
    </script>
    <style>
      /* フォントの設定 */
      @import url('https://fonts.googleapis.com/css?family=M+PLUS+Rounded+1c&display=swap');
    
      * {
        font-family: 'M PLUS Rounded 1c', sans-serif;
      }
    </style>`;
    return new Response(html, {
      status: 200,
      headers: {
        "content-type": "text/html",
      },
    });
  } else {
    const html = `
    <!DOCTYPE html>
    <html>
    
    <head>
      <meta charset="UTF-8">
      <title>【便利アプリ】かわいいせんてんすっ!!</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css?family=M+PLUS+Rounded+1c&display=swap" rel="stylesheet">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.16/tailwind.min.css">
    </head>
    
    <body class="bg-pink-100 font-sans">
      <div class="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-lg">
        <div class="bg-pink-500 rounded-t-lg px-4 py-2">
          <h1 class="text-white font-bold text-2xl">かわいいせんてんすっ!!<br>（β）</h1>
          <h3 class="text-white font-medium text-sm">かわいい文にする変換あぷりっ!!</h3>
          <h4 class="text-white font-medium text-xs">タップでコピーできるよ</h4>
        </div>
        <div class="px-4 py-2">
          <div class="bg-pink-500 rounded-lg p-2 mb-2">
            <div class="text-white font-bold">わたしはせかいいち?!かわいいぞぉ🫶🏻</div>
            <div class="text-white text-sm">なにか入力してねっ!!</div>
          </div>
          <div class="bg-pink-500 rounded-lg p-2 mb-2">
            <div class="text-white font-bold">もしかしたら、</div>
            <div class="text-white text-sm">ばぐとか不具合あるから注意してください笑笑?!🤭</div>
          </div>
        </div>
        <form method="POST">
          <div class="px-4 py-2 bg-pink-100 rounded-b-lg">
            <input type="text" name="input" placeholder="メッセージを入力"
              class="bg-white border-2 border-pink-400 rounded-lg py-2 px-4 w-full text-gray-700 font-medium focus:outline-none focus:border-pink-500 mb-2">
            <button type="submit"
              class="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">送信</button>
          </div>
        </form>
      </div>
    </body>
    
    </html>
    <style>
      /* フォントの設定 */
      @import url('https://fonts.googleapis.com/css?family=M+PLUS+Rounded+1c&display=swap');
    
      * {
        font-family: 'M PLUS Rounded 1c', sans-serif;
      }
    </style>`;
    return new Response(html, {
      status: 200,
      headers: {
        "content-type": "text/html",
      },
    });
  }
};

await serve(handler, { port: PORT, body: "text" });
