// pages/music-player/index.js
// import { getSongDetail, getSongLyric } from '../../service/api_player';
// import { parseLyric } from '../../utils/parse-lyric';

import { audioContext, playerStore } from '../../store/index';

const playModeNames = ['order', 'repeat', 'random'];

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    currentSong: {}, // 歌曲数据
    currentTime: 0, // 当前时长
    durationTime: 0, // 总时长
    sliderValue: 0, // 进度条的值
    isSliderChanging: false, // 进度条是否在改变

    currentPage: 0, // 当前页
    contentHeight: 0, // 内容高度
    isMusicLyric: true, // 是否显示歌词
    lyricInfos: [], // 歌词
    currentLyricText: '', // 当前歌词
    currentLyricIndex: 0, // 当前歌词索引
    lyricScrollTop: 0, // 需要向上滚动的值

    playModeIndex: 0,
    playModeName: 'order',

    isPlaying: false,
    playingName: 'pause'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 1、获取传入的id
    const id = options.id;
    this.setData({ id });

    // 2、根据id获取歌曲信息
    // this.getPageData(id);
    this.setupPlayStoreListener();

    // 3、动态计算内容高度
    const globalData = getApp().globalData;
    const screenHeight = globalData.screenHeight;
    const statusBarHeight = globalData.statusBarHeight;
    const navBarHeight = globalData.navBarHeight;
    // 高宽比
    const deviceRadio = globalData.deviceRadio;
    const contentHeight = screenHeight - statusBarHeight - navBarHeight;

    this.setData({
      contentHeight,
      isMusicLyric: deviceRadio >= 2
    });

    // 4、创建播放器
    // const audioContext = wx.createInnerAudioContext();

    // 4、使用audioContext
    // 停止上一个音乐
    // audioContext.stop();
    // /**
    //  * audioContext
    //  * 1、获取音频流
    //  * 2、audioContext对音频流进行解码
    //  * 3、播放
    //  */
    // audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;

    /**
     * audioContext会有一定准备的时间
     * onCanplay表示已经准备好了
     */

    // 5、audioContext的事件监听
    // this.setupAudioContextLister();
  },

  // // ============     网络请求    ============
  // getPageData(id) {
  //   getSongDetail(id).then((res) => {
  //     this.setData({
  //       currentSong: res.songs[0],
  //       durationTime: res.songs[0].dt
  //     });
  //   });

  //   getSongLyric(id).then((res) => {
  //     // 拿到歌词
  //     const lyricString = res.lrc.lyric;
  //     const lyricInfos = parseLyric(lyricString);
  //     this.setData({ lyricInfos });
  //   });
  // },

  // // ============     audio事件监听     ============
  // setupAudioContextLister() {
  //   // audioContext.autoplay = true;
  //   // audioContext.onCanplay(() => {
  //   //   audioContext.play();
  //   // });

  //   // 对时间更新时监听
  //   audioContext.onTimeUpdate(() => {
  //     // 1、获取当前时间 *1000为了得到毫秒
  //     const currentTime = audioContext.currentTime * 1000;

  //     // 如果正在拖拽进度条，不改变当前时间
  //     if (!this.data.isSliderChanging) {
  //       // 2、根据当前时间修改currentTime、 改变进度条的值
  //       const sliderValue = (currentTime / this.data.durationTime) * 100;

  //       this.setData({ currentTime, sliderValue });
  //     }

  //     // 3、根据当前时间去查找播放的歌词
  //     if (!this.data.lyricInfos.length) return;
  //     let i = 0;
  //     for (; i < this.data.lyricInfos.length; i++) {
  //       const lyricInfo = this.data.lyricInfos[i];
  //       if (currentTime < lyricInfo.time) {
  //         break;
  //       }
  //     }
  //     // 优化：当索引不一致时，才需要重新设置当前歌词
  //     const currentIndex = i - 1;
  //     if (this.data.currentLyricIndex !== currentIndex) {
  //       const currentLyricInfo = this.data.lyricInfos[currentIndex];
  //       this.setData({
  //         currentLyricText: currentLyricInfo.text,
  //         currentLyricIndex: currentIndex,
  //         lyricScrollTop: currentIndex * 35
  //       });
  //     }
  //   });
  // },

  // ============   事件处理    ============
  handleSwiperChange(event) {
    const current = event.detail.current;
    this.setData({ currentPage: current });
  },

  // 点击进度条
  handleSliderChange(event) {
    // 1、获取slider进度条的值（0～100）
    const value = event.detail.value;

    // 2、计算需要播放的currentTime
    const currentTime = this.data.durationTime * (value / 100);

    // 3、seek设置context播放currentTime位置的音乐
    // audioContext.pause(); // 暂停音乐，因为有跳动播放
    // 传入的值单位为s
    audioContext.seek(currentTime / 1000);

    // 4、记录最新的sliderValue, 并且需要讲isSliderChaning设置回false
    this.setData({ sliderValue: value, isSliderChanging: false });
  },
  // 拖拽进度条
  handleSliderChanging(event) {
    const value = event.detail.value;
    const currentTime = this.data.durationTime * (value / 100);
    this.setData({ isSliderChanging: true, currentTime });
  },

  // 返回
  handleBackBtnClick() {
    wx.navigateBack();
  },

  handleModeBtnClick() {
    // 计算最新的playModeIndex
    let playModeIndex = this.data.playModeIndex + 1;
    if (playModeIndex === 3) playModeIndex = 0;

    // 设置playerStore中的playModeIndex
    playerStore.setState('playModeIndex', playModeIndex);
  },

  // 暂停/播放
  handlePlayBtnClick() {
    playerStore.dispatch('changeMusicPlayStatusAction', !this.data.isPlaying);
  },
  // 上一首
  handlePrevBtnClick() {
    playerStore.dispatch('changeNewMusicAction', false);
  },
  // 下一首
  handleNextBtnClick() {
    playerStore.dispatch('changeNewMusicAction');
  },

  // 从store获取数据
  setupPlayStoreListener() {
    // 1.监听currentSong/durationTime/lyricInfos
    playerStore.onStates(
      ['currentSong', 'durationTime', 'lyricInfos'],
      ({ currentSong, durationTime, lyricInfos }) => {
        currentSong && this.setData({ currentSong });
        durationTime && this.setData({ durationTime });
        lyricInfos && this.setData({ lyricInfos });
      }
    );

    // 2.监听currentTime/currentLyricIndex/currentLyricText
    playerStore.onStates(
      ['currentTime', 'currentLyricIndex', 'currentLyricText'],
      ({ currentTime, currentLyricIndex, currentLyricText }) => {
        // 时间变化
        if (currentTime && !this.data.isSliderChanging) {
          const sliderValue = (currentTime / this.data.durationTime) * 100;
          this.setData({ currentTime, sliderValue });
        }
        // 歌词变化
        currentLyricIndex &&
          this.setData({
            currentLyricIndex,
            lyricScrollTop: currentLyricIndex * 35
          });
        currentLyricText && this.setData({ currentLyricText });
      }
    );

    // 3、监听播放模式相关的数据
    playerStore.onStates(
      ['playModeIndex', 'isPlaying'],
      ({ playModeIndex, isPlaying }) => {
        if (playModeIndex !== undefined) {
          this.setData({
            playModeIndex,
            playModeName: playModeNames[playModeIndex]
          });
        }

        if (isPlaying !== undefined) {
          this.setData({
            isPlaying,
            playingName: isPlaying ? 'pause' : 'resume'
          });
        }
      }
    );
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {}
});
