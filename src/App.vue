<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab boder-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
        </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script  type="text/ecmascript-6">
  import header from './components/header/header.vue';
  import {urlParse} from './common/js/url.js';

  const ERR_OK = 0;
  export default {
    name: 'app',
    data() {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse();
            return queryParam.id;
          })()
        }
      };
    },
    mounted() {
      this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
//        console.log(response);
        response = response.data;
        // 判断装状态
        if (response.errno === ERR_OK) {
//          console.log(response.data);
//          this.seller = response.data;
//              对象扩展属性的方法，把id加到 data.json的seller里面
          this.seller = Object.assign({}, this.seller, response.data);
//          console.log(this.seller);
        };
      });
    },
    components: {
      'v-header': header
    }
  };
</script>

<style  lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl";
  #app
    .tab
      display:flex
      width:100%
      height:40px
      line-height:40px
      /*border-bottom:1px solid*/
      border-1px(rgba(7,17,20,0.1))
      .tab-item
        flex:1
        text-align:center
        & > a
          display:block
          font-size:14px
          color:rgb(77,85,93)
          &.active
            color:#f01414
</style>
