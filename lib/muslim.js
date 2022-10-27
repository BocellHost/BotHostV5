const axios = require('axios')
const cheerio = require('cheerio')
const { isUrl } = require('./myfunc')

const muslim = {
    search(q, page = '1') {
        return new Promise((resolve, reject) => {
            axios.get(`https://muslim.or.id/page/${page}?s=${q}`)
            .then((res) => {
                let $ = cheerio.load(res.data)
                let url = []
                $('article').each(function (a, b) {
                    url.push({
                        title: $(b).find('div.post-details > div > div.post-header > div.post-title > h2').text(),
                        author: {
                            name: $(b).find('div.post-details > div > div.post-header > div.post-meta > span > a').text(),
                            url: $(b).find('div.post-details > div > div.post-header > div.post-meta > span > a').attr('href')
                        },
                        url: $(b).find('div.post-details > div > div.post-header > div.post-title > h2 > a').attr('href'),
                        snippet: $(b).find('div.post-details > div > div.post-excerpt > p').text().trim(),
                        createAt: $(b).find('div.post-details > div > div.post-header > div.post-meta').html().split('fa-clock-o"></i>')[1].split('</span>')[0],
                        thumbnail: $(b).find('figure > a > img').attr('data-src') || $(b).find('figure > a > img').attr('src')
                    })
                })
                resolve(url)
            })
        })
    },
    read(url) {
        return new Promise((resolve, reject) => {
            axios.get(url)
            .then((res) => {
                let $ = cheerio.load(res.data)
                let hasil = {
                    title: $('article').find('div.post-title > h1').text(),
                    author: {
                        name: $('article').find('div.post-meta > span.post-meta-author > a').text(),
                        url: $('article').find('div.post-meta > span.post-meta-author > a').attr('href')
                    },
                    createAt: $('article').find('div.post-meta').html().split('fa-clock-o"></i>')[1].split('</span>')[0],
                    updateAt: $('article').find('div.post-meta > span.post-meta-date').text().replace("Updated: ", ""),
                    comment: $('article').find('div.post-meta > span.post-meta-comment > a').text(),
                    hastag: $('article').find('div.post-meta-cat > a').text(),
                    url: 'https://www.youtube.com/embed/'+$('#content > div.post-video-wrapper > div > div > div').attr('data-embed') || url || "",
                    thumbnail: $('article > figure > img').attr('data-src') || $('article > figure > img').attr('src') || 'https://img.youtube.com/vi/'+$('#content > div.post-video-wrapper > div > div > div').attr('data-embed')+'/maxresdefault.jpg',
                    text: $('article > div.entry.clearfix').text().trim()
                }
                resolve(hasil)
            })
        })
    },
    query(title, pages = '1') {
        return new Promise((resolve, reject) => {
            this.search(title, pages)
            .then((result) => {
                let random = result[Math.floor(Math.random() * result.length)]
                this.read(random.url)
                .then((reading) => {
                    resolve(reading)
                })
            })
        })
    }
}

const NU = {
    search(q, page = '1') {
        return new Promise((resolve, reject) => {
            axios.get(`https://islam.nu.or.id/search/${q}/${page}`)
            .then((res) => {
                let $ = cheerio.load(res.data)
                let url = []
                $('#data-wrapper > div.row > div.col-6.col-md-4.mb-3').each(function (a, b) {
                    url.push({
                        title: $(b).find('div.entry__title.mt-2 > h1 > a').text(),
                        type: $(b).find('ul > li > span.entry__meta-date > a').text(),
                        createAt: $(b).find('ul > li > span:nth-child(2)').text(),
                        url: $(b).find('div.entry__title.mt-2 > h1 > a').attr('href'),
                        thumbnail: $('div.entry__img-card > a > div > img').attr('src')
                    })
                })
                resolve(url)
            })
        })
    },
    read(url) {
        return new Promise((resolve, reject) => {
            axios.get(url)
            .then((res) => {
                let $ = cheerio.load(res.data)
                let hasil = {
                    title: $('article > div.single-post__entry-header.entry__header > h1').text().trim(),
                    author: {
                        name: $('article > div.single-post__entry-header.entry__header > ul > a > li > span').text(),
                        profilePic: $('article > div.single-post__entry-header.entry__header > ul > a > li > img').attr('data-src') || $('article > div.single-post__entry-header.entry__header > ul > a > li > img').attr('src'),
                        url: $('article > div.single-post__entry-header.entry__header > ul > a').attr('href')
                    },
                    createAt: $('article > div.single-post__entry-header.entry__header > ul > li').text().trim(),
                    type: $('ul.breadcrumbs > li.breadcrumbs__item > a').text(),
                    thumbnail: $('article > div.entry__img-holder > img').attr('data-src') || $('article > div.entry__img-holder > img').attr('src'),
                    text: $('article > div.entry__article.mt-3 > div.row > div > div').text().trim()
                }
                resolve(hasil)
            })
        })
    },
    query(title, pages = '1') {
        return new Promise((resolve, reject) => {
            this.search(title, pages)
            .then((result) => {
                let random = result[Math.floor(Math.random() * result.length)]
                this.read(random.url)
                .then((reading) => {
                    resolve(reading)
                })
            })
        })
    }
}

