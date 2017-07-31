/*
 * 自定义服务。all services
 * @Date 2016-08-20
 */
/**
 * [数据相关的公共service]
 */
var commonService = angular.module("common.service",[]);
commonService.factory("DPUtil", ["$rootScope", "UIUtil", "$http", "$filter",
    function($rootScope, UIUtil, $http, $filter) {
        var _this = {};
        /**
         * [createContextPath 获取绝对路径]
         * @return {[type]} [description]
         */
        _this.getContextPath = function() {　
            var pathName = document.location.pathname;　
            var index = pathName.substr(1).indexOf("/");　
            var result = pathName.substr(0, index + 1);　
            return result;
        };
        /**
         * [getQueryString 获取路径中参数]
         * @param  {[type]} name [description]
         * @return {[type]}      [description]
         */
        _this.getQueryString = function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2])
            };
            return null;
        };

        /**
         * [angular的post请求]
         * @param {object} params [包含着请求参数的对象]
         * @param  {[string]} url         [请求地址]
         * @param  {[object]} data        [请求参数]     
         * @param  {[function]} success [成功回调函数]
         * @param  {[function]} error   [失败回调函数]
         * @param  {[number]} status_load两个状态false和true，true是有加载状态的 
         */
        _this.httpPost = function(params) {
            if (!params.status_load) { //默认打开
                $rootScope.loading = false;
            }
            var req = {
                method:'POST',
                url: _this.getContextPath() + params.url,
                // url:"http://120.24.47.11:8080/washclothes"+ params.url,
                data: params.data
            };
            if (params.headers) {
                req.headers = params.headers;
            };
            // 判断是否session超时
            /*$http({ method: "POST", url: _this.getContextPath() + "/has_logined.do" }).then(function(data) {
                if (!data.data.success) {
                    window.location.href = _this.getContextPath() + "/view/login.html";
                };
            }, function(e) {
                window.location.href = _this.getContextPath() + "/view/login.html";
            });*/
            $http(req).then(function(data) {
                if (data) {
                    params.success(data.data);
                    $rootScope.loading = true;
                } else {
                    if (params.error && angular.isFunction(params.error)) {
                        params.error(data.data);
                    } else {
                        UIUtil.alert({ content: data.data.message });
                    };
                    $rootScope.loading = true;
                };
            }, function(e) {
                if (params.error && angular.isFunction(params.error)) {
                    params.error(e);
                } else {
                    UIUtil.alert({ content: e });
                };
                $rootScope.loading = true;
            });
        };

        /**
         * [angular的post请求]
         * @param {object} params [包含着请求参数的对象]
         * @param  {[string]} url         [请求地址]
         * @param  {[object]} data        [请求参数]     
         * @param  {[function]} success [成功回调函数]
         * @param  {[function]} error   [失败回调函数]
         * @param  {[number]} status_load两个状态false和true，true是有加载状态的 
         */
        _this.httpGet = function(params) {
            if (!params.status_load) { //默认打开
                $rootScope.loading = false;
            }
            var req = {
                method:'get',
                url: _this.getContextPath() + params.url,
                // url:"http://120.24.47.11:8080/washclothes"+ params.url,
                params: params.data
            };
            if (params.headers) {
                req.headers = params.headers;
            };
            // 判断是否session超时
            /*$http({ method: "POST", url: _this.getContextPath() + "/has_logined.do" }).then(function(data) {
                if (!data.data.success) {
                    window.location.href = _this.getContextPath() + "/view/login.html";
                };
            }, function(e) {
                window.location.href = _this.getContextPath() + "/view/login.html";
            });*/
            $http(req).then(function(data) {
                if (data) {
                    params.success(data.data);
                    $rootScope.loading = true;
                } else {
                    if (params.error && angular.isFunction(params.error)) {
                        params.error(data.data);
                    } else {
                        UIUtil.alert({ content: data.data.message });
                    };
                    $rootScope.loading = true;
                };
            }, function(e) {
                if (params.error && angular.isFunction(params.error)) {
                    params.error(e);
                } else {
                    UIUtil.alert({ content: e });
                };
                $rootScope.loading = true;
            });
        };

        /**
         * [getPagination 存储分页码]
         * @return {[object]} [返回分页码]
         */
        _this.getPagination = function() {
            //每页数量选择，默认每页10条
            var page_size_arr = [
                { name: 10, value: 10 },
                { name: 20, value: 20 },
                { name: 30, value: 30 },
                { name: 50, value: 50 },
                { name: 100, value: 100 }
            ];
            return page_size_arr;
        };
        /**
         * [initPage 初始化分页组件]
         * @param  {[type]} scope [控制器的$scope作用域]
         * @param  {[type]} obj [包含查询参数的对象]
         * @param  {[type]} index [初始化选择的页数下标]
         * @return {[type]}       [description]
         */
        _this.initPage = function(scope,obj,index){
            //每页数量选择，默认每页10条
            var page_size_arr = [
                { name: 10, value: 10 },
                { name: 20, value: 20 },
                { name: 30, value: 30 },
                { name: 50, value: 50 },
                { name: 100, value: 100 }
            ];
            if (!index) {
                index = 0;
            }
            scope.page_size_arr = page_size_arr;
            scope.page_size = page_size_arr[index];
            obj.page = 1;
            obj.rows = scope.page_size.value;
        };
        /**
         * [addNumber 计算增加list列表序号]
         * @param {[type]} data [description]
         * @param {[type]} page [description]
         * @param {[type]} rows [description]
         */
        _this.addNumber = function(data, page, rows) {
            for (var i = 0; i < data.rows.length; i++) {
                data.rows[i].number = (page - 1) * rows + i + 1;
            }
            return data;
        };

        /**
         * [getSelect 遍历返回唯一选择的对象]
         * @param  {[array]} datas [遍历的数组对象，选择的属性为selected]
         * @return {[object]}       [返回选择的对象]
         */
        _this.getSelect = function(datas) {
            var data = "";
            for (var i = 0; i < datas.length; i++) {
                if (datas[i].selected) {
                    data = datas[i];
                    break;
                };
            };
            return data;
        };

        /**
         * [getSelect 遍历返回选择的对象]
         * @param  {[array]} datas [遍历的数组对象，选择的属性为checked]
         * @return {[Array]}       [返回选择的对象数组]
         */
        _this.getChecked = function(datas) {
            var data = [];
            for (var i = 0; i < datas.length; i++) {
                if (datas[i].checked) {
                    data.push(datas[i]);
                };
            };
            return data;
        };

        /**
         * [hasChecked 判断是否有选择]
        * @param  {[array]} datas [遍历的数组对象，选择的属性为checked]
         * @return {Boolean}      [返回判断结果]
         */
        _this.hasChecked = function(data) {
            if (data) {
                var has = _this.getChecked(data);
                if (has.length > 0) {
                    return true;
                }
            }
            return false;
        };

        /**
         * [cleanQuery 清空查询对象]
         * @param  {[object]} query_param [查询对象]
         */
        _this.cleanQuery = function(query_param) {
            for (query in query_param) {
                if (query == "page" || query == "rows") {
                    continue;
                } else {
                    query_param[query] = "";
                }
            };
        };

        /**
         * [getDateToString 日期转字符]
         * @param  {[type]} date   [日期对象]
         * @param  {[type]} format [格式化]
         */
        _this.getDateToString = function(date, format) {
            if (!format) {
                format = "yyyy-MM-dd"
            };
            if (angular.isDate(date) && angular.isString(format)) {
                return $filter('date')(date, format);
            }
        };

        /**
         * [getStringToDate 字符串转日期]
         * @param  {[type]} string [日期字符串，格式：yyyy-MM-dd]
         */
        _this.getStringToDate = function(string) {
            if (angular.isString(string)) {
                return new Date(string.replace(/-/g, "/"));
            }
        };

        return _this;
    }
]);
commonService.factory("UIUtil", ["$rootScope", "$uibModal",
    function($rootScope, $uibModal) {
        /*数据页面操作处理service*/
        /**
         * 与前端界面相关的工具类
         */
        var _this = {
            alert: function(tip) {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'backHomeTpl/directiveTpl/alert.html',
                    keyboard: false,
                    size: "sm",
                    backdrop: 'static',
                    controller: ["$scope", "$uibModalInstance", "$rootScope",
                        function($scope, $uibModal, $rootScope) {
                            $scope.title = tip.title || "提示";
                            $scope.content = tip.content || "提示";
                            $scope.ok = function() {
                                if (typeof tip.ok == "function") {
                                    tip.ok();
                                }
                                $uibModal.close();
                            };
                        }
                    ]
                });
            },
            comfirm: function(tip) {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'backHomeTpl/directiveTpl/comfirm.html',
                    keyboard: false,
                    backdrop: 'static',
                    size: "sm",
                    controller: ["$scope", "$uibModalInstance", "$sce", "$compile",
                        function($scope, $uibModal, $sce, $compile) {
                            $scope.title = tip.title || "提示";
                            $scope.content = $sce.trustAsHtml(tip.content);
                            // $scope.content = $compile(tip.content)($scope);
                            $scope.cancel_btn = tip.cancel_btn || "关闭";
                            $scope.ok_btn = tip.ok_btn || "确定";
                            $scope.ok = function() {
                                if (typeof tip.ok == "function") {
                                    tip.ok();
                                }
                                $uibModal.close();
                            };
                            $scope.cancel = function() {
                                if (typeof tip.cancel == "function") {
                                    tip.cancel();
                                }
                                $uibModal.close();
                            };
                        }
                    ]
                });
            }
        };
        return _this;
    }
]);
// };
