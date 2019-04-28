class Float {
  constructor() {
    console.log(this);
  }

  add(a, b) {
    var c, d, e;
    try {
      c = a.toString().split(".")[1].length;
    } catch (f) {
      c = 0;
    }
    try {
      d = b.toString().split(".")[1].length;
    } catch (f) {
      d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (this.multiply(a, e) + this.multiply(b, e)) / e;
  }

  subtract(a, b) {
    var c, d, e;
    try {
      c = a.toString().split(".")[1].length;
    } catch (f) {
      c = 0;
    }
    try {
      d = b.toString().split(".")[1].length;
    } catch (f) {
      d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (this.multiply(a, e) - this.multiply(b, e)) / e;
  }

  multiply(a, b) {
    let c = 0,
      d = a.toString(),
      e = b.toString();
    try {
      c += d.split(".")[1].length;
    } catch (f) {}
    try {
      c += e.split(".")[1].length;
    } catch (f) {}
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
  }

  divide(a, b) {
    let c, d, e, f = 0;
    try {
      e = a.toString().split(".")[1].length;
    } catch (g) {}
    try {
      f = b.toString().split(".")[1].length;
    } catch (g) {}
    return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), this.multiply(c / d, Math.pow(10, f - e));
  }
}

module.exports = Float;
// 示例 如需多个数运算可自行修改代码 
// console.log(float.add(0.1, 0.2)); //0.3
// console.log(float.subtract(0.1, 0.2)); //-0.1
// console.log(float.multiply(0.1, 0.2)); //0.02
// console.log(float.divide(0.1, 0.2)); //0.5