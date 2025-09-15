// src/bot.ts
import { Telegraf as Telegraf3 } from "telegraf";

// src/config.ts
import { configDotenv } from "dotenv";
configDotenv();
var APP_ENV = process.env.APP_ENV;
var ADMIN_USER_ID = Number(process.env.ADMIN_USER_ID);
var MONGODB_DATABASE_URL = process.env.MONGODB_DATABASE_URL;
var BOT_TOKEN = process.env.BOT_TOKEN;
var WEBHOOK_DOMAIN = process.env.WEBHOOK_DOMAIN;
var SERVER_PORT = process.env.SERVER_PORT;
var PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH;
var CERTIFICATE_PATH = process.env.CERTIFICATE_PATH;
var CA_BUNDLE_PATH = process.env.CA_BUNDLE_PATH;

// src/bot.ts
import { exit } from "process";

// src/state.ts
var state = /* @__PURE__ */ new Map();
var state_default = state;

// src/handlers/utils/resetState.ts
function resetState(key) {
  if (!key) return;
  state_default.set(key, {
    flow: null,
    step: null,
    account: {
      username: null,
      password: null,
      expiredDay: null,
      vpnProtocol: null,
      ipLimit: null,
      serverDomain: null,
      expiredAt: null
    },
    server: {
      provider: null,
      domain: null,
      auth: null
    }
  });
  console.log("STATE:: Resetted.");
}

// src/models/account.ts
import mongoose from "mongoose";
var AccountSchema = new mongoose.Schema({
  username: String,
  password: String,
  expiredDay: Number,
  vpnProtocol: String,
  ipLimit: Number,
  serverDomain: String,
  expiredAt: {
    type: Date,
    expires: 0
  }
}, { timestamps: true });
var AccountModel = mongoose.model("Account", AccountSchema);
var account_default = AccountModel;

// src/models/server.ts
import mongoose2 from "mongoose";
var serverSchema = new mongoose2.Schema({
  provider: String,
  domain: String,
  auth: String
});
var ServerModel = mongoose2.model("Servers", serverSchema);
var server_default = ServerModel;

// src/handlers/actions/home.ts
import { Markup } from "telegraf";
async function homeHandler(ctx) {
  resetState(ctx.from?.id);
  const totalAccountCreated = await account_default.countDocuments();
  const totalServer = await server_default.countDocuments();
  const messageText = `
Halo ${ctx.from.username}, Selamat datang di Yubisaki (DebuVPN) Store Bot!

\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
Total Account Active : ${totalAccountCreated}
Total Server Added : ${totalServer}
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

Silahkan pilih menu dibawah ini:
            `;
  const messageButton = Markup.inlineKeyboard([
    [
      Markup.button.callback("Buat Akun \u{1F680}", "create_account"),
      Markup.button.callback("Delete Akun \u274C", "delete_account")
    ],
    [
      Markup.button.callback("Renew Akun \u{1F940}", "renew_account"),
      Markup.button.callback("List Server \u{1F4DD}", "list_server")
    ]
  ]);
  if (ctx.callbackQuery) {
    ctx.editMessageText(
      messageText,
      messageButton
    );
    return;
  }
  ctx.reply(
    messageText,
    messageButton
  );
}
function homeAction(bot2) {
  bot2.action("home", (ctx) => {
    ctx.answerCbQuery();
    homeHandler(ctx);
  });
}

// src/handlers/commands/start.ts
function startCommand(bot2) {
  bot2.start((ctx) => {
    homeHandler(ctx);
  });
}

// src/handlers/messages/global.ts
import { message } from "telegraf/filters";

// src/handlers/utils/getDateAfter.ts
function getDateAfter(days, from) {
  const expiresAt = /* @__PURE__ */ new Date();
  expiresAt.setDate(from ? from.getDate() : expiresAt.getDate() + days);
  return expiresAt;
}

// src/handlers/utils/markup/serverButton.ts
import { Markup as Markup2 } from "telegraf";
async function serverButtonMarkup() {
  const servers = await server_default.find();
  const buttons = [];
  for (const server of servers) {
    if (!server.domain) return;
    const serverButton = [Markup2.button.callback(server.domain, server.domain)];
    buttons.push(serverButton);
  }
  buttons.push([Markup2.button.callback("Kembali Ke Home \u{1F3E1}", "home")]);
  return Markup2.inlineKeyboard(buttons);
}

