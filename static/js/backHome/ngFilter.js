/**
 * 
 * @authors Tao (972990430@qq.com)
 * @date    2017-07-04 17:31:09
 * @version $Id$
 */

var backHome = angular.module("backHomeApp");
backHome.filter("zhongshenjieguo", [function() {
    return function(param) {
        var result = "";
        switch (param) {
            case 0:
                result = "拒绝";
                break;
            case 1:
                result = "通过";
                break;
            case 2:
                result = "待定";
                break;
            default:
                result = "";
        }
        return result;
    }
}]);
