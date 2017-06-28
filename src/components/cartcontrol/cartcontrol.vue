<template>
  <div id="cartcontrol">
    <transition enter-active-class="animated rollIn" leave-active-class="animated rollOut">
      <div class="cart-decrease h-remove_circle_outline" v-show="food.count>0"  @click.stop="decreaseCart($event)"></div>
    </transition>
    <div class="cart-count" v-show="food.count>0" v-text="food.count"></div>
    <div class="cart-add h-add_circle" @click.stop="addCart($event)"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';

  export default {
    name: 'cartcontrol',
    props: {
      food: {
        type: Object
      },
      dropBall: {
        type: Object
      }
    },
    methods: {
      addCart(event) {
        if (!event._constructed) {
          return;
        }
//      console.log('addCart');
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count ++;
        }
         this.dropBall.ball = event.target;
         this.dropBall.time = new Date();
      },
      decreaseCart(event) {
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count --;
        }
      }
   }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #cartcontrol
    font-size:0
    .cart-decrease,.cart-add
      display:inline-block
      line-height:24px
      font-size:24px
      padding:6px
      color:#00a0dc
    .cart-count
      display:inline-block
      vertical-align:top
      width:12px
      padding-top:6px
      line-height:24px
      font-size:10px
      color:rgb(147,153,159)
</style>
