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

var CreateUserTemplate = `
    <div>
        <div class="sending" v-if="sending">Sending...</div>
        <div>
          <h2>新規ユーザー作成</h2>
          <div>
            <label>名前：</label>
            <input type="text" v-model="user.name">
          </div>
          <div>
            <label>説明文：</label>
            <textarea v-model="user.description"></textarea>
          </div>
          <div v-if="error" class="error">
            {{ error }}
          </div>
          <div>
            <input type="button" @click="createUser" value="送信">
          </div>
        </div>
    </div>
`;

var LoginTemplate = `
  <div>
    <h2>Login</h2>
    <p v-if="$route.query.redirect">
      ログインしてください
    </p>
    <form @submit.prevent = "login">
      <label><input v-model="email" placeholder="email"></label>
      <label><input v-model="pass" placeholder="password" type="password"></label>
      <br>
      <button type="submit">ログイン</button>
      <p v-if="error" class="error">ログインに失敗しました</p>
    </form>
  </div>
`;

var Auth = {
  login: function (email, pass, cb) {
    setTimeout(function () {
      if (email === "vue@example.com" && pass === "vue") {
        localStorage.token = Math.random().toString(36).substring(7);
        if (cb) {
          cb(true);
        }
      } else {
        if (cb) {
          cb(false);
        }
      }
    }, 0);
  },

  logout: function () {
    delete localStorage.token;
  },

  loggedIn: function () {
    return !!localStorage.token;
  },
};

var Login = {
  template: LoginTemplate,
  data: function () {
    return {
      email: "vue@example.com",
      pass: "",
      errpr: false,
    };
  },
  methods: {
    login: function () {
      Auth.login(
        this.email,
        this.pass,
        function (loggedIn) {
          if (!loggedIn) {
            this.error = true;
          } else {
            this.$router.replace(this.$route.query.redirect || "/");
          }
        }.bind(this)
      );
    },
  },
};

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

// ユーザー作成画面
var postUser = function (params, callback) {
  setTimeout(function () {
    params.id = UserData.length + 1;
    UserData.push(params);
    callback(null, params);
  }, 1000);
};

var UserCreate = {
  template: CreateUserTemplate,
  data: function () {
    return {
      sending: false,
      user: this.defaultUser(),
      error: null,
    };
  },

  created: function () {},

  methods: {
    defaultUser: function () {
      return {
        name: "",
        description: "",
      };
    },
    createUser: function () {
      if (this.user.name.trim() === "") {
        this.error = "Nameは必須です";
        return;
      }
      if (this.user.description.trim() === "") {
        this.error = "Descriptionは必須です";
        return;
      }
      postUser(
        this.user,
        function (err, user) {
          this.sending = false;
          if (err) {
            this.error = this.defaultUser();
            alert("新規ユーザーが登録されました");
            this.$router.push("/user");
          }
        },
        bind(this)
      );
    },
  },
};

// ユーザー詳細画面
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

// ユーザー一覧取得
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

// ルーター
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
      path: "/users/new",
      component: UserCreate,
      beforeEnter: function (to, from, next) {
        if (!Auth.loggedIn()) {
          next({
            path: "/login",
            query: { redirect: to.fullPath },
          });
        } else {
          //認証済みであれば、そのまま新規ユーザー作成画面へ進む
          next();
        }
      },
    },
    {
      path: "/users/:userId",
      component: UserDetail,
    },
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/logout",
      beforeEnter: function (to, from, next) {
        Auth.logout();
        next("/");
      },
    },
  ],
});

var app = new Vue({
  data: {
    Auth: Auth,
  },
  router: router,
}).$mount("#app");
