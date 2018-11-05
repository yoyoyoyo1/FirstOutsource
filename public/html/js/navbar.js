Vue.component('navbar', {
    template: `
    <nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container-fluid">
      <div class="navbar-header">
        <a class="navbar-brand" href="#">学校财务管理软件</a>
      </div>
      <div id="navbar" class="navbar-collapse collapse">
        <ul class="nav navbar-nav navbar-right">
          <li>
            <a href="../../index.html">登出</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
    `,
    data() {
      return {
        user: {}
      }
    },
    mounted() {
    },
  })
 new Vue({
    el: '#navbar',
  })