var commonDirective = angular.module("common.directive",[]);
// 动态设置内容最小高度
commonDirective.directive("xyMaxheight", [function() {
    return {
        restrict: "A",
        link: function(scope, element, attr) {
            var height = document.documentElement.clientHeight - 40;
            $(element).css({ "minHeight": height });
        }
    }
}]);
// 左侧菜单栏
commonDirective.directive("toggleMenc", [function() {
    return {
        restrict: "A",
        link: function(scope, element, attr) {
            var status = true; //menc处于打开或关闭状态
            var $menc = $("#" + attr.mencid); //指令指定左侧的菜单id
            var $content = $("#" + attr.contentid); //指令指定右侧的内容id
            //绑定指令点击事件
            element.on("click", function() {
                if (status) {
                    shrinkMenc();
                    status = false;
                    for (var i = 0; i < scope.datas.length; i++) {
                        scope.$apply(function() {
                            scope.datas[i].child_open = false;
                        });
                    }
                    //当菜单回缩状态下时，增加绑定点击任何菜单时会调用显示菜单
                    //并且解绑click事件
                    $menc.find("li.menc").on("click", function() {
                        showMenc();
                        status = true;
                        $menc.find("li.menc").off("click");
                    });
                } else {
                    showMenc();
                    status = true;
                }
            });

            //二级菜单开关
            scope.toggleMenc = function(menc) {
                if (menc.url) {
                    scope.pathUrl(menc.url);
                    for (var i = 0; i < scope.datas.length; i++) {
                        scope.datas[i].current = false;
                        scope.datas[i].active = false;
                        scope.datas[i].child_open = false;
                        for (var j = 0; j < scope.datas[i].children.length; j++) {
                            scope.datas[i].children[j].active = false;
                        }
                    }
                    menc.active = true;
                    menc.current = true;
                    return;
                };
                if (!menc.child_open) {
                    for (var i = 0; i < scope.datas.length; i++) {
                        scope.datas[i].child_open = false;
                        if (!scope.datas[i].current) {
                            scope.datas[i].active = false;
                        }
                    }
                }
                menc.active = true;
                menc.child_open = !menc.child_open;
            };

            scope.clickChildMenc = function(menc, child_menc) {
                for (var i = 0; i < scope.datas.length; i++) {
                    scope.datas[i].current = false;
                    scope.datas[i].active = false;
                    for (var j = 0; j < scope.datas[i].children.length; j++) {
                        scope.datas[i].children[j].active = false;
                    }
                }
                menc.current = true;
                menc.active = true;
                child_menc.active = true;
                scope.pathUrl(child_menc.url || menc.url);
            };

            //回缩菜单
            function shrinkMenc() {
                $menc.find("li.menc").each(function() {
                    $(this).find("span").each(function(i) {
                        if (i != 0) {
                            $(this).addClass("hidden");
                        }
                    });
                    $(this).find(">a").css("padding-left", "0.25rem");
                });
                $menc.css("width", "1.5rem");
                $content.css({ "margin-left": "1.5rem", "padding-right": "1.5rem" });
                element.removeClass("glyphicon-chevron-left").addClass("glyphicon-chevron-right");
            };

            //显示菜单
            function showMenc() {
                $menc.find("li.menc").each(function() {
                    $(this).find("span").removeClass("hidden");
                    $(this).find(">a").css("padding", "0.4rem 0 0.4rem 0.5rem");
                });
                $menc.css("width", "7.5rem");
                $content.css({ "margin-left": "7.5rem", "padding-right": "7.5rem" });
                element.removeClass("glyphicon-chevron-right").addClass("glyphicon-chevron-left")
            }
        }
    }
}]);
/**
 * [省市区3级联动]
 */
