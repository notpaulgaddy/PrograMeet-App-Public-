export function FormatTime(currtime) {
  let strArr = currtime.split(" ");
  let strArr2 = strArr[1].split("");
  let str = "";

  let now = Date.now();
  if (strArr[1] === "minutes") {
    for (let i = 0; i < 3; i++) {
      str += strArr2[i];
    }
  } else {
    str = strArr[1];
  }
  let part1 = strArr[0];

  if (strArr[1] === "day" && part1 === "a") {
    str = "yesterday";
    part1 = "";
  }
  if (part1 === "an") {
    part1 = "1";
  }
  return part1 + " " + str;
}
