import { HYEventStore } from 'hy-event-store';

import { getSongDetail, getSongLyric } from '../service/api_player';

import { parseLyric } from '../utils/parse-lyric';

const audioContext = wx.createInnerAudioContext();

const playerStore = new HYEventStore({
  state: {
    id: 0,
    currentSong: {}, // 歌曲数据
    currentTime: 0, // 当前时长
    durationTime: 0, // 总时长
    lyricInfos: [] // 歌词
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
    }
  }
});

export { audioContext, playerStore };
