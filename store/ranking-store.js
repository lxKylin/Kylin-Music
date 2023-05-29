// 排行榜数据
import { HYEventStore } from "hy-event-store";

import { getRankings } from "../service/api_music";

/**
 * playlist/detail?id=
 * 新歌榜：3779629
 * 热歌榜：3778678
 * 原创榜：2884035
 * 飙升榜：19723756
 */
const rankingMap = {
  3779629: "newRanking",
  3778678: "hotRanking",
  2884035: "originRanking",
  19723756: "upRanking",
};

const songList = [3779629, 3778678, 2884035, 19723756];
const rankingStore = new HYEventStore({
  state: {
    newRanking: {}, // 0: 新歌
    hotRanking: {}, // 1: 热门
    originRanking: {}, // 2: 原创
    upRanking: {}, // 3: 飙升
  },
  actions: {
    getRankingdataAction(ctx) {
      for (let i = 0; i < songList.length; i++) {
        getRankings(songList[i]).then((res) => {
          const rankingName = rankingMap[songList[i]];
          ctx[rankingName] = res.playlist;
        });
      }
    },
  },
});

export { rankingStore };