// src/handlers/messages/flows/createAccount.ts
import { Markup as Markup3 } from "telegraf";
async function createAccountMessageFlow(ctx, userState) {
  const { message: message3 } = ctx;
  if (!("text" in message3)) return;
  const userInput = message3.text;
  const messageButtons = Markup3.inlineKeyboard([
    Markup3.button.callback("Batal", "reset")
  ]);
  if (userState.account.vpnProtocol == "ssh" && userState.step == "askUsername") {
    userState.account.username = userInput;
    userState.step = "askPassword";
    ctx.reply("Masukkan Password yang diinginkan", messageButtons);
    return;
  }
  if (userState?.step == "askUsername") {
    userState.account.username = userInput;
    userState.step = "askExpired";
    ctx.reply("Masukkan Day Expired (Hanya Angka)", messageButtons);
    return;
  }
  if (userState.step == "askPassword") {
    userState.account.password = userInput;
    userState.step = "askExpired";
    ctx.reply("Masukkan Day Expired (Hanya Angka)", messageButtons);
    return;
  }
  if (userState?.step == "askExpired") {
    const expired = Number(userInput);
    if (!expired) {
      ctx.reply("Masukkan hanya angka!, masukkan Expired lagi", messageButtons);
      return;
    }
    userState.account.expiredDay = expired;
    userState.account.expiredAt = getDateAfter(expired, null);
    userState.step = "askIpLimit";
    ctx.reply("Masukkan Ip Limit (Hanya Angka)", messageButtons);
    return;
  }
  if (userState?.step == "askIpLimit") {
    const ipLimit = Number(userInput);
    if (!ipLimit) {
      ctx.reply("Masukkan Hanya Angka!, masukkan Ip Limit lagi", messageButtons);
      return;
    }
    userState.account.ipLimit = Number(userInput);
    userState.step = "createAccount";
    const serverMessageButtons = await serverButtonMarkup();
    ctx.reply(`
Konfirmasi informasi berikut

\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
<b>Username</b> : ${userState.account.username} ${userState.account.password ? `
<b>Password</b> : ${userState.account.password}` : ""}
<b>Protocol VPN</b> : ${userState.account.vpnProtocol}
<b>Expired Dalam</b> : ${userState.account.expiredDay} Hari
<b>Ip Limit</b> : ${userState.account.ipLimit}
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

Silahkan pilih server dibawah ini untuk melanjutkan.
        `, { parse_mode: "HTML", ...serverMessageButtons });
  }
}

// src/handlers/utils/markup/homeButton.ts
import { Markup as Markup4 } from "telegraf";
var homeButtonCallback = [
  Markup4.button.callback("Kembali Ke Home \u{1F3E1}", "home")
];
function homeButtonMarkup() {
  return Markup4.inlineKeyboard(homeButtonCallback);
}

// src/handlers/messages/flows/addServer.ts
import { Markup as Markup5 } from "telegraf";
function addServerMessageFlow(ctx, userState) {
  const { message: message3 } = ctx;
  if (!("text" in message3)) return;
  const userInput = message3.text;
  const messageButtons = Markup5.inlineKeyboard([
    Markup5.button.callback("Batal", "reset")
  ]);
  if (userState?.step == "askProvider") {
    userState.server.provider = userInput;
    userState.step = "askDomain";
    ctx.reply("Masukkan Domain", messageButtons);
    return;
  }
  if (userState?.step == "askDomain") {
    userState.server.domain = userInput;
    userState.step = "askAuth";
    ctx.reply("Masukkan Auth", messageButtons);
    return;
  }
  if (userState?.step == "askAuth") {
    userState.server.auth = userInput;
    userState.step = "addServer";
    const messageButtons2 = Markup5.inlineKeyboard([
      [Markup5.button.callback("Konfirmasi \u{1F197}", "konfirmasi")],
      homeButtonCallback
    ]);
    ctx.reply(`
Konfirmasi informasi berikut :

\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
<b>Provider</b> : ${userState.server.provider}
<b>Domain</b> : ${userState.server.domain}
<b>Auth</b> : ${userState.server.auth}
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

Konfirmasi untuk melanjutkan
            `, { parse_mode: "HTML", ...messageButtons2 });
  }
}

