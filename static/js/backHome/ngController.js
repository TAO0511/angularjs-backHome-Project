/*---------------------------------------主程序入口-------------------------------*/
var backHomeCtrl = angular.module("backHome.ctrl",[]);
backHomeCtrl.controller('indexController', ["$scope", "$rootScope", "$location", "$uibModal", "DPUtil", "UIUtil","$state",
    function($scope, $rootScope, $location, $uibModal, DPUtil, UIUtil,$state) {
        //通用路径跳转
        $scope.pathUrl = function(url) {
            $state.go(url);
        };
        //右侧导航条目
        $rootScope.datas = [{
            id: "index",
            children: [],
            icon: "glyphicon glyphicon-home",
            name: "主页",
            url: "home",
            type: '1',
            paixu: 1
        },  {
            id: "user",
            children: [],
            icon: "glyphicon glyphicon-user",
            name: "客户管理",
            url: "customerManage",
            type: '1',
            paixu: 4
        }];
        $scope.getOut = function() {
            UIUtil.comfirm({
                content: "是否退出账号？",
                ok: function() {
                    window.location.href = DPUtil.getContextPath() + "/view/login.html";
                }
            });
        };
        $scope.changePassword = function() {
            $uibModal.open({
                animation: true,
                templateUrl: 'backHomeTpl/businessTpl/changePassword.html',
                keyboard: false,
                backdrop: 'static',
                size: "pw",
                controller: ["$scope", "$uibModalInstance",
                    function(scope, uibModal) {
                        scope.cancel = function() {
                            uibModal.close();
                        };
                        scope.ok = function() {
                            if (scope.new_password == scope.repeat_password) {
                                UIUtil.alert({ content: "修改成功！" });
                            } else {
                                UIUtil.alert({ content: "输入密码不一致！" });
                            }
                        };
                    } //end fn
                ]
            }); //end open
        };
        $rootScope.loading = true;
    }
]);

