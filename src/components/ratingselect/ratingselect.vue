<template>
  <div id="rating-select">
    <div class="rating-type border-1px">
      <span class="btn good" @click="select(2,$event)" :class="{'active':ratingMsg.selectType === 2}">
        {{selectText.all}}
        <span class="count">{{ratings.length}}</span>
      </span>
      <span class="btn good" @click="select(0,$event)" :class="{'active':ratingMsg.selectType === 0}">
        {{selectText.good}}
        <span class="count">{{positives.length}}</span>
      </span>
      <span class="btn bad" @click="select(1,$event)" :class="{'active':ratingMsg.selectType === 1}">
        {{selectText.bad}}
        <span class="count" >{{negatives.length}}</span>
      </span>
    </div>
    <div class="switch" :class="{'on':ratingMsg.onlyContent}" @click="toggleOnlyContent">
      <span class="h-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const GOOD = 0;
  const BAD = 1;
//  const ALL = 2;

  export default {
    props: {
      ratings: {
        type: Array,
        default() {
          return [];
        }
      },
      ratingMsg: {
        type: Object,
        selecType: {
          type: Number
        },
        onlyContent: {
          type: Boolean,
          default: false
        }
      },
      selectText: {
        type: Object,
        default() {
            return {
              all: '全部',
              good: '满意',
              bad: '不满意'
            };
          }
      }
    },
    computed: {
      positives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === GOOD;
        });
      },
      negatives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === BAD;
        });
      }
    },
    methods: {
      select(type, event) {
        if (!event._constructed) {
          return;
        }
        this.ratingMsg.selectType = type;
      },
      toggleOnlyContent() {
        if (!event._constructed) {
          return;
        }
        this.ratingMsg.onlyContent = !this.ratingMsg.onlyContent;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  #rating-select
    .rating-type
      padding: 18px 0
      margin: 0 18px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size: 0
      .btn
        display: inline-block
        padding: 8px 12px
        margin-right: 8px
        line-height: 16px
        border-radius: 1px
        font-size: 12px
        color: rgb(77, 85, 93)
        &.active
          color: #fff
        .count
          margin-left: 2px
          font-size: 8px
        &.good
          background: rgba(0, 160, 220, 0.2)
          &.active
            background: rgb(0, 160, 220)
        &.bad
          background: rgba(77, 85, 93, 0.2)
          &.active
            background: rgb(77, 85, 93)
    .switch
      padding: 12px 18px
      line-height: 24px
      border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      color: rgb(147, 153, 159)
      font-size: 0
      &.on
        .h-check_circle
          color: #00c850
      .h-check_circle
        display: inline-block
        vertical-align: top
        margin-right: 4px
        font-size: 24px
      .text
        display: inline-block
        vertical-align: top
        font-size: 12px
</style>