// src/handlers/messages/flows/renewAccount.ts
import { Markup as Markup6 } from "telegraf";
async function renewAccountMessageFlow(ctx, userState) {
  const { message: message3 } = ctx;
  if (!("text" in message3)) return;
  const userInput = message3.text;
  const messageButtons = Markup6.inlineKeyboard([
    Markup6.button.callback("Batal", "reset")
  ]);
  if (userState.step == "askExpired") {
    const expired = Number(userInput);
    if (!expired) {
      ctx.reply("Masukkan Hanya Angka!, masukkan Expired lagi", messageButtons);
      return;
    }
    userState.account.expiredDay = expired;
    userState.step = "askIpLimit";
    ctx.reply("Masukkan Ip Limit", messageButtons);
    return;
  }
  if (userState?.step == "askIpLimit") {
    const ipLimit = Number(userInput);
    if (!ipLimit) {
      ctx.reply("Masukkan Hanya Angka!, masukkan Ip Limit lagi", messageButtons);
      return;
    }
    userState.account.ipLimit = ipLimit;
    userState.step = "renewAccount";
    ctx.reply(`
Konfirmasi informasi berikut

\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
<b>Username</b> : ${userState.account.username} ${userState.account.password ? `
<b>Password</b> : ${userState.account.password}` : ""}
<b>Protocol VPN</b> : ${userState.account.vpnProtocol}
<b>Expired Ditambah</b> : ${userState.account.expiredDay} Hari
<b>Ip Limit</b> : ${userState.account.ipLimit}
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

Silahkan Konfirmasi untuk melanjutkan
        `, {
      parse_mode: "HTML",
      ...Markup6.inlineKeyboard([
        [Markup6.button.callback("Konfirmasi \u{1F197}", "konfirmasi")],
        homeButtonCallback
      ])
    });
  }
}

// src/handlers/messages/global.ts
function globalMessage(bot2) {
  bot2.on(message("text"), (ctx, next) => {
    const userState = state_default.get(ctx.from.id);
    if (userState?.flow == "createAccount") createAccountMessageFlow(ctx, userState);
    else if (userState?.flow == "renewAccount") renewAccountMessageFlow(ctx, userState);
    else if (userState?.flow == "addServer") addServerMessageFlow(ctx, userState);
    next();
  });
}

// src/handlers/callbacks/global.ts
import { callbackQuery } from "telegraf/filters";

// src/services/createAccount.ts
async function createAccountService(server, account, callback) {
  console.log("SERVICE:: Preparing saving account to database...");
  const urlServer = `http://${server.domain}:5888/create${account.vpnProtocol}`;
  const urlParameter = `?user=${account.username}${account.vpnProtocol == "ssh" ? `&password=${account.password}` : ""}&exp=${account.expiredDay}&quota=0&iplimit=${account.ipLimit}&auth=${server.auth}`;
  const accountModel = new account_default(account);
  const finalUrl = urlServer + urlParameter;
  console.log(`SERVICE:: Fetching VPN Server to create New Account...
  ${finalUrl}`);
  try {
    const response = await fetch(finalUrl, { method: "GET" });
    console.log(response);
    if (!response.ok) {
      callback(Error("Response Bukan 200OK"));
      return;
    }
    const responseJson = await response.json();
    console.log(JSON.stringify(responseJson));
    if (responseJson["status"] != "success") {
      callback(Error("Server tidak mau membuat akun, pastikan Authentikasi server/Akun benar."));
      return;
    }
    console.log("SERVICE:: Account successfully created in VPN Server");
    const responseObject = {
      provider: server.provider,
      username: responseJson.data["username"],
      password: responseJson.data["password"],
      uuid: responseJson.data["uuid"],
      non_tls: responseJson.data[`${account.vpnProtocol}_nontls_link`],
      tls: responseJson.data[`${account.vpnProtocol}_tls_link`],
      grpc: responseJson.data[`${account.vpnProtocol}_grpc_link`],
      expired: responseJson.data["expired"],
      ip_limit: responseJson.data["ip_limit"]
    };
    callback(responseObject);
    accountModel.save().then(() => {
      console.log("SERVICE:: Account Saved to Database.");
    });
  } catch (e) {
    console.log(`SERVICE:: Error while fetching to server :
  ${e}`);
    callback(Error(`${e}`));
  }
}

// src/templates/createAccount/xrayMessage.ts
function xrayMessageTemplate(responseObject) {
  return `
Pembuatan Akun Berhasil!

\u{1F31F} INFORMASI AKUN \u{1F31F}
\u25C7\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u25C7
\u{1F539} <b>Username :</b> ${responseObject["username"]}
\u{1F539} <b>UUID/Password :</b> ${responseObject["uuid"]}
\u{1F539} <b>Provider :</b> ${responseObject["provider"]}
\u{1F539} <b>Port TLS :</b> 443
\u{1F539} <b>Port HTTP :</b> 80
\u{1F539} <b>Network :</b> Websocket (WS)
\u25C7\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u25C7
\u{1F512} Non TLS :
<blockquote><code>${responseObject["non_tls"]}</code></blockquote>

\u{1F512} TLS :
<blockquote><code>${responseObject["tls"]}</code></blockquote>

\u{1F512} GRPC :
<blockquote><code>${responseObject["grpc"]}</code></blockquote>
\u25C7\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u25C7
\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
\u2502 <b>Expired :</b> ${responseObject["expired"]}
\u2502 <b>Max Device :</b> ${responseObject["ip_limit"]}
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

Selamat menikmati layanan kami \u{1F389}
    `;
}

