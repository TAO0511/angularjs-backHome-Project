/*--------------------------------客户service---------------------------------------*/
backHomeApp.factory("customerService", ["DPUtil", "$q",
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
                        defered.resolve(DPUtil.addNumber(datas, param.page, param.rows));
                    }
                });
                return defered.promise;
            }

        };
        return _this;
    }
]);