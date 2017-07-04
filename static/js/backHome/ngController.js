/*---------------------------------------主程序入口-------------------------------*/
backHomeApp.controller('indexController', ["$scope", "$rootScope", "$location", "$uibModal", "DPUtil", "UIUtil","$state",
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
backHomeApp.controller('homeController', ['$scope', '$location',
    function($scope, $location) {

    }
]);
/*-------------------------------------------客户管理--------------------------------*/
backHomeApp.controller('customerManageCtrl', ['$scope', "DPUtil", "customerService",  "$uibModal", "UIUtil",
    function($scope, DPUtil, customerService, $uibModal, UIUtil) {
        $scope.role = {};
        DPUtil.initPage($scope,$scope.role);
        /**
         * [query 查询]
         */
        $scope.query = function(type) {
            if (type) {
                $scope.role.page = 1;
            };
            customerService.list($scope.role).then(function(data) {
                $scope.data = data.rows;
                $scope.total = data.total;
            });
        };
        $scope.query();


        /**
         * [changePageSize 分页数量]
         */
        $scope.changePageSize = function() {
            $scope.role.rows = $scope.page_size.value;
            $scope.role.page = 1;
            $scope.query();
        };

        $scope.clearQuery = function(){
            DPUtil.cleanQuery($scope.role);
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
        $scope.update = function() {
            var role = DPUtil.getSelect($scope.data);
            if (role.length == 0) {
                UIUtil.alert({ content: "请选择一个账号！" });
            } else {
                customerService.find(role.id).then(function(data) {
                    if (data.code == 0) {
                        _fn.showUpdate(data.data);
                    };
                });
            }
        };

        /**
         * [del 删除]
         */
        $scope.del = function() {
            var role = DPUtil.getSelect($scope.data);
            if (role.length == 0) {
                UIUtil.alert({ content: "请选择一个账号！" });
            } else {
                UIUtil.comfirm({
                    content: "是否删除选定的账号？",
                    ok: function() {
                        customerService.del(role.id).then(function() {
                            $scope.query();
                            UIUtil.alert({ content: "删除成功！" });
                        });
                    }
                });
            }
        };

        /**
         * [_fn 私有方法对象]
         * @type {Object}
         */
        var _fn = {
            /**
             * [showAdd 显示窗口]
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
                            add_scope.cancel = function(){
                                uibModal.close();
                            }
                        }
                    ]
                });
            },
            showUpdate: function(data) {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'update.html',
                    keyboard: false,
                    backdrop: 'static',
                    size: "lg",
                    controller: ["$scope", "$uibModalInstance",
                        function(update_scope, uibModal) {
                            
                        }
                    ]
                });
            }
        }; //end _fn
    }
]);