// src/templates/createAccount/sshMessage.ts
function sshMessageTemplate(responseObject) {
  return `
Pembuatan SSH Berhasil!

\u{1F31F} INFORMASI AKUN \u{1F31F}
\u25C7\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u25C7
\u{1F539} <b>Username :</b> ${responseObject["username"]}
\u{1F539} <b>Password :</b> ${responseObject["password"]}
\u{1F539} <b>Provider :</b> ${responseObject["provider"]}
\u{1F539} <b>Port TLS :</b> 443
\u{1F539} <b>Port HTTP :</b> 80
\u{1F539} <b>Network :</b> Websocket (WS)
\u25C7\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u25C7
\u{1F512} WS Payload :
<blockquote><code>GET / HTTP/1.1[crlf]Host: [host][crlf]Upgrade: Websocket[crlf]Connection: Keep-Alive[crlf][crlf]</code></blockquote>

\u25C7\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u25C7
\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
\u2502 <b>Expired :</b> ${responseObject["expired"]}
\u2502 <b>Max Device :</b> ${responseObject["ip_limit"]}
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

Selamat menikmati layanan kami \u{1F389}
    `;
}

// src/handlers/callbacks/flows/createAccount.ts
async function createAccountCallbackFlow(ctx, callbackQData, userState) {
  const domainServer = callbackQData;
  ctx.editMessageText("Membuat akun...");
  userState.account.serverDomain = domainServer;
  const server = await server_default.findOne({ domain: domainServer });
  if (!server) return;
  createAccountService(server, userState.account, (response) => {
    if (response instanceof Error) {
      ctx.editMessageText(`Pembuatan akun gagal!

Pesan error:
  ${response.message}`, homeButtonMarkup());
      return;
    }
    let finalMessageText;
    if (userState.account.vpnProtocol == "ssh") finalMessageText = sshMessageTemplate(response);
    else finalMessageText = xrayMessageTemplate(response);
    ctx.editMessageText(
      finalMessageText,
      { parse_mode: "HTML" }
    );
    resetState(ctx.from?.id);
  });
}

// src/handlers/utils/filterObj.ts
function filterObj(object) {
  const isEmpty = (value) => value === "" || value === null || value === void 0;
  return Object.fromEntries(
    Object.entries(object).filter(([key, value]) => !isEmpty(value))
  );
}

// src/services/deleteServer.ts
function deleteServerService(server, callback) {
  server_default.deleteOne(filterObj(server)).then(() => {
    callback();
  }).catch((e) => {
    callback(Error(e));
  });
}

// src/handlers/callbacks/flows/deleteServer.ts
function deleteServerCallbackFlow(ctx, callbackQData, userState) {
  userState.server.domain = callbackQData;
  ctx.editMessageText("Menghapus server dari database...");
  deleteServerService(userState.server, (result) => {
    if (result instanceof Error) {
      ctx.editMessageText("Gagal menghapus server dari database", homeButtonMarkup());
      return;
    }
    ctx.editMessageText("Server berhasil dihapus dari database.", homeButtonMarkup());
    resetState(ctx.from?.id);
  });
}

// src/handlers/callbacks/flows/askProtocol/deleteAccount.ts
async function askProtocolDeleteAccountCallbackFlow(ctx, callbackQData, userState) {
  ctx.answerCbQuery();
  userState.step = "askServer";
  userState.account.vpnProtocol = callbackQData;
  ctx.editMessageText(
    "Akun dari server mana yang ingin kamu hapus?",
    await serverButtonMarkup()
  );
}

// src/handlers/callbacks/flows/askProtocol/createAccount.ts
function askProtocolCreateAccountCallbackFlow(ctx, callbackQData, userState) {
  ctx.answerCbQuery();
  userState.step = "askUsername";
  userState.account.vpnProtocol = callbackQData;
  ctx.editMessageText(
    "Masukkan Username",
    homeButtonMarkup()
  );
}

