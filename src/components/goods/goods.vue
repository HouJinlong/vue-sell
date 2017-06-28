<template>
    <div id="goods">
        <div class="menu-wrapper" ref="menu">
          <ul>
            <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}"
                @click="selectMenu(index,$event)">
              <span class="text border-1px">
                <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
              </span>
            </li>
          </ul>
        </div>
        <div class="foods-wrapper" ref="foodsWrapper">
          <ul>
            <li  v-for="item in goods" class="food-list" ref="foodList">
              <h1 v-text="item.name" class="title"></h1>
              <ul>
                <li @click="onFood(food,$event)" v-for="food in item.foods" class="food-item border-1px">
                  <div class="icon">
                    <img width="57px" height="57px" :src="food.icon" alt=""/>
                  </div>
                  <div class="content">
                    <h2 class="name" v-text="food.name"></h2>
                    <p class="desc" v-text="food.description"></p>
                    <div class="extra" >
                      <span class="count">月售{{food.sellCount}}份</span>
                      <span>好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                      <span class="now">￥{{food.price}}</span>
                      <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                    <div class="cartcontrol-wrapper">
                      <cartcontrol :dropBall="dropBall" :food="food"></cartcontrol>
                    </div>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <shopcart ref="shopcart" :drop-ball="dropBall" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
        <food :drop-ball="dropBall" :food="selectedFood" ref="foodObj"></food>
    </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import shopcart from '../shopcart/shopcart.vue';
  import cartcontrol from '../cartcontrol/cartcontrol.vue';
  import food from '../food/food.vue';

  const ERR_OK = 0;
    export default {
        name: 'goods',
        data() {
          return {
            goods: [],
            classMap: [],
            listHeight: [],
            scrollY: 0,
            dropBall: {
              ball: null,
              time: null
            },
            selectedFood: {}
          };
        },
        props: {
          seller: {
            type: Object
          }
        },
        watch: {
          dropBall: {
            handler: function (dropBall) {
              //  体验优化 异步执行动画
              this.$nextTick(() => {
                this.$refs.shopcart.drop(dropBall.ball);
              });
            },
            deep: true
          }
        },
        computed: {
          currentIndex() {
            for (let i = 0; i < this.listHeight.length; i++) {
              let height1 = this.listHeight[i];
              let height2 = this.listHeight[i + 1];
              if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                return i;
              }
            }
            return 0;
          },
          selectFoods() {
            let foods = [];
            this.goods.forEach((good) => {
              good.foods.forEach((food) => {
                if (food.count) {
                  foods.push(food);
                }
              });
            });
            return foods;
          }
        },
        mounted() {
           this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
           this.$http.get('/api/goods').then((response) => {
            response = response.data;
            if (response.errno === ERR_OK) {
              this.goods = response.data;
              this.$nextTick(() => {       //  3 在这个函数中调用以防内容还未加载完就执行，获取不到元素的高度导致无法滑动
//                  console.log(this);   // 可以打印看看this的内容
                  this._initScroll();
                  this._calculateHeight();
               });
            };
          });
         },
        methods: {
          selectMenu(index, event) {
            if (!event._constructed) {
              return;
            }
            let foodList = this.$refs.foodList;
            let el = foodList[index];
            this.foodsScroll.scrollToElement(el, 300);
          },
          _initScroll () {         // 2 函数声明
             this.menuScroll = new BScroll(this.$refs.menu, {
               click: true
             });           //  2.注意此处是 this.$refs.xxx
             this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
               click: true,
               probeType: 3
             });
            this.foodsScroll.on('scroll', (pos) => {
              this.scrollY = Math.abs(Math.round(pos.y));
            });
          },
          _calculateHeight() {
            let foodList = this.$refs.foodList;
            let height = 0;
            this.listHeight.push(height);
            for (let i = 0; i < foodList.length; i++) {
              let item = foodList[i];
              height += item.clientHeight;
              this.listHeight.push(height);
            };
          },
          onFood(food, event) {
            if (!event._constructed) {
              return;
            }
            this.selectedFood = food;
            this.$refs.foodObj.show();
          }
      },
      components: {
        shopcart,
        cartcontrol,
        food
      }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  #goods
    display:flex
    position:absolute
    top:174px
    bottom:46px
    width:100%
    overflow:hidden
    .menu-wrapper
      flex:0 0 80px
      width:80px
      background:#f3f5f7
      .menu-item
        display:table
        height:54px
        width:56px
        padding:0 12px
        line-height:14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
        .icon
          display:inline-block
          width:12px
          height:12px
          margin-right:2px
          background-size:12px 12px
          background-repeat:no-repeat
          &.decrease
             bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display:table-cell
          vertical-align:middle
          width:56px
          border-1px(rgba(7,17,27,0.1))
          font-size:12px
    .foods-wrapper
      flex:1
      .title
        padding-left:14px
        height:26px
        line-height:26px
        border-left:2px solid #d9dde1
        font-size:12px
        color:rgb(147,153,159)
        background:#f3f5f7
      .food-item
        display:flex
        margin:18px
        padding-bottom:18px
        border-1px(rgba(7,17,27,0.1))
        &:last-child:after
          display:none
          margin-bottom:0
        .icon
          flex: 0 0 57px
          margin-right:10px
        .content
          flex:1
          .name
            margin:2px 0 8px 0
            height:14px
            line-height:14px
            font-szie:14px
            color:rgb(7,17,27)
          .desc,.extra
            line-height:10px
            font-size:10px
            color:rgb(147,153,159)
          .desc
            margin-bottom:8px
          .extra
            .count
              margin-right:10px
          .price
            font-weight:700
            line-height:24px
            .now
              margin-right:8px
              font-size:14px
              color:rgb(240,20,20)
             .old
              text-decoration:line-through
              font-size:10px
              color:rgb(147,153,159)
          .cartcontrol-wrapper
            position:absolute
            bottom:12px
            right:0
</style>
