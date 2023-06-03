import lxRequest from "./index";

export function getSearchHot() {
  return lxRequest.get("/search/hot");
}

export function getSearchSuggest(keywords) {
  return lxRequest.get("/search/suggest", {
    keywords,
    type: "mobile", // 移动端
  });
}

export function getSearchResult(keywords) {
  return lxRequest.get("/search", {
    keywords,
  });
}