commonDirective.directive("pccUnite", ["$http", function($http) {
    var directive = {
        restrict: "EA",
        templateUrl: "backHomeTpl/directiveTpl/PCCUnite.html",
        link: function(scope, element, attrs) {
            $http.get("json/province_city.json").success(function(data) {
                scope.provinces = data;
                if (attrs.province) {
                    selectPcc(attrs.province, attrs.city, attrs.county);
                }
            });

            //grade表示需要多少级联动，默认为3级联动
            if (attrs.grade) {
                if (attrs.grade == 1) {
                    scope.hide_city = true;
                    scope.hide_county = true;
                } else if (attrs.grade == 2) {
                    scope.hide_county = true;
                }
            };

            //选择省份
            scope.chooseProvince = function() {
                if (scope.province) {
                    if (scope.province.sub) {
                        scope.citys = scope.province.sub;
                        scope.countys = '';
                    };
                } else {
                    scope.citys = '';
                    scope.countys = '';
                }
                scope.is_dirty = true;
            };
            //选择市区
            scope.chooseCity = function() {
                if (scope.city) {
                    if (scope.city && scope.city.sub) {
                        scope.countys = scope.city.sub;
                    };
                } else {
                    scope.countys = '';
                }
                scope.is_dirty = true;
            };
            //选择县区
            scope.chooseCounty = function() {
                scope.is_dirty = true;
            };

            //重置
            scope.resetPcc = function() {
                scope.province = "";
                scope.citys = '';
                scope.countys = '';
            };

            /**
             * [selectPcc 设置默认值]
             * @param  {[string]} province [省份]
             * @param  {[string]} city     [市县]
             * @param  {[string]} county   [区镇]
             */
            var selectPcc = function(province, city, county) {
                //遍历province设定省份
                for (var i = 0; i < scope.provinces.length; i++) {
                    if (scope.provinces[i].name == province) {
                        scope.province = scope.provinces[i];
                        scope.chooseProvince();
                        if (scope.citys) {
                            //判断是否有市县，遍历city设定市县
                            for (var j = 0; j < scope.citys.length; j++) {
                                if (scope.citys[j].name == city) {
                                    scope.city = scope.citys[j];
                                    scope.chooseCity();
                                    if (scope.countys) {
                                        //判断是否有区镇，设定区镇
                                        for (var k = 0; k < scope.countys.length; k++) {
                                            if (scope.countys[k].name == county) {
                                                scope.county = scope.countys[k];
                                            }
                                        } //end countys for
                                    };
                                };
                            } //end citys for
                        };
                    };
                } //end province for
            };
            /*
             指令传invalid参数则调用省市校验，界面调用以下参数控制验证是否通过
             * @param  {[string]} invalid_pcc [省市区]
             * @param  {[string]} invaild_province     [省]
             * @param  {[string]} invaild_city   [市]
             * @param  {[string]} invaild_countys   [区]
             * @param  {[string]} is_dirty   [三级联动是否使用啦]
             */
            if (attrs.invalid) {
                //省市校验
                scope.$watch("province", function(newValue, oldValue, scope) {
                    if (newValue) {
                        scope.invaild_province = true;
                    } else {
                        scope.invaild_province = false;
                    }
                    console.log(scope.is_dirty);
                    scope.invalid_pcc = !scope.invaild_province || !scope.invaild_city || !scope.invaild_countys;
                });
                scope.$watch("city", function(newValue, oldValue, scope) {
                    if (newValue) {
                        scope.invaild_city = true;
                        if (scope.countys) {
                            scope.$watch("county", function(newValue, oldValue, scope) {
                                if (newValue) {
                                    scope.invaild_countys = true;
                                } else {
                                    scope.invaild_countys = false;
                                }
                                scope.invalid_pcc = !scope.invaild_province || !scope.invaild_city || !scope.invaild_countys;
                            });
                        } else {
                            scope.invaild_countys = true;
                        }
                    } else {
                        scope.invaild_city = false;
                    }
                    scope.invalid_pcc = !scope.invaild_province || !scope.invaild_city || !scope.invaild_countys;
                });
            };
        }
    };
    return directive;
}]);
// 复选内容
commonDirective.directive("checkAllBox", [function() {
    return {
        restrict: "A",
        scope: true,
        link: function(scope, element, attr) {
            //选择all
            scope.checkAll = function() {
                for (var i = 0; i < scope.data.length; i++) {
                    scope.data[i].checked = scope.all_checked;
                    scope.data[i].selected = scope.all_checked;
                }
            };

            //选择行
            scope.checkRow = function(box) {
                box.checked = !box.checked;
                scope.checkBox(box);
            };

            //选择复选框
            scope.checkBox = function(box, event) {
                if (event) {
                    event.stopPropagation();
                }
                box.selected = !box.selected;
                var all = 0;
                var no_all = 0;
                for (var i = 0; i < scope.data.length; i++) {
                    if (scope.data[i].checked) {
                        all++;
                    } else {
                        no_all++;
                    }
                }
                if (all == scope.data.length) {
                    scope.all_checked = true;
                } else {
                    scope.all_checked = false;
                };
            };
            //单纯选择，不涉及全选
            scope.checkKey = function(box) {
                box.checked = !box.checked;
            };
        }
    }
}]);
//单选内容
commonDirective.directive("simpleSelect", [function() {
    return {
        restrict: "A",
        link: function(scope, element, attr) {
            scope.selectRow = function(book) {
                if (book.selected) {
                    book.selected = false;
                    return;
                }
                for (var i = 0; i < scope.data.length; i++) {
                    scope.data[i].selected = false;
                }
                book.selected = true;
            };
        }
    };
}]);
/**
 * [tabs切换]
 */
commonDirective.directive("tabs", [function() {
    var directive = {
        restrict: "A",
        templateUrl: "",
        link: function(scope, element, attrs) {
            var $tabs = element.find(".tab li");
            var $contents = element.find("div.tab-content");
            var i;
            $tabs.each(function(i) {
                if (i == 0) {
                    $(this).addClass("checked-tab");
                }
            });
            $contents.each(function(i) {
                if (i != 0) {
                    $(this).addClass("hidden");
                }
            });
            $tabs.on("click", function() {
                $(this).addClass("checked-tab").siblings().removeClass('checked-tab');
                element.find("div.tab-content").addClass("hidden");
                $("#" + $(this).attr("tab-for")).removeClass("hidden");
                var index = $(this).index();
                if (index == 1) {
                    $('#tongbi').css('display', 'block');
                    $('#queryBtn').css('display', 'block');
                    $('#riqichajian').css('display', 'none');
                } else {
                    $('#tongbi').css('display', 'none');
                    $('#queryBtn').css('display', 'none');
                    $('#riqichajian').css('display', 'block');
                }
            });
        }
    };
    return directive;
}]);
// 手风琴
commonDirective.directive("accordionPanel", [function() {
    var directive = {
        restrict: "A",
        link: function(scope, element, attrs) {
            var $panel = element.children('.panel');
            $panel.on('click', '.panel-heading', function(event) {
                var $right = $(this).find('.glyphicon-chevron-right'),$down = $(this).find('.glyphicon-chevron-down'),$body = $(this).parent().find('.panel-body').show();
                // 隐藏
                if ($right.hasClass('hidden')) {
                    $right.removeClass('hidden');
                    $down.addClass('hidden');
                    $body.addClass('hidden');
                }else{
                    $panel.find('.glyphicon-chevron-down').addClass('hidden');
                    $panel.find('.glyphicon-chevron-right').removeClass('hidden');
                    $right.addClass('hidden');
                    $down.removeClass('hidden');
                    $panel.find('.panel-body').addClass('hidden');
                    $body.removeClass('hidden');
                }
            });
        }
    };
    return directive;
}]);