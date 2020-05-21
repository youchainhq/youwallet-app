/**
 * Created by stephen@ihuanqu.com on 11/03/2018.
 */

class Navigation {
  constructor() {
    this.tabs = [];
    this.rootNavigation = null;

    this.isShowingVerifyModal = false;
  }

  setTab(index, tab) {
    this.tabs[index] = tab;
  }

  switchTab(route) {
    this.rootNavigation && this.rootNavigation.navigate(route);
  }

  navigate(index, route, params) {
    this.tabs[index] && this.tabs[index].navigate(route, params);
  }

  pop() {
    this.rootNavigation && this.rootNavigation.pop();
  }

  popToTop() {
    this.rootNavigation && this.rootNavigation.popToTop();
  }
}

export default new Navigation();