// src/services/deleteAccount.ts
async function deleteAccountService(server, account, callback) {
  const urlServer = `http://${server.domain}:5888/delete${account.vpnProtocol}`;
  const urlParam = `?user=${account.username}&auth=${server.auth}`;
  const accountModel = await account_default.findOne(filterObj(account));
  if (!accountModel) {
    console.log("SERVICE:: Account not found in database. aborted ");
    return;
  }
  const finalUrl = urlServer + urlParam;
  console.log(`SERVICE:: Fetching vpn server to delete account
  ${finalUrl}`);
  try {
    const response = await fetch(finalUrl, { method: "GET" });
    console.log(response);
    if (!response.ok) {
      callback(Error("Response Bukan 200OK"));
      return;
    }
    const responseJson = await response.json();
    console.log(JSON.stringify(responseJson));
    if (responseJson["status"] != "success") {
      callback(Error("Server tidak mau menghapus akun, pastikan Authentikasi server/Akun benar."));
      return;
    }
    console.log("SERVICE:: Account successfully deleted from VPN Server");
    accountModel.deleteOne().then(() => {
      console.log("SERVICE:: Account successfully deleted from database");
      callback();
    }).catch((e) => {
      console.log("SERVICE:: Failed delete account from database");
      callback(Error(`Akun gagal dihapus dari database, namun berhasil dihapus dari Server VPN

Kesalahan : 
${e}`));
    });
  } catch (e) {
    callback(Error(`Gagal terhubung ke server VPN, Proses dibatalkan

Kesalahan : 
${e}`));
  }
}

// src/handlers/callbacks/flows/deleteAccount.ts
async function deleteAccountCallbackFlow(ctx, callbackQData, userState) {
  const server = await server_default.findOne({ domain: userState.account.serverDomain });
  if (!server) return;
  userState.account.username = callbackQData;
  ctx.editMessageText("Menghapus Akun...");
  deleteAccountService(server, userState.account, (result) => {
    if (result instanceof Error) {
      ctx.editMessageText(result.message, homeButtonMarkup());
      return;
    }
    ctx.editMessageText(
      `Akun "${callbackQData}" berhasil dihapus.`,
      homeButtonMarkup()
    );
    resetState(ctx.from?.id);
  });
}

// src/handlers/utils/markup/accountButton.ts
import { Markup as Markup7 } from "telegraf";
async function accountButtonMarkup(vpnProtocol, domainServer) {
  const accounts = await account_default.find({
    vpnProtocol,
    serverDomain: domainServer
  });
  const buttons = [];
  for (const account of accounts) {
    if (!account.username) return;
    buttons.push([Markup7.button.callback(account.username, account.username)]);
  }
  buttons.push([Markup7.button.callback("Kembali Ke Home \u{1F3E1}", "home")]);
  if (buttons.length > 0) {
    return Markup7.inlineKeyboard(buttons);
  }
  return null;
}

// src/handlers/callbacks/flows/askServer/deleteAccount.ts
async function askServerDeleteAccountCallbackFlow(ctx, callbackQData, userState) {
  ctx.answerCbQuery();
  userState.step = "deleteAccount";
  userState.account.serverDomain = callbackQData;
  const buttons = await accountButtonMarkup(userState.account.vpnProtocol, userState.account.serverDomain);
  if (buttons) {
    ctx.editMessageText(
      "Pilih akun yang ingin kamu hapus",
      buttons
    );
    return;
  }
  ctx.editMessageText("Tidak ada akun yang ditemukan.");
}

// src/services/addServer.ts
function addServerService(server, callback) {
  console.log("SERVICE:: Preparing saving server to database...");
  const servermodel = new server_default(server);
  servermodel.save().then(() => {
    console.log("SERVICE:: Server Added to Database");
    callback();
  });
}

// src/handlers/callbacks/flows/addServer.ts
function addServerCallbackFlow(ctx, userState) {
  ctx.editMessageText("Memasukkan server ke database...");
  addServerService(userState.server, (result) => {
    if (result instanceof Error) {
      ctx.editMessageText("Gagal Memasukkan server ke database", homeButtonMarkup());
      return;
    }
    ctx.editMessageText("Server berhasil dimasukken ke database.", homeButtonMarkup());
    resetState(ctx.from?.id);
  });
}

// src/handlers/callbacks/flows/askProtocol/renewAccount.ts
async function askProtocolRenewAccountCallbackFlow(ctx, callbackQData, userState) {
  ctx.answerCbQuery();
  userState.step = "askServer";
  userState.account.vpnProtocol = callbackQData;
  ctx.editMessageText(
    "Akun dari server mana yang ingin kamu perpanjang?",
    await serverButtonMarkup()
  );
}

