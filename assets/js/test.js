
const quest = document.getElementById('box_title');
const ans1 = document.getElementById('ans-1');
const ans2 = document.getElementById('ans-2');
const ans3 = document.getElementById('ans-3');
const points = new Array(3);
const num = document.getElementById('diag-count');
let idx = 0;

const que1 = [
  `Q.歯磨きは何回？`,
  `■しない`, 0,
  `■1回〜2回`, 0,
  `■3回以上`, 0
];

const que2 = [
  `Q.歯磨き後にフロスは使用している？`,
  `■してる`, 0,
  `■たまに`, 2,
  `■3回以上`, 3
];

const que3 = [
  `Q.虫歯経験`,
  `■なったことがない`, 1,
  `■1〜3本`, 2,
  `■4本以上`, 3
];

const ques = [que1, que2, que3]

function test() {
  // for (let i = 1; i <= 3; i++) {
  //   eval("console.log(ans" + i + ");");
  // }
  console.log(ans3)
}

function quebox() {
  const que = ques[idx];
  num.innerHTML = "0" + idx + "/03";
  quest.innerHTML = que[0];
  ans1.innerHTML = que[1];
  ans2.innerHTML = que[3];
  ans3.innerHTML = que[5];
}

function ansbox(ap) {
  document.getElementById("que-box").style.display = "none";
  if (ap[0] < ap[1] || ap[2] < ap[1]) {

    document.getElementById("kekka2").style.display = "block";

  } else if (ap[0] < ap[2] || ap[1] < ap[2]) {

    document.getElementById("kekka3").style.display = "block";

  } else {

    document.getElementById("kekka1").style.display = "block";

  }

}

function clickevent(ans) {
  if (ans > 0 || idx >= 2) {

    const que = ques[idx];
    points[idx] = que[ans];
    const point = [0, 0, 0];
    for (let i = 0; i < points.length; i++) {
      if (points[i] == 1) {
        ++point[0];
      } else if (points[i] == 2) {
        ++point[1];
      } else if (points[i] == 3) {
        ++point[2];
      }
    }
    ansbox(point);

  } else {

    if (ans > 0) {
      points[idx] = que[ans];
      ++idx;
    } else if (idx > 0) {
      --idx;
    }
    quebox();
  }
}