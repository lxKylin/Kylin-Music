export default function stringToNodes(keyword, value) {
  const nodes = [];
  // startsWith是否以某某开头
  if (keyword.toUpperCase().startsWith(value.toUpperCase())) {
    const key1 = keyword.slice(0, value.length);
    // 有点像虚拟DOM
    const node1 = {
      name: "span",
      attrs: { style: "color: #26ce8a; font-size: 14px;" },
      children: [{ type: "text", text: key1 }],
    };
    nodes.push(node1);

    const key2 = keyword.slice(value.length);
    const node2 = {
      name: "span",
      attrs: { style: "color: #000000; font-size: 14px;" },
      children: [{ type: "text", text: key2 }],
    };
    nodes.push(node2);
  } else {
    const node = {
      name: "span",
      attrs: { style: "color: #000000; font-size: 14px;" },
      children: [{ type: "text", text: keyword }],
    };
    nodes.push(node);
  }
  return nodes;
}
