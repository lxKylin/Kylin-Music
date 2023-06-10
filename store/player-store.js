import { HYEventStore } from 'hy-event-store';

import { getSongDetail, getSongLyric } from '../service/api_player';

import { parseLyric } from '../utils/parse-lyric';

// const audioContext = wx.createInnerAudioContext(); // 前台播放
const audioContext = wx.getBackgroundAudioManager(); // 后台播放

const playerStore = new HYEventStore({
  state: {
    isFirstPlay: true, // 第一次播放
    isStoping: false,

    id: 0,
    currentSong: {}, // 歌曲数据
    currentTime: 0, // 当前时长
    currentLyricText: '', // 当前歌词
    currentLyricIndex: 0, // 当前歌词索引
    durationTime: 0, // 总时长
    lyricInfos: [], // 歌词

    playModeIndex: 0, // 0 顺序，1 单曲循环，2 随机

    isPlaying: false,

    playListSongs: [], // 歌曲列表
    playListIndex: 0 // 播放歌曲索引
  },
  actions: {
    playMusicWithSongIdAction(ctx, { id, isRefresh = false }) {
      // ctx.id == id保证同一首歌不从头播放
      // 切换歌曲要刷新
      if (ctx.id == id && !isRefresh) return;

      // 保存id
      ctx.id = id;

      // 0、修改播放状态
      ctx.isPlaying = true;

      ctx.currentSong = {};
      ctx.durationTime = 0;
      ctx.lyricInfos = [];
      ctx.currentTime = 0;
      ctx.currentLyricIndex = 0;
      ctx.currentLyricText = '';

      // 1、请求歌曲数据
      // 请求歌曲详情
      getSongDetail(id).then((res) => {
        ctx.currentSong = res.songs[0];
        ctx.durationTime = res.songs[0].dt;

        audioContext.title = res.songs[0].name;
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

      // 后台播放必须要配置title
      audioContext.title = id;

      // 3、监听audioContext的一些事件
      // 保证添加一次监听
      if (ctx.isFirstPlay) {
        this.dispatch('setupAudioContextListerAction');
        ctx.isFirstPlay = false;
      }
    },

    setupAudioContextListerAction(ctx) {
      audioContext.autoplay = true;
      // 1、监听歌曲是否可以播放
      audioContext.onCanplay(() => {
        audioContext.play();
      });

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

      // 3、监听歌曲播放完成
      audioContext.onEnded(() => {
        // 播放下一首
        this.dispatch('changeNewMusicAction');
      });

      // 4、监听音乐暂停/播放
      // 播放状态
      audioContext.onPlay(() => {
        ctx.isPlaying = true;
      });
      // 暂停状态
      audioContext.onPause(() => {
        ctx.isPlaying = false;
      });
      // 停止
      audioContext.onStop(() => {
        ctx.isPlaying = false;
        ctx.isStoping = true;
      });
    },

    changeMusicPlayStatusAction(ctx, isPlaying) {
      ctx.isPlaying = isPlaying;

      // 播放和停止状态，要重新设置
      if (ctx.isPlaying && ctx.isStoping) {
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`;
        audioContext.title = currentSong.name;
        // 不从头播放
        audioContext.startTime = ctx.currentTime / 1000;
        ctx.isStoping = false;
      }

      ctx.isPlaying ? audioContext.play() : audioContext.pause();
    },

    changeNewMusicAction(ctx, isNext = true) {
      // 1.获取当前索引
      let index = ctx.playListIndex;

      // 2.根据不同的播放模式, 获取下一首歌的索引
      switch (ctx.playModeIndex) {
        case 0: // 顺序播放
          index = isNext ? index + 1 : index - 1;
          if (index === -1) index = ctx.playListSongs.length - 1;
          if (index === ctx.playListSongs.length) index = 0;
          break;
        case 1: // 单曲循环
          break;
        case 2: // 随机播放
          index = Math.floor(Math.random() * ctx.playListSongs.length);
          break;
      }

      // 3.获取歌曲
      let currentSong = ctx.playListSongs[index];
      if (currentSong) {
        // 记录最新的索引
        ctx.playListIndex = index;
      } else {
        currentSong = ctx.currentSong;
      }

      // 4.播放新的歌曲
      this.dispatch('playMusicWithSongIdAction', {
        id: currentSong.id,
        isRefresh: true
      });
    }
  }
});

export { audioContext, playerStore };
