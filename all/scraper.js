const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const https = require("https");
const { areJidsSameUser, generateWAMessage, proto } = require("@whiskeysockets/baileys");

// // QUOTE GENERATOR
const getQuote = async () => {
  try {
    const { data } = await axios.get("https://favqs.com/api/qotd");
    return data.quote.body;
  } catch (err) {
    return "Failed to fetch quote";
  }
};

// // TEXT STYLIZER
const styletext = async (text) => {
  const { data } = await axios.get("http://qaz.wtf/u/convert.cgi?text=" + text);
  const $ = cheerio.load(data);
  const styles = [];
  $("table > tbody > tr").each(function () {
    styles.push({
      name: $(this).find("td:nth-child(1) > span").text(),
      result: $(this).find("td:nth-child(2)").text().trim()
    });
  });
  return styles;
};

// // FONT MAPPER
const fontx = (text, style = 1) => {
  const abc = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
  const ehz = {
    1: "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ1234567890"
  };
  return text.toLowerCase().split("").map((char) => {
    const idx = abc.indexOf(char);
    return idx !== -1 ? ehz[style][idx] : char;
  }).join("");
};

// // PIN QUERY
const agent = new https.Agent({
    rejectUnauthorized: true,
    maxVersion: 'TLSv1.3',
    minVersion: 'TLSv1.2'
})

async function getCookies() {
    try {
        const response = await axios.get('https://www.pinterest.com/csrf_error/', { httpsAgent: agent })
        const setCookieHeaders = response.headers['set-cookie']
        if (setCookieHeaders) {
            const cookies = setCookieHeaders.map(cookieString => {
                const cookieParts = cookieString.split(';')
                return cookieParts[0].trim()
            })
            return cookies.join('; ')
        }
        return null
    } catch {
        return null
    }
}

async function pinterest(query) {
    try {
        const cookies = await getCookies()
        if (!cookies) return []

        const url = 'https://www.pinterest.com/resource/BaseSearchResource/get/'
        const params = {
            source_url: `/search/pins/?q=${query}`,
            data: JSON.stringify({
                options: {
                    isPrefetch: false,
                    query: query,
                    scope: "pins",
                    no_fetch_context_on_resource: false
                },
                context: {}
            }),
            _: Date.now()
        }

        const headers = {
            'accept': 'application/json, text/javascript, */*, q=0.01',
            'accept-encoding': 'gzip, deflate',
            'accept-language': 'en-US,en;q=0.9',
            'cookie': cookies,
            'dnt': '1',
            'referer': 'https://www.pinterest.com/',
            'sec-ch-ua': '"Not(A:Brand";v="99", "Microsoft Edge";v="133", "Chromium";v="133"',
            'sec-ch-ua-full-version-list': '"Not(A:Brand";v="99.0.0.0", "Microsoft Edge";v="133.0.3065.92", "Chromium";v="133.0.6943.142"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-model': '""',
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua-platform-version': '"10.0.0"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0',
            'x-app-version': 'c056fb7',
            'x-pinterest-appstate': 'active',
            'x-pinterest-pws-handler': 'www/[username]/[slug].js',
            'x-pinterest-source-url': '/hargr003/cat-pictures/',
            'x-requested-with': 'XMLHttpRequest'
        }

        const { data } = await axios.get(url, { httpsAgent: agent, headers, params })
        return data.resource_response.data.results
            .filter(v => v.images?.orig)
            .map(result => ({
                upload_by: result.pinner.username,
                fullname: result.pinner.full_name,
                followers: result.pinner.follower_count,
                caption: result.grid_title,
                image: result.images.orig.url,
                source: "https://id.pinterest.com/pin/" + result.id,
            }))
    } catch {
        return []
    }
}

