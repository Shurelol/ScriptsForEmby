// refer to https://greasyfork.org/zh-CN/scripts/459297-embylaunchpotplayer/code
// refer to https://greasyfork.org/zh-CN/scripts/443916-emby%E8%B0%83%E7%94%A8%E5%BC%B9%E5%BC%B9play/code
// Thanks to bpking and kaedei

(function () {
    'use strict';

    //Supports: Potplayer, VLC, IINA, NPlayer, MXPlayer, Infuse, StellarPlayer, MPV, CopyUrl

    // below playBtn: afterend; above playBtn: beforebegin
    let location = "afterend"
    // icon size
    let iconSize = "1em"
    // MXplayer version, free: ad, pro: pro
    let mxVersion = "ad"

    // ExternalPlayers shown in Windows
    let players_windows = ["PotPlayer", "VLC", "IINA", "nPlayer", "MXPlayer", "Infuse", "StellarPlayer", "MPV", "CopyUrl"];
    // ExternalPlayers shown in macOS
    let players_macos = ["PotPlayer", "VLC", "IINA", "nPlayer", "MXPlayer", "Infuse", "StellarPlayer", "MPV", "CopyUrl"];
    // ExternalPlayers shown in iOS
    let players_ios = ["PotPlayer", "VLC", "IINA", "nPlayer", "MXPlayer", "Infuse", "StellarPlayer", "MPV", "CopyUrl"];
    // ExternalPlayers shown in Android
    let players_android = ["PotPlayer", "VLC", "IINA", "nPlayer", "MXPlayer", "Infuse", "StellarPlayer", "MPV", "CopyUrl"];
    // ExternalPlayers shown in others
    let players_others = ["PotPlayer", "VLC", "IINA", "nPlayer", "MXPlayer", "Infuse", "StellarPlayer", "MPV", "CopyUrl"];

    // ExternalPlayers Info
    let playersInfo = {
        PotPlayer: {
            name: "Pot",
            title: "PotPlayer",
            icon: "https://fastly.jsdelivr.net/gh/bpking1/embyExternalUrl@0.0.5/embyWebAddExternalUrl/icons/icon-PotPlayer.webp"
        },
        VLC: {
            name: "VLC",
            title: "VLC",
            icon: "https://fastly.jsdelivr.net/gh/bpking1/embyExternalUrl@0.0.5/embyWebAddExternalUrl/icons/icon-VLC.webp"
        },
        IINA: {
            name: "IINA",
            title: "IINA",
            icon: "https://fastly.jsdelivr.net/gh/bpking1/embyExternalUrl@0.0.5/embyWebAddExternalUrl/icons/icon-IINA.webp"
        },
        nPlayer: {
            name: "nPlayer",
            title: "nPlayer",
            icon: "https://fastly.jsdelivr.net/gh/bpking1/embyExternalUrl@0.0.5/embyWebAddExternalUrl/icons/icon-NPlayer.webp"
        },
        MXPlayer: {
            name: "MX",
            title: "MXPlayer",
            icon: "https://fastly.jsdelivr.net/gh/bpking1/embyExternalUrl@0.0.5/embyWebAddExternalUrl/icons/icon-MXPlayer.webp"
        },
        Infuse: {
            name: "Infuse",
            title: "InfusePlayer",
            icon: "https://fastly.jsdelivr.net/gh/bpking1/embyExternalUrl@0.0.5/embyWebAddExternalUrl/icons/icon-infuse.webp"
        },
        StellarPlayer: {
            name: "恒星",
            title: "恒星播放器",
            icon: "https://fastly.jsdelivr.net/gh/bpking1/embyExternalUrl@0.0.5/embyWebAddExternalUrl/icons/icon-StellarPlayer.webp"
        },
        MPV: {
            name: "MPV",
            title: "MPV",
            icon: "https://fastly.jsdelivr.net/gh/bpking1/embyExternalUrl@0.0.5/embyWebAddExternalUrl/icons/icon-MPV.webp"
        },
        CopyUrl: {
            name: "复制链接",
            title: "复制串流地址",
            icon: "https://fastly.jsdelivr.net/gh/bpking1/embyExternalUrl@0.0.5/embyWebAddExternalUrl/icons/icon-Copy.webp"
        }
    }

    // main function
    setInterval(function () {
        let flag = showFlag();
        if (!flag) {
            return;
        }
        let playBtn = getPlayBtn();
        let players;
        let btnHtml = '';
        switch (getOS()) {
            case 'Windows':
                players = players_windows;
                break;
            case 'MacOS':
                players = players_macos;
                break;
            case 'iOS':
                players = players_ios;
                break;
            case 'Android':
                players = players_android;
                break;
            default:
                players = players_others;
                break;
        }
        // add Btn
        for (let player of players) {
            let name = playersInfo[player].name;
            let title = playersInfo[player].title;
            btnHtml += `<button name="ExternalPlayers" type="button" class="detailButton emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary btn-${player}" title="${title}">
                            <div class="detailButton-content"> 
                                <img class="md-icon detailButton-icon button-icon button-icon-left icon-${player}" alt="" src="" style="width: ${iconSize}; height: ${iconSize}">
                                <span class="button-text">${name}</span>
                            </div> 
                        </button>`;
        }
        playBtn.insertAdjacentHTML(location, `<div class="detailButtons flex align-items-flex-start flex-wrap-wrap">${btnHtml}</div>`);
        // add img and click event
        for (let player of players) {
            document.querySelector(`div[is='emby-scroller']:not(.hide) .icon-${player}`).src = playersInfo[player].icon;
            document.querySelector(`div[is='emby-scroller']:not(.hide) .btn-${player}`).addEventListener("click", function () {
                getUrl(player).then(url=>{
                    if (url) {
                        console.log(url);
                        window.open(url, '_blank');
                    }
                }).catch(err=>{console.log(err)});
            });
        }
    }, 1000);

    function showFlag() {
        let mainDetailButtons = getPlayBtn();
        // exclude actor page
        let mainDetailButtons1 = document.querySelectorAll("div[is='emby-scroller']:not(.hide) .mainDetailButtons .btnPlay:not(.hide)")[0];
        let mainDetailButtons2 = document.querySelectorAll("div[is='emby-scroller']:not(.hide) .mainDetailButtons .btnResume:not(.hide)")[0];
        // exclude collection page
        let mainDetailButtons3 = document.querySelectorAll("div[is='emby-scroller']:not(.hide) .mainDetailButtons .btnShuffle:not(.hide)")[0];
        // exclude live tv page
        let mainDetailButtons4 = document.querySelectorAll("div[is='emby-scroller']:not(.hide) .mainDetailButtons .btnManualRecording:not(.hide)")[0];
        // exclude already added
        let addedFlag = document.getElementsByName("ExternalPlayers")[0];
        return mainDetailButtons && (mainDetailButtons1 || mainDetailButtons2) && (!mainDetailButtons3) && (!mainDetailButtons4) && (!addedFlag);
    }

    async function getUrl(player) {
        let mediaInfo = await getEmbyMediaInfo();
        let intent = mediaInfo.intent;
        let url;
        switch (player) {
            // PotPlayer
            case 'PotPlayer':
                url = `potplayer://${encodeURI(mediaInfo.streamUrl)} /sub=${encodeURI(mediaInfo.subUrl)} /current /title="${intent.title}" /seek=${getSeek(intent.position)}`;
                break;
            // VLC
            case 'VLC':
                // https://wiki.videolan.org/Android_Player_Intents/
                switch (getOS()) {
                    case 'Windows':
                        // https://github.com/stefansundin/vlc-protocol
                        url = `vlc://${encodeURI(mediaInfo.streamUrl)}`;
                        break;
                    case 'iOS':
                        // https://code.videolan.org/videolan/vlc-ios/-/commit/55e27ed69e2fce7d87c47c9342f8889fda356aa9
                        url = `vlc-x-callback://x-callback-url/stream?url=${encodeURIComponent(mediaInfo.streamUrl)}&sub=${encodeURIComponent(mediaInfo.subUrl)}`;
                        break;
                    default:
                        // android subtitles:  https://code.videolan.org/videolan/vlc-android/-/issues/1903
                        url = `intent:${encodeURI(mediaInfo.streamUrl)}#Intent;package=org.videolan.vlc;type=video/*;S.subtitles_location=${encodeURI(mediaInfo.subUrl)};S.title=${encodeURI(intent.title)};i.position=${intent.position};end`;
                        break;
                }
                break;
            // IINA
            case 'IINA':
                // https://github.com/iina/iina/issues/1991
                url = `iina://weblink?url=${encodeURIComponent(mediaInfo.streamUrl)}&new_window=1`;
                break;
            // nPlayer
            case 'nPlayer':
                switch (getOS()) {
                    case 'macOS':
                        url = `nplayer-mac://weblink?url=${encodeURIComponent(mediaInfo.streamUrl)}&new_window=1`;
                        break;
                    default:
                        url = `nplayer-${encodeURI(mediaInfo.streamUrl)}`;
                        break;
                }
                break;
            // MXPlayer
            case 'MXPlayer':
                url = `intent:${encodeURI(mediaInfo.streamUrl)}#Intent;package=com.mxtech.videoplayer.${mxVersion};S.title=${encodeURI(intent.title)};i.position=${intent.position};end`;
                break;
            // Infuse
            case 'Infuse':
                url = `infuse://x-callback-url/play?url=${encodeURIComponent(mediaInfo.streamUrl)}`;
                break;
            // StellarPlayer
            case 'StellarPlayer':
                url = `stellar://play/${encodeURI(mediaInfo.streamUrl)}`;
                break;
            // MPV
            case 'MPV':
                switch (getOS()) {
                    case 'iOS':
                        url = `mpv://${encodeURI(mediaInfo.streamUrl)}`;
                        break;
                    case 'Android':
                        url = `mpv://${encodeURI(mediaInfo.streamUrl)}`;
                        break;
                    default:
                        // https://github.com/akiirui/mpv-handler
                        let streamUrl64 = btoa(mediaInfo.streamUrl).replace(/\//g, "_").replace(/\+/g, "-").replace(/\=/g, "");
                        let subUrl64 = mediaInfo.subUrl.length > 0 ? btoa(mediaInfo.subUrl).replace(/\//g, "_").replace(/\+/g, "-").replace(/\=/g, "") : null;
                        url = subUrl64 ? `mpv://play/${streamUrl64}/?subfile=${subUrl64}` : `mpv://play/${streamUrl64}`;
                        break;
                }
                break;
            // CopyUrl
            case 'CopyUrl':
                let textarea = document.createElement('textarea');
                document.body.appendChild(textarea);
                textarea.style.position = 'absolute';
                textarea.style.clip = 'rect(0 0 0 0)';
                textarea.value = mediaInfo.streamUrl;
                textarea.select();
                if (document.execCommand('copy', true)) {
                    console.log(`copyUrl = ${mediaInfo.streamUrl}`);
                    alert('复制成功');
                }
                //need https
                // if (navigator.clipboard) {
                //     navigator.clipboard.writeText(mediaInfo.streamUrl).then(() => {
                //          console.log(`copyUrl = ${mediaInfo.streamUrl}`);
                //          this.innerText = '复制成功';
                //     })
                // }
                break;
            default:
                break;
        }
        return url;
    }

    function getPlayBtn() {
        return document.querySelectorAll("div[is='emby-scroller']:not(.hide) .mainDetailButtons")[0];
    }

    function getOS() {
        let u = navigator.userAgent
        if (!!u.match(/compatible/i) || u.match(/Windows/i)) {
            return 'Windows'
        } else if (!!u.match(/Macintosh/i) || u.match(/MacIntel/i)) {
            return 'macOS'
        } else if (!!u.match(/iphone/i) || u.match(/Ipad/i)) {
            return 'iOS'
        } else if (u.match(/android/i)) {
            return 'Android'
        } else if (u.match(/Ubuntu/i)) {
            return 'Ubuntu'
        } else {
            return 'others'
        }
    }

    async function getItemInfo() {
        let userId = ApiClient._serverInfo.UserId;
        let itemId = /\?id=(\d*)/.exec(window.location.hash)[1];
        let response = await ApiClient.getItem(userId, itemId);
        //继续播放当前剧集的下一集
        if (response.Type == "Series") {
            let seriesNextUpItems = await ApiClient.getNextUpEpisodes({ SeriesId: itemId, UserId: userId });
            console.log("nextUpItemId: " + seriesNextUpItems.Items[0].Id);
            return await ApiClient.getItem(userId, seriesNextUpItems.Items[0].Id);
        }
        //播放当前季season的第一集
        if (response.Type == "Season") {
            let seasonItems = await ApiClient.getItems(userId, { parentId: itemId });
            console.log("seasonItemId: " + seasonItems.Items[0].Id);
            return await ApiClient.getItem(userId, seasonItems.Items[0].Id);
        }
        //播放当前集或电影
        console.log("itemId:  " + itemId);
        return response;
    }

    function getSeek(position) {
        let ticks = position * 10000;
        let parts = []
            , hours = ticks / 36e9;
        (hours = Math.floor(hours)) && parts.push(hours);
        let minutes = (ticks -= 36e9 * hours) / 6e8;
        ticks -= 6e8 * (minutes = Math.floor(minutes)),
            minutes < 10 && hours && (minutes = "0" + minutes),
            parts.push(minutes);
        let seconds = ticks / 1e7;
        return (seconds = Math.floor(seconds)) < 10 && (seconds = "0" + seconds),
            parts.push(seconds),
            parts.join(":")
    }

    function getSubPath(mediaSource) {
        let selectSubtitles = document.querySelector("div[is='emby-scroller']:not(.hide) select.selectSubtitles");
        let subTitlePath = '';
        //返回选中的外挂字幕
        if (selectSubtitles && selectSubtitles.value > 0) {
            let SubIndex = mediaSource.MediaStreams.findIndex(m => m.Index == selectSubtitles.value && m.IsExternal);
            if (SubIndex > -1) {
                let subtitleCodec = mediaSource.MediaStreams[SubIndex].Codec;
                subTitlePath = `/${mediaSource.Id}/Subtitles/${selectSubtitles.value}/Stream.${subtitleCodec}`;
            }
        }
        else {
            //默认尝试返回第一个外挂中文字幕
            let chiSubIndex = mediaSource.MediaStreams.findIndex(m => m.Language == "chi" && m.IsExternal);
            if (chiSubIndex > -1) {
                let subtitleCodec = mediaSource.MediaStreams[chiSubIndex].Codec;
                subTitlePath = `/${mediaSource.Id}/Subtitles/${chiSubIndex}/Stream.${subtitleCodec}`;
            } else {
                //尝试返回第一个外挂字幕
                let externalSubIndex = mediaSource.MediaStreams.findIndex(m => m.IsExternal);
                if (externalSubIndex > -1) {
                    let subtitleCodec = mediaSource.MediaStreams[externalSubIndex].Codec;
                    subTitlePath = `/${mediaSource.Id}/Subtitles/${externalSubIndex}/Stream.${subtitleCodec}`;
                }
            }

        }
        return subTitlePath;
    }


    async function getEmbyMediaInfo() {
        let itemInfo = await getItemInfo();
        let mediaSourceId = itemInfo.MediaSources[0].Id;
        let selectSource = document.querySelector("div[is='emby-scroller']:not(.hide) select.selectSource");
        if (selectSource && selectSource.value.length > 0) {
            mediaSourceId = selectSource.value;
        }
        //let selectAudio = document.querySelector("div[is='emby-scroller']:not(.hide) select.selectAudio");
        let mediaSource = itemInfo.MediaSources.find(m => m.Id == mediaSourceId);
        let domain = `${ApiClient._serverAddress}/emby/videos/${itemInfo.Id}`;
        let subPath = getSubPath(mediaSource);
        let subUrl = subPath.length > 0 ? `${domain}${subPath}?api_key=${ApiClient.accessToken()}` : '';
        let streamUrl = `${domain}/stream.${mediaSource.Container}?api_key=${ApiClient.accessToken()}&Static=true&MediaSourceId=${mediaSourceId}`;
        let position = parseInt(itemInfo.UserData.PlaybackPositionTicks / 10000);
        let intent = await getIntent(mediaSource, position);
        console.log(streamUrl, subUrl, intent);
        return {
            streamUrl: streamUrl,
            subUrl: subUrl,
            intent: intent,
        }
    }

    async function getIntent(mediaSource, position) {
        let title = mediaSource.Path.split('/').pop();
        let externalSubs = mediaSource.MediaStreams.filter(m => m.IsExternal == true);
        let subs = ''; //要求是android.net.uri[] ?
        let subs_name = '';
        let subs_filename = '';
        let subs_enable = '';
        if (externalSubs) {
            subs_name = externalSubs.map(s => s.DisplayTitle);
            subs_filename = externalSubs.map(s => s.Path.split('/').pop());
        }
        return {
            title: title,
            position: position,
            subs: subs,
            subs_name: subs_name,
            subs_filename: subs_filename,
            subs_enable: subs_enable
        };
    }

})();
