var backHomeService = angular.module("backHome.service",['common.service']);
/*--------------------------------客户service---------------------------------------*/
backHomeService.factory("customerService", ["DPUtil", "$q",
    function(DPUtil, $q) {
        var _this = {
            list: function(param) {
                var defered = $q.defer();
                DPUtil.httpPost({
                    url: "/view/json/customer.json",
                    data: {
                        page: param.page,
                        rows: param.rows
                    },
                    success: function(datas) {
                        defered.resolve(datas);
                    }
                });
                return defered.promise;
            }

        };
        return _this;
    }
]);
/*--------------------------------用户service---------------------------------------*/
backHomeService.factory("userService", ["DPUtil", "$q",
    function(DPUtil, $q) {
        var _this = {
            myPrivilegeList: function(param) {
                var defered = $q.defer();
                DPUtil.httpPost({
                    url: "/view/json/privilege.json",
                    data: {
                    },
                    success: function(datas) {
                        defered.resolve(datas);
                    }
                });
                return defered.promise;
            }

        };
        return _this;
    }
]);