// src/handlers/callbacks/flows/askServer/renewAccount.ts
async function askServerRenewAccountCallbackFlow(ctx, callbackQData, userState) {
  ctx.answerCbQuery();
  userState.step = "askAccount";
  userState.account.serverDomain = callbackQData;
  const buttons = await accountButtonMarkup(userState.account.vpnProtocol, userState.account.serverDomain);
  if (buttons) {
    ctx.editMessageText(
      "Pilih akun yang ingin kamu perpanjang",
      buttons
    );
    return;
  }
  ctx.editMessageText("Tidak ada akun yang ditemukan.");
}

// src/handlers/callbacks/flows/askAccount/renewAccount.ts
async function askAccountRenewAccountCallbackFlow(ctx, callbackQData, userState) {
  ctx.answerCbQuery();
  userState.step = "askExpired";
  userState.account.username = callbackQData;
  ctx.editMessageText("Masukkan Expired Baru (Hanya Angka)", homeButtonMarkup());
}

// src/services/renewAccount.ts
async function renewAccountService(server, account, callback) {
  const urlServer = `http://${server.domain}:5888/renew${account.vpnProtocol}`;
  const urlParameter = `?user=${account.username}&exp=${account.expiredDay}&quota=0&iplimit=${account.ipLimit}&auth=${server.auth}`;
  const accountModel = await account_default.findOne(filterObj(account));
  if (!accountModel) {
    console.log("SERVICE:: Account not found in database. aborted ");
    return;
  }
  const finalUrl = urlServer + urlParameter;
  console.log(`Fetching VPN Server to Renew Account
  ${finalUrl}`);
  try {
    const response = await fetch(finalUrl, { method: "GET" });
    console.log(response);
    if (!response.ok) {
      callback(Error("Response Bukan 200OK"));
      return;
    }
    const responseJson = await response.json();
    console.log(JSON.stringify(responseJson));
    if (responseJson["status"] != "success") {
      callback(Error("Server tidak mau memperbarui akun, pastikan Authentikasi server/Akun benar."));
      return;
    }
    console.log("SERVICE:: Account successfully renewed in VPN Server");
    const responseObject = {
      provider: server.provider,
      username: responseJson.data["username"],
      password: responseJson.data["password"],
      uuid: responseJson.data["uuid"],
      non_tls: null,
      tls: null,
      grpc: null,
      expired: responseJson.data["exp"],
      ip_limit: responseJson.data["limitip"]
    };
    callback(responseObject);
    accountModel.expiredAt = getDateAfter(account.expiredDay, accountModel.expiredAt);
    accountModel.save().then(() => {
      console.log("SERVICE:: Account Saved to Database.");
    });
  } catch (e) {
    console.log(`SERVICE:: Error while fetching to server :
  ${e}`);
    callback(Error(`${e}`));
  }
}

// src/templates/renewAccount/sshMessage.ts
function sshMessageTemplate2(responseObject) {
  return `
Perpanjangan SSH Berhasil

\u{1F31F} INFORMASI AKUN \u{1F31F}
\u25C7\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u25C7
\u{1F539} <b>Username :</b> ${responseObject["username"]}
\u{1F539} <b>Provider :</b> ${responseObject["provider"]}
\u{1F539} <b>Port TLS :</b> 443
\u{1F539} <b>Port HTTP :</b> 80
\u{1F539} <b>Network :</b> Websocket (WS)
\u25C7\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u25C7
\u{1F512} WS Payload :
<blockquote><code>GET / HTTP/1.1[crlf]Host: [host][crlf]Upgrade: Websocket[crlf]Connection: Keep-Alive[crlf][crlf]</code></blockquote>

\u25C7\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u25C7
\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
\u2502 <b>Expired :</b> ${responseObject["expired"]}
\u2502 <b>Max Device :</b> ${responseObject["ip_limit"]}
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

Selamat menikmati layanan kami \u{1F389}
    `;
}

// src/templates/renewAccount/xrayMessage.ts
function xrayMessageTemplate2(responseObject) {
  return `
Perpanjangan VPN Berhasil

\u{1F31F} INFORMASI AKUN \u{1F31F}
\u25C7\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u25C7
\u{1F539} <b>Username :</b> ${responseObject["username"]}
\u{1F539} <b>Provider :</b> ${responseObject["provider"]}
\u{1F539} <b>Port TLS :</b> 443
\u{1F539} <b>Port HTTP :</b> 80
\u{1F539} <b>Network :</b> Websocket (WS)
\u25C7\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u25C7
\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
\u2502 <b>Expired :</b> ${responseObject["expired"]}
\u2502 <b>Max Device :</b> ${responseObject["ip_limit"]}
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

Selamat menikmati layanan kami \u{1F389}
    `;
}

