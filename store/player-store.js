import { HYEventStore } from 'hy-event-store';

import { getSongDetail, getSongLyric } from '../service/api_player';

import { parseLyric } from '../utils/parse-lyric';

const audioContext = wx.createInnerAudioContext();

const playerStore = new HYEventStore({
  state: {
    id: 0,
    currentSong: {}, // 歌曲数据
    currentTime: 0, // 当前时长
    currentLyricText: '', // 当前歌词
    currentLyricIndex: 0, // 当前歌词索引
    durationTime: 0, // 总时长
    lyricInfos: [], // 歌词

    playModeIndex: 0 // 0 顺序，1 单曲循环，2 随机
  },
  actions: {
    playMusicWithSongIdAction(ctx, { id }) {
      // 保存id
      ctx.id = id;

      // 1、请求歌曲数据
      // 请求歌曲详情
      getSongDetail(id).then((res) => {
        (ctx.currentSong = res.songs[0]), (ctx.durationTime = res.songs[0].dt);
      });
      // 请求歌曲歌词
      getSongLyric(id).then((res) => {
        // 拿到歌词
        const lyricString = res.lrc.lyric;
        ctx.lyricInfos = parseLyric(lyricString);
      });

      // 2、播放对应id的歌曲
      audioContext.stop();
      /**
       * audioContext
       * 1、获取音频流
       * 2、audioContext对音频流进行解码
       * 3、播放
       */
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;

      // 3、监听audioContext的一些事件
      this.dispatch('setupAudioContextListerAction');
    },

    setupAudioContextListerAction(ctx) {
      // audioContext.autoplay = true;
      // // 1、监听歌曲是否可以播放
      // audioContext.onCanplay(() => {
      //   audioContext.play();
      // });

      // 2、对时间更新时监听
      audioContext.onTimeUpdate(() => {
        // 1、获取当前时间 *1000为了得到毫秒
        const currentTime = audioContext.currentTime * 1000;

        // 2、根据当前时间修改currentTime
        ctx.currentTime = currentTime;

        // 3、根据当前时间去查找播放的歌词
        if (!ctx.lyricInfos.length) return;
        let i = 0;
        for (; i < ctx.lyricInfos.length; i++) {
          const lyricInfo = ctx.lyricInfos[i];
          if (currentTime < lyricInfo.time) {
            break;
          }
        }
        // 优化：当索引不一致时，才需要重新设置当前歌词
        const currentIndex = i - 1;
        if (ctx.currentLyricIndex !== currentIndex) {
          const currentLyricInfo = ctx.lyricInfos[currentIndex];
          ctx.currentLyricText = currentLyricInfo.text;
          ctx.currentLyricIndex = currentIndex;
        }
      });
    }
  }
});

export { audioContext, playerStore };