/*-------------------------------------------主页--------------------------------*/
backHomeCtrl.controller('homeController', ['$scope', '$location',
    function($scope, $location) {

    }
]);
/*-------------------------------------------客户管理--------------------------------*/
backHomeCtrl.controller('customerManageCtrl', ['$scope', "DPUtil", "customerService",  "$uibModal", "UIUtil",
    function($scope, DPUtil, customerService, $uibModal, UIUtil) {
        $scope.conditions = {};//查询的参数
        // 初始化分页组件
        DPUtil.initPage($scope,$scope.conditions);
        /**
         * [query 查询]
         */
        $scope.query = function() {
            customerService.list($scope.conditions).then(function(data) {
                $scope.data = data.rows;
                $scope.total = data.total;
            });
        };
        $scope.query();
        /**
         * [changePageSize 分页数量]
         */
        $scope.changePageSize = function() {
            $scope.conditions.rows = $scope.page_size.value;
            $scope.conditions.page = 1;
            $scope.query();
        };

        $scope.clearQuery = function(){
            DPUtil.cleanQuery($scope.conditions);
        }

        /**
         * [add 新增]
         */
        $scope.add = function() {
            _fn.showAdd();
        };

        /**
         * [update]
         */
        $scope.update = function(data) {
            _fn.showUpdate(data);
        };
        /**
         * [detail]
         */
        $scope.detail = function(data) {
            _fn.showDetail(data);
        };
        /**
         * [del 删除]
         */
        $scope.delete = function() {
            UIUtil.comfirm({
                content: "是否删除选定的账号？",
                ok: function() {
                    UIUtil.alert({ content: "删除成功！" });
                }
            });
        };

        /**
         * [_fn 私有方法对象]
         * @type {Object}
         */
        var _fn = {
            /**
             * [showAdd 显示新增窗口]
             * @return {[type]} [description]
             */
            showAdd: function() {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'add.html',
                    keyboard: false,
                    backdrop: 'static',
                    size: "lg",
                    controller: ["$scope", "$uibModalInstance",
                        function(add_scope, uibModal) {
                            add_scope.title = "新增";
                            add_scope.cancel = function(){
                                uibModal.close();
                            }
                            add_scope.ok = function(){
                                uibModal.close();
                            }
                        }
                    ]
                });
            },
            /**
             * [showUpdate 显示修改窗口]
             * @param  {[type]} data [修改对象的数据]
             * @return {[type]}      [description]
             */
            showUpdate: function(data) {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'add.html',
                    keyboard: false,
                    backdrop: 'static',
                    size: "lg",
                    controller: ["$scope", "$uibModalInstance",
                        function(update_scope, uibModal) {
                            update_scope.title = "修改";
                            update_scope.customer = data;
                            update_scope.cancel = function(){
                                uibModal.close();
                            }
                            update_scope.ok = function(){
                                uibModal.close();
                            }
                        }
                    ]
                });
            },
            /**
             * [showDetail 显示修改窗口]
             * @param  {[type]} data [修改对象的数据]
             * @return {[type]}      [description]
             */
            showDetail: function(data) {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'detail.html',
                    keyboard: false,
                    backdrop: 'static',
                    size: "md",
                    controller: ["$scope", "$uibModalInstance",
                        function(detail_scope, uibModal) {
                            detail_scope.title = "详情";
                            detail_scope.customer = data;
                            detail_scope.cancel = function(){
                                uibModal.close();
                            }
                        }
                    ]
                });
            }
        }; //end _fn
    }
]);
/*-------------------------------------------用户管理--------------------------------*/
backHomeCtrl.controller('userManageCtrl', ['$scope', "DPUtil", "customerService",  "$uibModal", "UIUtil",
    function($scope, DPUtil, customerService, $uibModal, UIUtil) {
        $scope.conditions = {};//查询的参数
        // 初始化分页组件
        DPUtil.initPage($scope,$scope.conditions);
        /**
         * [query 查询]
         */
        $scope.query = function() {
            customerService.list($scope.conditions).then(function(data) {
                $scope.data = data.rows;
                $scope.total = data.total;
            });
        };
        $scope.query();
        /**
         * [changePageSize 分页数量]
         */
        $scope.changePageSize = function() {
            $scope.conditions.rows = $scope.page_size.value;
            $scope.conditions.page = 1;
            $scope.query();
        };

        $scope.clearQuery = function(){
            DPUtil.cleanQuery($scope.conditions);
        }

        /**
         * [add 新增]
         */
        $scope.add = function() {
            _fn.showAdd();
        };

        /**
         * [update]
         */
        $scope.update = function(data) {
            _fn.showUpdate(data);
        };
        /**
         * [detail]
         */
        $scope.detail = function(data) {
            _fn.showDetail(data);
        };
        /**
         * [del 删除]
         */
        $scope.delete = function() {
            if (!DPUtil.getChecked($scope.data).length) {
                UIUtil.alert({content:"请至少选择一项"});
                return false;
            }
            UIUtil.comfirm({
                content: "是否删除选定的账号？",
                ok: function() {
                    UIUtil.alert({ content: "删除成功！" });
                }
            });
        };

        /**
         * [_fn 私有方法对象]
         * @type {Object}
         */
        var _fn = {
            /**
             * [showAdd 显示新增窗口]
             * @return {[type]} [description]
             */
            showAdd: function() {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'add.html',
                    keyboard: false,
                    backdrop: 'static',
                    size: "lg",
                    controller: ["$scope", "$uibModalInstance",
                        function(add_scope, uibModal) {
                            add_scope.title = "新增";
                            add_scope.cancel = function(){
                                uibModal.close();
                            }
                            add_scope.ok = function(){
                                uibModal.close();
                            }
                        }
                    ]
                });
            },
            /**
             * [showUpdate 显示修改窗口]
             * @param  {[type]} data [修改对象的数据]
             * @return {[type]}      [description]
             */
            showUpdate: function(data) {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'add.html',
                    keyboard: false,
                    backdrop: 'static',
                    size: "lg",
                    controller: ["$scope", "$uibModalInstance",
                        function(update_scope, uibModal) {
                            update_scope.title = "修改";
                            update_scope.customer = data;
                            update_scope.cancel = function(){
                                uibModal.close();
                            }
                            update_scope.ok = function(){
                                uibModal.close();
                            }
                        }
                    ]
                });
            },
            /**
             * [showDetail 显示修改窗口]
             * @param  {[type]} data [修改对象的数据]
             * @return {[type]}      [description]
             */
            showDetail: function(data) {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'detail.html',
                    keyboard: false,
                    backdrop: 'static',
                    size: "md",
                    controller: ["$scope", "$uibModalInstance",
                        function(detail_scope, uibModal) {
                            detail_scope.title = "详情";
                            detail_scope.customer = data;
                            detail_scope.cancel = function(){
                                uibModal.close();
                            }
                        }
                    ]
                });
            }
        }; //end _fn
    }
]);