const kisahMuslim = {
    search(q, page = '1') {
        return new Promise((resolve, reject) => {
            axios.get(`https://kisahmuslim.com/page/${page}?s=${q}`)
            .then((res) => {
                let $ = cheerio.load(res.data)
                let hasil = []
                $('article').each(function (a, b) {
                    hasil.push({
                        title: $(b).find('h2').text(),
                        url: $(b).find('h2 > a').attr('href'),
                        thumb: isUrl($(b).find('div.post-image > a > img').attr('srcset')),
                        snippet: $(b).find('div.entry-summary > p').text().trim()
                    })
                })
                resolve(hasil)
            })
        })
    },
    read(url) {
        return new Promise((resolve, reject) => {
            axios.get(url) 
            .then((res) => {
                let $ = cheerio.load(res.data)
                let hasil = {
                    title: $('article').find('header > h1').text(),
                    url,
                    thumb: isUrl($('article').find('div.featured-image.page-header-image-single > img').attr('srcset')),
                    kisah: $('article').find('div.entry-content').text().trim()
                }
                resolve(hasil)
            })
        })
    },
    query(title, pages = '1') {
        return new Promise((resolve, reject) => {
            this.search(title, pages)
            .then((result) => {
                let random = result[Math.floor(Math.random() * result.length)]
                this.read(random.url)
                .then((reading) => {
                    resolve(reading)
                })
            })
        })
    }
}

const islam = {
    search(q, page = '1') {
        return new Promise((resolve, reject) => {
            axios.get(`https://islami.co/?s=${q}&paged=${page}`)
            .then((res) => {
                let $ = cheerio.load(res.data)
                let hasil = []
                $('article').each(function (a, b) {
                    hasil.push({
                        title: $(b).find('h3').text(),
                        type: $(b).find('span.post-term > a').text(),
                        url: $(b).find('h3 > a').attr('href'),
                        author: {
                            name: $(b).find('span.post-author > a').text(),
                            url: $(b).find('span.post-author > a').attr('href')
                        },
                        createAt: $(b).find('time.post-date').text(),
                        thumb: isUrl($(b).find('picture > img').attr('data-srcset') || $(b).find('picture > img').attr('srcset'))
                    })
                })
                resolve(hasil)
            })
        })
    },
    read(url) {
        return new Promise((resolve, reject) => {
            axios.get(url)
            .then((res) => {
                let $ = cheerio.load(res.data)
                let medsos = []
                $('article > div.wrapper').find('div.entry-footer > div.bio-penulis > div.detil > div.socmed.medsos-user.clearfix').each(function (a, b) {
                    medsos.push({ name: $(b).find('a').attr('title'), url: $(b).find('a').attr('href') })
                })
                let hasil = {
                    title: $('article > header').find('h1').text(),
                    pesan: $('article > header').find('div.subtitle').text().trim(),
                    tags: $('article > div.wrapper').find('div.entry-footer > div.post-tags > div').text(),
                    author: {
                        name: $('article > div.wrapper').find('div.entry-footer > div.bio-penulis > div.detil > h4').text(),
                        medsos,
                        profilePic: $('article > div.wrapper').find('div.entry-footer > div.bio-penulis > figure > img').attr('data-src') || $('article > div.wrapper').find('div.entry-footer > div.bio-penulis > figure > img').attr('src'),
                        desc: $('article > div.wrapper').find('div.entry-footer > div.bio-penulis > div.detil > div.desc').text() || "",
                    },
                    createAt: $('article > header').find('div.meta.post-info > time.post-date').text(),
                    view: $('article > header').find('div.meta.post-info > span.post-view').text(),
                    thumb: $('article > div.warapper').find('picture > img').attr('data-src') || $('article > div.warapper').find('picture > img').attr('src'),
                    text: $('article > div.wrapper').find('div.post-wrap > div.body-post').text().trim(),
                    support: {
                        end: $('article > div.wrapper').find('div.entry-footer > div.extra-support > p').text(),
                        donasi: $('article > div.wrapper').find('div.entry-footer > div.extra-support > div.konten-rek').text().trim()
                    }
                }
                resolve(hasil)
            })
        })
    },
    query(title, pages = '1') {
        return new Promise((resolve, reject) => {
            this.search(title, pages)
            .then((result) => {
                let random = result[Math.floor(Math.random() * result.length)]
                this.read(random.url)
                .then((reading) => {
                    resolve(reading)
                })
            })
        })
    }
}

