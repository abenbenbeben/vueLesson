Vue.directive("fallback-image", {
  bind: function (el, binding) {
    console.log("bind", binding);
    var once = binding.modifiers.once; //修飾子
    el.addEventListener("error", function onError() {
      el.src = binding.value;
      if (once) {
        el.removeEventListener("error", onError);
      }
    });
  },
  update: function (el, binding) {
    console.log("update", binding);
    if (binding.oldValue !== binding.value && binding.oldValue === el.src) {
      el.src = binding.value;
    }
  },
});

var vm = new Vue({
  el: "#app",
  data: function () {
    return {
      altText: "logo",
      noImageURL: "https://dummyimage.com/400x400/000/ffffff.png&text=no+image",
    };
  },
});