// src/handlers/callbacks/flows/renewAccount.ts
async function renewAccountCallbackFlow(ctx, callbackQData, userState) {
  const server = await server_default.findOne({ domain: userState.account.serverDomain });
  if (!server) return;
  ctx.editMessageText("Memperpanjang Akun...");
  renewAccountService(server, userState.account, (response) => {
    if (response instanceof Error) {
      ctx.editMessageText(`Perpanjang akun gagal!

Pesan error:
  ${response.message}`, homeButtonMarkup());
      return;
    }
    let finalMessageText;
    if (userState.account.vpnProtocol == "ssh") finalMessageText = sshMessageTemplate2(response);
    else finalMessageText = xrayMessageTemplate2(response);
    ctx.editMessageText(
      finalMessageText,
      { parse_mode: "HTML" }
    );
    resetState(ctx.from?.id);
  });
}

// src/handlers/callbacks/global.ts
function globalCallback(bot2) {
  bot2.on(callbackQuery("data"), (ctx, next) => {
    ctx.answerCbQuery();
    const userState = state_default.get(ctx.from.id);
    const callbackQData = ctx.callbackQuery.data;
    if (!userState) return;
    else if (userState.flow == "createAccount" && userState.step == "askProtocol") askProtocolCreateAccountCallbackFlow(ctx, callbackQData, userState);
    else if (userState.flow == "createAccount" && userState.step == "createAccount") createAccountCallbackFlow(ctx, callbackQData, userState);
    else if (userState.flow == "renewAccount" && userState.step == "askProtocol") askProtocolRenewAccountCallbackFlow(ctx, callbackQData, userState);
    else if (userState.flow == "renewAccount" && userState.step == "askServer") askServerRenewAccountCallbackFlow(ctx, callbackQData, userState);
    else if (userState.flow == "renewAccount" && userState.step == "askAccount") askAccountRenewAccountCallbackFlow(ctx, callbackQData, userState);
    else if (userState.flow == "renewAccount" && userState.step == "renewAccount") renewAccountCallbackFlow(ctx, callbackQData, userState);
    else if (userState.flow == "deleteAccount" && userState.step == "askProtocol") askProtocolDeleteAccountCallbackFlow(ctx, callbackQData, userState);
    else if (userState.flow == "deleteAccount" && userState.step == "askServer") askServerDeleteAccountCallbackFlow(ctx, callbackQData, userState);
    else if (userState.flow == "deleteAccount" && userState.step == "deleteAccount") deleteAccountCallbackFlow(ctx, callbackQData, userState);
    else if (userState.flow == "addServer" && userState.step == "addServer") addServerCallbackFlow(ctx, userState);
    else if (userState.flow == "deleteServer" && userState.step == "deleteServer") deleteServerCallbackFlow(ctx, callbackQData, userState);
    next();
  });
}

// src/handlers/utils/markup/protocolButton.ts
import { Markup as Markup8 } from "telegraf";
function protocolButtonMarkup() {
  const buttons = [
    [Markup8.button.callback("VMESS \u{1F511}", "vmess")],
    [Markup8.button.callback("VLESS \u{1F511}", "vless")],
    [Markup8.button.callback("TROJAN \u{1F511}", "trojan")],
    [Markup8.button.callback("SSH \u{1F511}", "ssh")],
    [Markup8.button.callback("Kembali Ke Home \u{1F3E1}", "home")]
  ];
  return Markup8.inlineKeyboard(buttons);
}

// src/handlers/actions/account/createAccount.ts
function createAccountAction(bot2) {
  bot2.action("create_account", (ctx) => {
    const userState = state_default.get(ctx.from.id);
    if (!userState) return;
    userState.flow = "createAccount";
    userState.step = "askProtocol";
    ctx.editMessageText(
      "Pilih Protocol akun yang ingin kamu buat.",
      protocolButtonMarkup()
    );
  });
}

// src/handlers/actions/reset.ts
function resetAction(bot2) {
  bot2.action("reset", (ctx) => {
    resetState(ctx.from.id);
    ctx.answerCbQuery();
    ctx.reply("Session kamu dihapus.");
  });
}

// src/handlers/actions/server/listServer.ts
import { Markup as Markup9 } from "telegraf";
function listServerAction(bot2) {
  bot2.action("list_server", async (ctx) => {
    let text = "Berikut list server yang tersimpan dalam database kami.\n";
    const servers = await server_default.find();
    servers.map((result, index) => {
      if (!result.domain) return;
      text += `
${index + 1}. ${result.domain}`;
    });
    ctx.editMessageText(
      text,
      Markup9.inlineKeyboard([
        [Markup9.button.callback("Tambah Server \u{1F510}", "add_server")],
        [Markup9.button.callback("Delete Server \u274C", "delete_server")],
        [Markup9.button.callback("Kembali Ke Home \u{1F3E1}", "home")]
      ])
    );
  });
}

