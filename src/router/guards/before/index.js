/** 路由前置守衛，負責進入路由前執行 */
import nav from './nav'
import checkLogin from './check-login'
import locale from './locale'

/**
 * 這裡的陣列編排順序很重要，
 * 要先檢查是否可以進入頁面，
 * 才可以變更NavigationBar的狀態
 * */
export default [locale, checkLogin, nav]
