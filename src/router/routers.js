export default [{
            path: '/about11',
            component: () => import(/* webpackChunkName: "about" */ '/Users/zhengyunqing/Documents/zhengyunqing/jd-project/src/views/About.vue')
        },{
            path: '/home',
            component: () => import('/Users/zhengyunqing/Documents/zhengyunqing/jd-project/src/views/Home.vue')
        }]