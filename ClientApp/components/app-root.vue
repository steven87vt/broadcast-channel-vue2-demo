<template>
  <div id="app">
    <div class="container-fluid">
      <div class="row flex-xl-nowrap">
        <main class="col-12 main pt-3 pb-0 px-3" role="main">
          <keep-alive>
            <router-view class="view"/>
          </keep-alive>
        </main>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import HomePage from "./home-page";

Vue.component("home-page", HomePage);
export default {
}
</script>