// src/handlers/actions/server/addServer.ts
function addServerAction(bot2) {
  bot2.action("add_server", (ctx) => {
    const userState = state_default.get(ctx.from.id);
    if (userState) {
      userState.flow = "addServer";
      userState.step = "askProvider";
    }
    ctx.editMessageText('Masukkan provider Server.\nContoh\n"SG DigitalOcean"\n\nProvider server akan dimasukkan kedalam template message ketika kamu membuat/memperbarui akun VPN', homeButtonMarkup());
  });
}

// src/handlers/actions/server/deleteServer.ts
function deleteServerAction(bot2) {
  bot2.action("delete_server", async (ctx) => {
    const userState = state_default.get(ctx.from.id);
    if (!userState) return;
    userState.flow = "deleteServer";
    userState.step = "deleteServer";
    const buttons = await serverButtonMarkup();
    ctx.editMessageText(
      "Pilih server dibawah ini yang ingin kamu hapus",
      buttons
    );
  });
}

// src/handlers/actions/account/deleteAccount.ts
function deleteAccountAction(bot2) {
  bot2.action("delete_account", (ctx) => {
    const userState = state_default.get(ctx.from.id);
    if (!userState) return;
    userState.flow = "deleteAccount";
    userState.step = "askProtocol";
    ctx.editMessageText(
      "Pilih Protocol akun yang ingin kamu hapus.",
      protocolButtonMarkup()
    );
  });
}

// src/handlers/middlewares/filterUser.ts
import { callbackQuery as callbackQuery2, message as message2 } from "telegraf/filters";
function filterUserMiddleware(bot2) {
  bot2.on(callbackQuery2("data"), (ctx, next) => {
    ctx.answerCbQuery();
    if (ctx.from.id != ADMIN_USER_ID) {
      ctx.editMessageText("Mau ngapain bang? \u{1F602}");
      return;
    }
    next();
  });
  bot2.on(message2("text"), (ctx, next) => {
    if (ctx.from.id != ADMIN_USER_ID) {
      ctx.reply("Mau ngapain bang? \u{1F602}");
      return;
    }
    next();
  });
}

// src/handlers/actions/account/renewAccount.ts
function renewAccountAction(bot2) {
  bot2.action("renew_account", (ctx) => {
    const userState = state_default.get(ctx.from.id);
    if (!userState) return;
    userState.flow = "renewAccount";
    userState.step = "askProtocol";
    ctx.editMessageText(
      "Pilih Protocol akun yang ingin kamu perpanjang.",
      protocolButtonMarkup()
    );
  });
}

// src/registerHandlers.ts
function registerHandlers(bot2) {
  filterUserMiddleware(bot2);
  startCommand(bot2);
  homeAction(bot2);
  resetAction(bot2);
  listServerAction(bot2);
  addServerAction(bot2);
  deleteServerAction(bot2);
  createAccountAction(bot2);
  deleteAccountAction(bot2);
  renewAccountAction(bot2);
  globalMessage(bot2);
  globalCallback(bot2);
}

// src/bot.ts
import mongoose3 from "mongoose";
import express from "express";
import https from "https";
import { readFileSync } from "fs";
if (!BOT_TOKEN || !MONGODB_DATABASE_URL) {
  console.log("ABORTED. Make sure you've set .env correctly");
  exit();
}
var dbURL = MONGODB_DATABASE_URL;
var bot = new Telegraf3(BOT_TOKEN);
var app = express();
registerHandlers(bot);
async function startProduction() {
  if (!WEBHOOK_DOMAIN || !PRIVATE_KEY_PATH || !CERTIFICATE_PATH || !CA_BUNDLE_PATH || !SERVER_PORT) {
    console.log("ABORTED. .ENV IS NOT VALID.");
    return;
  }
  app.use(await bot.createWebhook({ domain: WEBHOOK_DOMAIN }));
  const server = https.createServer({
    key: readFileSync(PRIVATE_KEY_PATH, "utf-8"),
    cert: readFileSync(CERTIFICATE_PATH, "utf-8"),
    ca: readFileSync(CA_BUNDLE_PATH, "utf-8")
  }, app);
  server.listen(SERVER_PORT, () => {
  });
}
function startDevelompent() {
  bot.launch();
}
function main() {
  mongoose3.connect(dbURL).then(() => {
    switch (APP_ENV) {
      case "production":
        startProduction();
      case "development":
        startDevelompent();
    }
    console.log("Bot berjalan...");
  });
}
main();
