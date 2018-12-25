import Vue from 'vue';
import Router from 'vue-router';
import Home from '../pages/home/index';
import About from '../pages/about/index';
import Contact from '../pages/contact/index';
import Partner from '../pages/partner/index';
import Register from '../pages/register/index';
import User from '../pages/user/index';
import UserHome from '../pages/user/home';
import UserMessage from '../pages/user/message';
import UserBidList from '../pages/user/bid-list';
import UserBidResult from '../pages/user/bid-result';
import UserCompany from '../pages/user/company';
import UserMan from '../pages/user/man';
import UserArea from '../pages/user/area';
import UserServiceType from '../pages/user/service-type';
import UserCompanyAchievement from '../pages/user/company-achievement';
import UserAccount from '../pages/user/account';
import UserPassword from '../pages/user/password';
import UserLoginLog from '../pages/user/login-log';

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
        },
        {
            path: '/user/:id',
            component: User,
            children: [
                {
                    path: '',
                    name: 'user_home',
                    component: UserHome
                },
                {
                    path: 'messages',
                    name: 'user_messages',
                    component: UserMessage
                },
                {
                    path: 'bids',
                    name: 'user_bid',
                    component: UserBidList
                },
                {
                    path: 'bid_result',
                    name: 'user_bid_result',
                    component: UserBidResult
                },
                {
                    path: 'company',
                    name: 'user_company',
                    component: UserCompany
                },
                {
                    path: 'man',
                    name: 'user_man',
                    component: UserMan
                },
                {
                    path: 'area',
                    name: 'user_area',
                    component: UserArea
                },
                {
                    path: 'servicetype',
                    name: 'user_service_type',
                    component: UserServiceType
                },
                {
                    path: 'company_achievement',
                    name: 'user_company_achievement',
                    component: UserCompanyAchievement
                },
                {
                    path: 'accounts',
                    name: 'user_account',
                    component: UserAccount
                },
                {
                    path: 'edit_pwd',
                    name: 'user_change_pwd',
                    component: UserPassword
                },
                {
                    path: 'loginlog',
                    name: 'user_login_log',
                    component: UserLoginLog
                },
            ]
        }
    ]
});