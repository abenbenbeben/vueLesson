var UserTemplate = `
<div>
    <div class="loading" v-if="loading">読み込み中</div>
        <div v-if="error" class="error">
            {{ error }}
        </div>
    <div v-else>
        <div>ユーザー一覧ページです</div>
        <div v-for="user in users" :key="user.id">
            <h2>{{ user.name }}</h2>
        </div>
    </div>
</div>
`;

var UserDetailTemplate = `
    <div>
        <div class="loading" v-if="loading">読み込み中</div>
        <div v-if="error" class="error">
            {{ error }}
        </div>
        <div v-if="user">
            <h2>{{ user.name }}</h2>
            <p>{{ user.description }}</p>
        </div>
    </div>
`;

var UserList = {
  template: UserTemplate,
  data: function () {
    return {
      loading: false,
      users: function () {
        return [];
      }, //初期値の空配列
      error: null,
    };
  },
  created: function () {
    this.fetchData();
  },

  watch: {
    $route: "fetchData",
  },
  methods: {
    fetchData: function () {
      this.loading = true;
      getUsers(
        function (err, users) {
          this.loading = false;
          if (err) {
            this.error = err.toString();
          } else {
            this.users = users;
          }
        }.bind(this)
      );
    },
  },
};

var UserDetail = {
  template: UserDetailTemplate,
  data: function () {
    return {
      loading: false,
      user: null,
      error: null,
    };
  },
  created: function () {
    this.fetchData;
  },
  watch: {
    $route: "fetchData",
  },
  methods: {
    fetchData: function () {
      this.loading = true;
      getUser(
        this.$route.params.userId,
        function (err, user) {
          this.loading = false;
          if (err) {
            this.error = err.toString();
          } else {
            this.user = user;
          }
        }.bind(this)
      );
    },
  },
};

var UserData = [
  {
    id: 1,
    name: "Takuya Tejima",
    description: "東南アジアで働くエンジニア",
  },
  {
    id: 2,
    name: "Yuichi Abe",
    description: "将来10億を稼ぐ男",
  },
];

var getUsers = function (callback) {
  setTimeout(function () {
    callback(null, UserData);
  }, 1000);
};

var getUser = function (userId, callback) {
  setTimeout(function () {
    var filteredUsers = UserData.filter(function (user) {
      return user.id === parseInt(userId, 10);
    });
    callback(null, filteredUsers && filteredUsers[0]);
  }, 1000);
};

var router = new VueRouter({
  routes: [
    {
      path: "/top",
      component: {
        template: "<div>トップページです</div>",
      },
    },
    {
      path: "/users",
      component: UserList,
    },
    {
      path: "/users/:userId",
      component: UserDetail,
    },
  ],
});

var app = new Vue({
  router: router,
}).$mount("#app");
