import Vue from 'vue'
import '@/libs/vantUI'
import '@/libs/cubeUI'
//百度统计,解决spa页面的统计问题
import baiduAnalytics from 'vue-baidu-analytics'
import echarts from '@/libs/echartsUI'
//瀑布流显示
import waterfall from 'vue-waterfall2'
import VCalendar from 'v-calendar'
//解决ios的弹性回弹问题
import Bounce from 'vue-bounce'

import store from '@/vuex/store'
import App from '@/App.vue'
import router from '@/router'
import { config } from '@/config'

Vue.use(Bounce)
Vue.use(VCalendar)
Vue.use(waterfall)
Vue.prototype.$echarts = echarts

router.beforeEach((to, from, next) => {
  next()
})

Vue.use(baiduAnalytics, {
  router: router,
  siteIdList: [process.env.BAIDUTONGJI_SITEID],
  isDebug: false,
})

kintone.events.on('mobile.portal.show', (event) => {
  const contentSpaceElement = kintone.mobile.portal.getContentSpaceElement()
  Vue.config.productionTip = false
  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount(contentSpaceElement)
  return event
})
