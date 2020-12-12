'use strict'

const Vue = require('vue/dist/vue.js')

// library
const { Observable } = require('rxjs')
const {
  map,
  scan,
  pluck,
  merge,
  tap,
  filter,
  startWith,
} = require('rxjs/operators')

Vue.config.productionTip = false
Vue.use(VueRx)

const nextTick = Vue.nextTick
