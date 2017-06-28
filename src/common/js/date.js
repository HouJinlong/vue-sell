export function formatDate(date, str) {
  if (/(y+)/.test(str)) {
    str = str.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));// 会根据 yy  和 yyyy不同返回不同的
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(str)) {
      let newstr = o[k] + '';
      str = str.replace(RegExp.$1, (RegExp.$1.length === 1) ? newstr : padLefZero(newstr));
    }
  }
  return str;
};
function padLefZero(newstr) {
  return ('00' + newstr).substr(newstr.length);
}
