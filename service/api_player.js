import lxRequest from './index';

export function getSongDetail(ids) {
  return lxRequest.get('/song/detail', {
    ids
  });
}

// 获取歌词
export function getSongLyric(id) {
  return lxRequest.get('/lyric', {
    id
  });
}
