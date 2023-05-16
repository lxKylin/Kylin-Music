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
const rankingStore = new HYEventStore({
  state: {
    // 热门榜单
    hotRanking: {},
  },
  actions: {
    getRankingdataAction(ctx) {
      // 飙升榜
      getRankings(19723756).then((res) => {
        ctx.hotRanking = res.playlist;
      });
    },
  },
});

export { rankingStore };
