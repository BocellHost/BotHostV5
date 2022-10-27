const axios = require('axios')
const cheerio = require('cheerio')
const fetch = require('node-fetch')

function convertAngka(number) {
    const data = String(number).split('').reverse()
    let combine = ''
    for (let i = 0; i < data.length; i++) {
        if ((i + 1) % 3 == 0 && i != data.length - 1) {
            data[i] = `.${data[i]}`
        }
    }
    combine = `${data.reverse().join('')}`
    return combine
}

function isUrl(Link) {
	return Link.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
}

function tiktokDownloader (url) {
	return new Promise (async (resolve, reject) => {
		try {
			let RegToktok = isUrl(url)
			if (!RegToktok) return reject(new Error(String('Url Invalid')))
			const data = await axios({
				url: RegToktok[0],
				method: "GET",
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
					'cookie': 'sid_tt=021dd2f991868d857c31a4eb8ce74d64; tt_webid_v2=6986512619529563819; ttwid=1|ADZt9XggC6al3qh457Ie3Y4-VzexMv2QYucx2rkPgvM|1630308410|cf653ef11135c4f47ddaf92d2ec6752a4077f9fac0aecebc42e3fffa6c3152ea; tt_csrf_token=xAyN3gPKcb1b_jzJedr5G21B'
				}
			})
			const getNowm = await axios.request({
				url: "https://ttdownloader.com/",
				method: "GET",
				headers: {
					"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
					"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
				}
			})
			const c = cheerio.load(getNowm.data)
			const token = c("#token").attr('value')
			if (!token) return
			const format = {
				url: RegToktok[0],
				format: "",
				token
			}
			const post = await axios({
				url: "https://ttdownloader.com/req/",
				method: "POST",
				headers: {
					"accept": "*/*",
					"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
					"cookie": getNowm.headers["set-cookie"][0]
				},
				data: new URLSearchParams(Object.entries(format))
			})
			const ch = cheerio.load(post.data)
			const FormatPost = {
				nowm: ch("#results-list > div:nth-child(2)").find("div.download > a").attr('href'),
				wm: ch("#results-list > div:nth-child(3)").find("div.download > a").attr('href'),
				audio: ch("#results-list > div:nth-child(4)").find("div.download > a").attr("href")
			}
			const $ = cheerio.load(data.data)
			const res = $('body').find('#__NEXT_DATA__').get()[0].children[0]
			const result = JSON.parse(res.data).props.pageProps.itemInfo.itemStruct
			const Format = {
				id: result.id,
				desk: result.desc,
				tanggal_buat: new Date(Number(result.createTime) * 1000).toLocaleString("id", {
					year: "numeric",
					month: "short",
					weekday: 'short',
					hour: 'numeric',
					minute: 'numeric',
					day: "numeric"
				}),
				durasi: result.video.duration + " Detik",
				resolusi: result.video.ratio,
				url_with_watermark: result.video.downloadAddr,
				thumbnail: result.video.cover,
				format: result.video.format,
				username: result.author.uniqueId,
				nickname: result.author.nickname,
				foto_profil: result.author. avatarLarger,
				verify: result.author.verified,
				music: {
					...result.music
				},
				statistic: {
					...result.stats
				},
				video_private: result.privateItem,
				duetEnabled: result.duetEnabled,
				stitchEnabled: result. stitchEnabled,
				...FormatPost
			}
			return resolve(Format)
		} catch (err) {
			return reject(new Error(String(err)))
		}
	})
}

