<template>
  <transition enter-active-class="animated slideInRight"  leave-active-class="animated slideOutRight">
    <div id="food" v-show="showFlag" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" alt=""/>
          <div class="back" @click="hide">
            <i class="h-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title" v-text="food.name"></h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper" ref="cart">
            <cartcontrol  :drop-ball="dropBall" :food="food"></cartcontrol>
          </div>
          <transition enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
            <div class="buy" @click="addFirst(this, $event)" v-show="!food.count || food.count === 0">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text" v-text="food.info"></p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <rating-select :select-text="selectText" :ratingMsg="ratingMsg" :ratings="food.ratings"></rating-select>
        </div>
        <div class="rating-wrapper">
          <ul v-show="food.ratings && food.ratings.length">
            <li v-show="newShow(rating.rateType,rating.text)" class="rating-item border-1px" v-for="rating in food.ratings">
              <div class="user">
                <span class="name" v-text="rating.username"></span>
                <img :src="rating.avatar" class="avatar" width="12" height="12" alt=""/>
              </div>
              <div class="time">
                {{rating.rateTime | DateTime}}
              </div>
              <p class="text">
                <span :class="{'h-thumb_up':rating.rateType===0,'h-thumb_down':rating.rateType===1}"></span>
                {{rating.text}}
              </p>
            </li>
          </ul>
          <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import BScroll from 'better-scroll';
  import {formatDate} from '../../common/js/date.js';
  import cartcontrol from '../cartcontrol/cartcontrol.vue';
  import split from '../split/split.vue';
  import ratingSelect from '../ratingselect/ratingselect.vue';
//     const GOOD = 0;
//     const BAD = 1;
     const ALL = 2;

  export default {
    props: {
      food: {
        type: Object
      },
      dropBall: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        ratingMsg: {
          selectType: ALL,
          onlyContent: false
        },
        selectText: {
          all: '全部',
          good: '推荐',
          bad: '吐槽'
        }
      };
    },
    watch: {
      ratingMsg: {
        handler: function () {
          this.$nextTick(() => {
            if (!this.foodScroll) {
              this.foodScroll = new BScroll(this.$refs.food, {
                click: true
              });
            } else {
              this.foodScroll.refresh();
            };
          });
        },
        deep: true
      }
    },
    methods: {
      show() {
        this.showFlag = true;
//        重置状态
        this.ratingMsg = {
          selectType: ALL,
          onlyContent: false
        };
      },
      hide() {
        this.showFlag = false;
      },
      addFirst(el, event) {
        if (!event._constructed) {
          return;
        };
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        } else {
          return;
        };
        this.dropBall.ball = this.$refs.cart;
        this.dropBall.time = new Date();
      },
      newShow(type, text) {
        if (this.ratingMsg.onlyContent && !text) {
          return false;
        }
        if (this.ratingMsg.selectType === ALL) {
          return true;
        } else {
          return type === this.ratingMsg.selectType;
        }
      }
    },
    filters: {
      DateTime (time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      cartcontrol,
      split,
      ratingSelect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  #food
    position:fixed
    top: 0
    left:0
    bottom: 40px
    z-index:30
    width:100%
    background:#fff
    .image-header
      position:relative
      width:100%
      height:0
      padding-top:100%
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position:absolute
        top:10px
        left:0
        background:rgba(0,0,0,.5)
        border-radius:50%
        i
          display:block
          padding:10px
          font-size:20px
          color:#fff
    .content
      position: relative
      padding: 18px
      .title
        line-height: 16px
        margin-bottom: 8px
        font-size: 16px
        font-weight: 700
        color: rgb(7, 17, 27)
      .detail
        margin-bottom: 18px
        line-height: 10px
        height: 10px
        font-size: 0
        .sell-count, .rating
          font-size: 10px
          color: rgb(147, 153, 159)
        .sell-count
          margin-right: 12px
      .price
        font-weight: 700
        line-height: 24px
        .now
          margin-right: 8px
          font-size: 14px
          color: rgb(240, 20, 20)
        .old
          text-decoration: line-through
          font-size: 10px
          color: rgb(147, 153, 159)
    .cartcontrol-wrapper
      position: absolute
      right: 12px
      bottom: 12px
    .buy
      position: absolute
      right: 18px
      bottom: 18px
      z-index: 10
      height: 24px
      line-height: 24px
      padding: 0 12px
      box-sizing: border-box
      border-radius: 12px
      font-size: 10px
      color: #fff
      background: rgb(0, 160, 220)
    .info
      padding: 18px
      .title
        line-height: 16px
        margin-bottom: 6px
        font-size: 16px
        color: rgb(7, 17, 27)
      .text
        line-height: 24px
        padding: 0 8px
        font-size: 12px
        color: rgb(77, 85, 93)
    .rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: 14px
        color: rgb(7, 17, 27)
    .rating-wrapper
      padding: 0 18px 20px
      .rating-item
        position: relative
        padding: 16px 0
        border-1px(rgba(7, 17, 27, 0.1))
        .user
          position: absolute
          right: 0
          top: 16px
          line-height: 12px
          font-size: 0
          .name
            display: inline-block
            margin-right: 6px
            vertical-align: top
            font-size: 10px
            color: rgb(147, 153, 159)
          .avatar
            border-radius: 50%
        .time
          margin-bottom: 6px
          line-height: 12px
          font-size: 10px
          color: rgb(147, 153, 159)
        .text
          line-height: 16px
          font-size: 12px
          color: rgb(7, 17, 27)
          .h-thumb_up, .h-thumb_down
            margin-right: 4px
            line-height: 16px
            font-size: 12px
          .h-thumb_up
            color: rgb(0, 160, 220)
          .h-thumb_down
            color: rgb(147, 153, 159)
      .no-rating
        padding: 16px 0
        font-size: 12px
        color: rgb(147, 153, 159)
        text-align:center
</style>
