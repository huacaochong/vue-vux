<template>
  <div>
    <scroller :on-refresh="getList" :on-infinite="infinite" ref="scroller">
        <template v-for="item in items">
            <cell :title="item.title" :link="'/order/'+item.id" :key="item.id"></cell>
        </template>
    </scroller>
  </div>
</template>

<script>
    import { Cell } from 'vux'
    import { mapState, mapActions } from 'vuex'
    import VueScroller from 'vue-scroller'
    import helper from '@/mixins/helper'

    export default {
        components: { VueScroller,Cell },
        mixins: [helper],
        data () {
            return {

            }
        },
        computed: {
            ...mapState({
                items: state => state.example.items.data,
                nomore: state => state.example.items.nomore,
                loaded: state => state.example.items.loaded
            })
        },
        mounted () {
            this.showLoading()
            this.getList(()=>{
                this.hideLoading()
            })
        },
        watch:{

        },
        methods: {
            ...mapActions({
                getList: 'example/getList',
                loadMore: 'example/loadMore'
            }),
            infinite (cb) {
                let self = this
                if(this.nomore) {
                    setTimeout(()=>{
                        self.$refs.scroller.finishInfinite(2);
                    })
                    return;
                }
                this.loadMore(() => {
                    self.$refs.scroller.resize();
                    cb()
                })
            }
        }
    }
</script>

<style lang="less">

</style>