function instaDownloader (url) {
	return new Promise (async (resolve, reject) => {
		const RegPost = /(?:http(?:s|):\/\/|)(?:www\.|)instagram.com\/p\/([-_0-9A-Za-z]{5,18})/gi.exec(url)
		const RegReels = /(?:http(?:s|):\/\/|)(?:www\.|)instagram.com\/reel\/([-_0-9A-Za-z]{5,18})/gi.exec(url)
		const RegIgTv = /(?:http(?:s|):\/\/|)(?:www\.|)instagram.com\/tv\/([-_0-9A-Za-z]{5,18})/gi.exec(url)
		const RegIgUs = /(?:http(?:s|):\/\/|)(?:www\.|)instagram.com\/([-_0-9A-Za-z]{5,18})/gi.exec(url)
		try {
			if (RegIgUs) {
                let BaseUrlReel = "https://www.instagram.com/"
				const data = await axios({
					url: BaseUrlReel + RegIgUs[1] + "/?__a=1",
					method: "GET",
					headers: {
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
						'cookie': 'crsftoken=nm20rJm2jFpkXUquLKw0c4qwdEArdPhg; ds_user_id=37572608640; ig_did=54AA06C9-3A86-4F53-A7F6-C9127DC153AC; ig_nrcb=1; mid=YU0dFwALAAHPggeAvlvEiV8DP9zM; sessionid=37572608640%3AdLIYIrAwso2GpN%3A8;'
					}
				})
                const Format = {
					link: data.data.graphql.user.profile_pic_url_hd,
                    caption: {
                        full_name: data.data.graphql.user.full_name,
                        user_name: data.data.graphql.user.username,
                        user_id: data.data.graphql.user.id,
                        followers: convertAngka(Number(data.data.graphql.user.edge_follow.count)),
                        following: convertAngka(Number(data.data.graphql.user.edge_followed_by.count)),
                        bussines: data.data.graphql.user.is_business_account,
                        profesional: data.data.graphql.user.is_professional_account,
                        verified: data.data.graphql.user.is_verified,
                        private: data.data.graphql.user.is_private,
                        biography: data.data.graphql.user.biography,
                        bio_url: data.data.graphql.user.external_url,
                        profile_ed: data.data.graphql.user.profile_pic_url,
                        profile_hd: data.data.graphql.user.profile_pic_url_hd
                    }
                }
                return resolve(Format)
            } else if (RegPost) {
				let BaseUrlPost = `https://www.instagram.com/p/`
				const data = await axios({
					url: BaseUrlPost + RegPost[1] + "/?__a=1",
					method: "GET",
					headers: {
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
						'cookie': 'crsftoken=nm20rJm2jFpkXUquLKw0c4qwdEArdPhg; ds_user_id=37572608640; ig_did=54AA06C9-3A86-4F53-A7F6-C9127DC153AC; ig_nrcb=1; mid=YU0dFwALAAHPggeAvlvEiV8DP9zM; sessionid=37572608640%3AdLIYIrAwso2GpN%3A8;'
					}
				})
				const getData = []
				for (let result of data.data.graphql.shortcode_media.display_resources) {
					getData.push({ url: result.src })
				}
				const format = {
					link: data.data.graphql.shortcode_media.video_url || getData[0].url,
                    link_two: getData[1].url || '',
                    link_three: getData[2].url || '',
					caption: {
                        username: data.data.graphql.shortcode_media.owner.username,
                        total_like: convertAngka(Number(data.data.graphql.shortcode_media.edge_media_preview_like.count)),
                        total_comment: convertAngka(Number(data.data.graphql.shortcode_media.edge_media_preview_comment.count)),
                        desc: data.data.graphql.shortcode_media.edge_media_to_caption.edges[0].node.text,
                        link_array: getData
                    }
				}
				return resolve(format)
			} else if (RegReels) {
				let BaseUrlReel = "https://www.instagram.com/reel/"
				const data = await axios({
					url: BaseUrlReel + RegReels[1] + "/?__a=1",
					method: "GET",
					headers: {
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
						'cookie': 'crsftoken=nm20rJm2jFpkXUquLKw0c4qwdEArdPhg; ds_user_id=37572608640; ig_did=54AA06C9-3A86-4F53-A7F6-C9127DC153AC; ig_nrcb=1; mid=YU0dFwALAAHPggeAvlvEiV8DP9zM; sessionid=37572608640%3AdLIYIrAwso2GpN%3A8;'
					}
				})
				const Format = {
					link: data.data.graphql.shortcode_media.video_url,
                    caption: {
                        username: data.data.graphql.shortcode_media.owner.username,
                        thumbnail: data.data.graphql.shortcode_media.thumbnail_src,
					    total_views: convertAngka(Number(data.data.graphql.shortcode_media.video_view_count)),
					    total_plays: convertAngka(Number(data.data.graphql.shortcode_media.video_play_count)),
					    total_comment: convertAngka(Number(data.data.graphql.shortcode_media.edge_media_preview_comment.count)),
                        like: convertAngka(Number(data.data.graphql.shortcode_media.edge_media_preview_like.count)),
					    durasi: data.data.graphql. shortcode_media.video_duration
                    }
				}
				return resolve(Format)
			} else if (RegIgTv) {
				let BaseUrlIgtv = "https://www.instagram.com/tv/"
				const data = await axios({
					url: BaseUrlIgtv + RegIgTv[1] + "/?__a=1",
					method: "GET",
					headers: {
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
						'cookie': 'crsftoken=nm20rJm2jFpkXUquLKw0c4qwdEArdPhg; ds_user_id=37572608640; ig_did=54AA06C9-3A86-4F53-A7F6-C9127DC153AC; ig_nrcb=1; mid=YU0dFwALAAHPggeAvlvEiV8DP9zM; sessionid=37572608640%3AdLIYIrAwso2GpN%3A8;'
					}
				})
				const Format = {
					link: data.data.graphql.shortcode_media.video_url,
                    caption: {
                        title: data.data.graphql.shortcode_media.title,
                        username:  data.data.graphql.shortcode_media.owner.username,
					    thumbnail: data.data.graphql.shortcode_media.thumbnail_src,
					    total_comment: convertAngka(Number(data.data.graphql.shortcode_media.edge_media_preview_comment.count)),
					    total_view: convertAngka(Number(data.data.graphql.shortcode_media.video_view_count)),
					    total_play: convertAngka(Number(data.data.graphql.shortcode_media.video_play_count))
                    }
				}
				return resolve(Format)
            } else {
				return reject(new Error(String("Url Invalid")))
			}
		} catch (err) {
			return reject(new Error(String(err)))
		}
	})
}

