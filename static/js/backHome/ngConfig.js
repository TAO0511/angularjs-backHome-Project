/**
 * 后台管理系统路由配置
 */
// module.exports = function(backHomeApp) {
// 整个工程的主模块，依赖ngRoute子模块（第三方插件）
var backHomeApp = angular.module("backHomeApp", ['ui.router', 'ui.bootstrap','common.service','common.filter','common.directive','backHome.filter','backHome.service','backHome.ctrl']);
//权限控制
backHomeApp.run(['$rootScope', '$location','userService',
    function($rootScope, $location,userService) {
        $rootScope.$on('$stateChangeSuccess', function(evt, next, current) {
            var is_can = false;
            //判断是否加载权限菜单
            if (!$rootScope.mencs) {
                userService.myPrivilegeList().then(function(data) {
                $rootScope.datas = data;
                $rootScope.mencs = [];
                for (var i = 0; i < data.length; i++) {
                    $rootScope.mencs.push(data[i].url);
                    for (var j = 0; j < data[i].children.length; j++) {
                        $rootScope.mencs.push(data[i].children[j].url);
                        if ("/"+data[i].children[j].url == next.url) {
                            is_can = true;
                            data[i].active = true;
                            data[i].current = true;
                            data[i].child_open = true;
                            data[i].children[j].active = true;
                        }
                    }
                    if ("/"+data[i].url == next.url) {
                        is_can = true;
                        data[i].active = true;
                        data[i].current = true;
                    }
                }
                if (!is_can) {
                    $location.path("/home");
                }
                });
            } else {
                for (var i = 0; i < $rootScope.mencs.length; i++) {
                    if ("/"+$rootScope.mencs[i] == next.url) {
                        is_can = true;
                    }
                }
                if (!is_can) {
                    $location.path("/home");
                }
            }
        });
    }
]);
// ngRoute提供的route模块的配置
backHomeApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");
    $stateProvider
        .state('home', {
            url: "/home",
            templateUrl: "page/home.html"
        })
        .state('customerManage', {
            url: "/customerManage",
            templateUrl: "page/customerManage.html"
        })
        .state('userManage', {
            url: "/userManage",
            templateUrl: "page/userManage.html"
        })
});

/**
 * 配置angular.js的$http服务，解决使用post提交表单时后台获取不到数据的问题。
 *
 * @see http://my.oschina.net/buwei/blog/191640
 * @param  {String}
 * @return {[type]}
 */
backHomeApp.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function(obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                }
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
}]);
// };
