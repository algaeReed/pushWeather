const axios = require("axios");
const { getWeather } = require("./nowWeather");
const minimist = require("minimist");
const getTokenUrl = "https://qyapi.weixin.qq.com/cgi-bin/gettoken";
const sendMessageUrl = "https://qyapi.weixin.qq.com/cgi-bin/message/send";
// const corpid = ""; // Replace with your actual corpid
// const corpsecret = ""; // Replace with your actual corpsecret

const args = minimist(process.argv.slice(2), {
  string: "corpid",
  string: "corpsecret",
});

const corpid = args.corpid;
const corpsecret = args.corpsecret;

if (!corpid && !corpsecret) {
  console.error(
    "corpid and corpsecret must be specified together in the command line arguments list"
  );

  process.exit(1); // Exit with a non-zero status code to indicate an error
}
console.log("corpid:", corpid);

// Function to obtain access token
async function getAccessToken() {
  try {
    const response = await axios.get(
      `${getTokenUrl}?corpid=${corpid}&corpsecret=${corpsecret}`
    );
    return response.data.access_token;
  } catch (error) {
    throw new Error(`Error getting access token: ${error.message}`);
  }
}

function formatTimestamp(
  timestamp,
  locale = "en-US",
  timeZone = "Asia/Shanghai"
) {
  const dateObject = new Date(timestamp);
  return dateObject.toLocaleString(locale, { timeZone });
}

// Function to send the message
async function sendMessage(accessToken) {
  const { now, fxLink } = await getWeather();
  console.log(now);

  const content = `天气状况：${now.text}\n温度：${now.temp}°C\n体感温度：${
    now.feelsLike
  }°C\n风向：${now.windDir}\n风力等级：${now.windScale}\n风速：${
    now.windSpeed
  } km/h\n相对湿度：${now.humidity}%  \n降水量：${now.precip} 毫米\n大气压强：${
    now.pressure
  } 百帕
  \n能见度：${now.vis} 公里  \n云量：${now.cloud ? `${now.cloud}%` : "N/A"}
  \n露点温度：${now.dew || "N/A"}\n更新时间：${formatTimestamp(now.obsTime)}
  \n当前时间：${formatTimestamp(new Date())}\n查看更多：${fxLink}

`;

  console.log(content);

  const messageData = {
    touser: "@all",
    toparty: "@all",
    totag: "@all",
    msgtype: "text",
    agentid: 1000004,
    text: {
      content: `${content}`,
      // - ${formattedDate}
    },
    safe: 0,
    enable_id_trans: 0,
    enable_duplicate_check: 0,
    duplicate_check_interval: 1800,
  };

  const headers = {
    "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(
      `${sendMessageUrl}?access_token=${accessToken}`,
      messageData,
      { headers }
    );
    console.log("Message sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending message:", error.message);
  }
}

// Usage: Obtain access token and send the message
getAccessToken()
  .then((accessToken) => sendMessage(accessToken))
  .catch((error) => console.error(error));