function zippyDownloader(urls) {
    return new Promise((resolve, reject) => {
        axios.get(urls).then(({ data }) => {
            const $ = cheerio.load(data)
            const li = $.html()
            const po = $('#dlbutton').next().html()
            const le = po.split(';')[0]
            const lo = le.split("document.getElementById('dlbutton').href =")[1]
            const result = `${urls.split('/v')[0]}${eval(lo)}`
            const ho = $('#lrbox').text().replace(/\n/g, '')
			const ext = ho.split('Name:')[1].split('Size:')[0].split('.')[1]
            const hasil = {
                title: ho.split('Name:')[1].split('Size:')[0].trim(),
				extension: ext,
                filesize: ho.split('Size:')[1].split('Uploaded:')[0].trim(),
                upload: ho.split('Uploaded:')[1].split('          ')[0].trim(),
                link: result
            }
            resolve(hasil)
        })
    })
}

function mediafireDownloader(url) {
    return new Promise(async (resolve, reject) => {
        axios.get(url).then(({ data }) => {
            const $ = cheerio.load(data)
            link = $('a#downloadButton').attr('href')
            filesize = $('a#downloadButton').text().replace('Download', '').replace('(', '').replace(')', '').replace('\n', '').replace('\n', '').replace('                         ', '')
            seplit = link.split('/')
            title = seplit[5]
            mime = title.split('.')[1]
            resolve({ title, filesize, mime, link })
        })
    })
}

module.exports = {  tiktokDownloader, instaDownloader, zippyDownloader, mediafireDownloader }