// // PIN DL VIA LINK
async function pinDL(url) {
  try {
    const { data } = await axios.get(`https://www.savepin.app/download.php?url=${encodeURIComponent(url)}&lang=en&type=redirect`)
    const $ = cheerio.load(data)
    const downloadLinks = $('a.button.is-success.is-small').map((index, element) => {
      const href = $(element).attr('href')
      const fullUrl = `https://www.savepin.app/${href}`
      const caption = $('div.media-content > div.content > p > strong').text()
      return { desk: caption, url: fullUrl }
    }).get()
    return { status: true, data: downloadLinks }
  } catch (e) {
    const errorMessage = e?.response?.data?.message || e?.message || "Internal server error!"
    throw { status: false, message: errorMessage }
  }
}

// // TT MP3
async function tiktokDl(url) {
	return new Promise(async (resolve, reject) => {
		try {
			let data = []
			function formatNumber(integer) {
				let numb = parseInt(integer)
				return Number(numb).toLocaleString().replace(/,/g, '.')
			}
			
			function formatDate(n, locale = 'en') {
				let d = new Date(n)
				return d.toLocaleDateString(locale, {
					weekday: 'long',
					day: 'numeric',
					month: 'long',
					year: 'numeric',
					hour: 'numeric',
					minute: 'numeric',
					second: 'numeric'
				})
			}
			
			let domain = 'https://www.tikwm.com/api/';
			let res = await (await axios.post(domain, {}, {
				headers: {
					'Accept': 'application/json, text/javascript, */*; q=0.01',
					'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
					'Origin': 'https://www.tikwm.com',
					'Referer': 'https://www.tikwm.com/',
					'Sec-Ch-Ua': '"Not)A;Brand" ;v="24" , "Chromium" ;v="116"',
					'Sec-Ch-Ua-Mobile': '?1',
					'Sec-Ch-Ua-Platform': 'Android',
					'Sec-Fetch-Dest': 'empty',
					'Sec-Fetch-Mode': 'cors',
					'Sec-Fetch-Site': 'same-origin',
					'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
					'X-Requested-With': 'XMLHttpRequest'
				},
				params: {
					url: url,
					count: 12,
					cursor: 0,
					web: 1,
					hd: 1
				}
			})).data.data
			if (res?.duration == 0) {
				res.images.map(v => {
					data.push({ type: 'photo', url: v })
				})
			} else {
				data.push({
					type: 'watermark',
					url: 'https://www.tikwm.com' + res?.wmplay || "/undefined",
				}, {
					type: 'nowatermark',
					url: 'https://www.tikwm.com' + res?.play || "/undefined",
				}, {
					type: 'nowatermark_hd',
					url: 'https://www.tikwm.com' + res?.hdplay || "/undefined"
				})
			}
			let json = {
				status: true,
				title: res.title,
				taken_at: formatDate(res.create_time).replace('1970', ''),
				region: res.region,
				id: res.id,
				durations: res.duration,
				duration: res.duration + ' Seconds',
				cover: 'https://www.tikwm.com' + res.cover,
				size_wm: res.wm_size,
				size_nowm: res.size,
				size_nowm_hd: res.hd_size,
				data: data,
				music_info: {
					id: res.music_info.id,
					title: res.music_info.title,
					author: res.music_info.author,
					album: res.music_info.album ? res.music_info.album : null,
					url: 'https://www.tikwm.com' + res.music || res.music_info.play
				},
				stats: {
					views: formatNumber(res.play_count),
					likes: formatNumber(res.digg_count),
					comment: formatNumber(res.comment_count),
					share: formatNumber(res.share_count),
					download: formatNumber(res.download_count)
				},
				author: {
					id: res.author.id,
					fullname: res.author.unique_id,
					nickname: res.author.nickname,
					avatar: 'https://www.tikwm.com' + res.author.avatar
				}
			}
			resolve(json)
		} catch (e) {
			
		}
	});
}


// // EXPORT EVERYTHING
module.exports = {
  getQuote,
  styletext,
  fontx,
  pinterest,
  pinDL,
  tiktokDl
};