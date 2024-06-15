global.qrcode = require("qrcode-terminal");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
global.fs = require("fs");

global.client = new Client({
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  authStrategy: new LocalAuth(),
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
  },
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  console.log("Whatsapp Aktif!");
  await sendMsg();
});


client.initialize();


const message = `
Merhaba, bu bir test mesajıdır. Lütfen cevap vermeyiniz.
`;


function checkNumber(number) {
  if(isNaN(number)) return false;
  if(number.length != 12) return false;
  return true;
}


async function sendMsg() {
  const media = await MessageMedia.fromUrl('https://via.placeholder.com/350x150.png');
  let numbers = fs.readFileSync("numbers.txt", "utf-8").split("\n");
  console.log(`Toplam ${numbers.length} numara bulundu!`);
  let sents = [];
  numbers.forEach(async (number) => {
    number = number.trim(); 
    if (sents.includes(number)) return console.log(`Zaten gönderildi: ${number}`);
    if (!checkNumber(number)) return console.log(`Hatalı numara: ${number}`);
    try {
      await client.sendMessage(`${number}@c.us`, media);
      await client.sendMessage(`${number}@c.us`, message);
      sents.push(number);
      console.log(`Mesaj gönderildi: ${number}`);
    } catch (e) {
      console.log(`Mesaj gönderilemedi: ${number}`);
    }
  });
}
