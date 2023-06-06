// 解析歌词
// [00:58.65]
const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

export function parseLyric(lyricString) {
  const lyricStrings = lyricString.split('\n');

  const lyricInfos = [];
  for (const lineString of lyricStrings) {
    // [00:58.65]他们说 要缝好你的伤 没有人爱小丑
    const timeResult = timeRegExp.exec(lineString);
    if (!timeResult) continue;
    // 1.获取时间
    const minute = timeResult[1] * 60 * 1000; // 分
    const second = timeResult[2] * 1000; // 秒
    const millsecondTime = timeResult[3]; // 毫秒
    const millsecond =
      millsecondTime.length === 2 ? millsecondTime * 10 : millsecondTime * 1;
    const time = minute + second + millsecond;

    // 2.获取歌词
    const text = lineString.replace(timeRegExp, '');
    lyricInfos.push({ time, text });
  }

  return lyricInfos;
}
