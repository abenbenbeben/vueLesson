var items = [
  {
    name: "万年筆",
    price: 100,
    quantity: 0,
  },
  {
    name: "ノート",
    price: 400,
    quantity: 0,
  },
  {
    name: "消しゴム",
    price: 500,
    quantity: 0,
  },
];

var vm = new Vue({
  el: "#app",
  data: {
    items: items,
  },
  filters: {
    numberWithDelimiter: function (value) {
      if (!value) {
        return "0";
      }
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  computed: {
    //算出プロパティ
    totalPrice: function () {
      return this.items.reduce(function (sum, item) {
        return sum + item.price * item.quantity;
      }, 0);
    },
    totalPriceWithTax: function () {
      return Math.floor(this.totalPrice * 1.08);
    },
    canBuy: function () {
      return this.totalPrice >= 1000; //1000円以上から購入可能にする
    },
    errorMessageStyle: function () {
      return {
        border: this.canBuy ? "" : "1px solid red",
        color: this.canBuy ? "" : "red",
      };
    },
  },
});

window.vm = vm;

vm.$watch(
  function () {
    //鉛筆の個数
    return this.items[0].quantity;
  },
  function (quantity) {
    console.log(quantity);
  }
);

Vue.set(vm.items[0], "quantity", vm.items[0].quantity + 1); // quantity をインクリメント