const quranweb = {
    surah(q) {
        return new Promise((resolve, reject) => {
            axios.get('https://quranweb.id/'+q)
            .then((res) => {
                let $ = cheerio.load(res.data)
                let surah = []
                $('body > div.ayah-wrapper > div.ayah').each(function (a, b) {
                    surah.push({
                        no: `${a++}`,
                        title: $(b).attr('title'),
                        arab: $(b).find('div.ayah-text').text(),
                        tr_id: $(b).find('div.ayah-translation > p').text()
                    })
                })
                let hasil = {
                    urutan: $('body > div.header > h1').text(),
                    jumlah: $('body > div.header > h2.surah-count').text(),
                    surah
                }
                resolve(hasil)
            })
        })
    },
    ayah(surah, ayah) {
        return new Promise((resolve, reject) => {
            axios.get(`https://quranweb.id/${surah}/${ayah}`)
            .then((res) => {
                let $ = cheerio.load(res.data)
                let hasil = {
                    surah: {
                        nama: $('body > div.header > h1 > a').text(),
                        url: 'https://quranweb.id'+$('body > div.header > h1 > a').attr('href'),
                        no: $('body > div.header > h1 > span').text()
                    },
                    ayat: {
                        no: $('body > div.header > h2.surah-count').text(),
                        arab: $('body > div.ayah-wrapper > div > div.ayah-text').text(),
                        tr_id: $('body > div.ayah-wrapper > div > div.ayah-translation').text()
                    },
                    tafsir: $('body > div.ayah-wrapper > div > div.ayah-tafsir-wrapper').text().trim()
                }
                resolve(hasil)
            })
        })
    }
}

const hadis = {
    search(q, type = 'all') {
        return new Promise((resolve, reject) => {
            axios.get(`https://www.hadits.id/tentang/${q}?hadits=${type}`)
            .then((res) => {
                let $ = cheerio.load(res.data)
                let hasil = []
                $('div.search-result > section').each(function (a, b) {
                    hasil.push({
                        title: $(b).find('a').text().trim(),
                        url: $(b).find('a:nth-child(2)').attr('href') ? 'https://www.hadits.id'+$(b).find('a:nth-child(2)').attr('href') : 'https://www.hadits.id'+$(b).find('a').attr('href'),
                        hadits: $(b).find('cite').text(),
                        snippet: $(b).find('p').text()
                    })
                })
                resolve(hasil)
            })
        })
    },
    read(url) {
        return new Promise((resolve, reject) => {
            axios.get(url)
            .then((res) => {
                let $ = cheerio.load(res.data)
                let hasil = {
                    hadits: $('header').find('h2').text(),
                    title: $('article').find('h1').text(),
                    isi: $('article').find('p').text().trim(),
                    infaq: {
                        pesan: $('article').find('div.infaq > p:nth-child(1)').text().trim(),
                        url: $('article').find('div.infaq > p:nth-child(2) > a').attr('href')
                    }
                }
                resolve(hasil)
            })
        })
    },
    query(title, type = 'all') { // list type = ['bukhari','muslim','dawud','tirmidzi','nasai','majah']
        return new Promise((resolve, reject) => {
            this.search(title, type)
            .then((result) => {
                let random = result[Math.floor(Math.random() * result.length)]
                this.read(random.url)
                .then((reading) => {
                    resolve(reading)
                })
            })
        })
    }
}

const dalamislam = {
    search(q, page = '1') {
        return new Promise((resolve, reject) => {
            axios.get(`https://dalamislam.com/page/${page}?s=${q}`)
            .then((res) => {
                let $ = cheerio.load(res.data)
                let hasil = []
                $('article').each(function (a, b) {
                    hasil.push({
                        title: $(b).find('h2').text(),
                        url: $(b).find('h2 > a').attr('href'),
                        snippet: $(b).find('div.entry-content > p').text(),
                        tags: $(b).find('ul.post-meta > li > span.meta-text').text()
                    })
                })
                resolve(hasil)
            })
        })
    },
    read(url) {
        return new Promise((resolve, reject) => {
            axios.get(url)
            .then((res) => {
                let $ = cheerio.load(res.data)
                let hasil = {
                    title: $('article > header').find('h1').text(),
                    isi: $('article').find('div.entry-content').text(),
                    tags: $('article > div.section-inner').find('ul > li > span.meta-text').text()
                }
                resolve(hasil)
            })
        })
    },
    query(title, page = '1') {
        return new Promise((resolve, reject) => {
            this.search(title, page)
            .then((result) => {
                let random = result[Math.floor(Math.random() * result.length)]
                this.read(random.url)
                .then((reading) => {
                    resolve(reading)
                })
            })
        })
    }
}

module.exports = { islam, NU, kisahMuslim, muslim, quranweb, hadis, dalamislam }
