import Vue from 'vue';
import Router from 'vue-router';
import Home from '../pages/home/index';
import About from '../pages/about/index';
import Contact from '../pages/contact/index';
import Partner from '../pages/partner/index';
import Register from '../pages/register/index';

Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/about',
            name: 'about',
            component: About
        },
        {
            path: '/contact',
            name: 'contact',
            component: Contact
        },
        {
            path: '/partner',
            name: 'partner',
            component: Partner
        },
        {
            path: '/sign_up',
            name: 'register',
            component: Register
        }
    ]
});