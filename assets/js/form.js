(function($){

  /*↓↓↓↓↓ 都道府県選択用#form__prefectures-select_2 ↓↓↓↓↓*/
  $(function(){
    $('select').on('change',function(){
      $(this).css('color',$(this).find('option:selected').get(0).style.color);
      }).trigger('change');
  });
  /*↑↑↑↑↑ 都道府県選択用#form__prefectures-select_2 ↑↑↑↑↑*/

  $(window).on('load', function(){
    let
    $viewArea = $('.case__toggle'),
    $body = $('.case__table'),
    $trigger = $('.toggle-btn');

    $viewArea.children('figure').hide();
    $trigger.off();

    $trigger.on('click', function(event) {
        event.preventDefault();
        $(this).toggleClass('is-active');
        $(this).prev($body).stop(true,true).slideToggle();
    });
  });

  jQuery.easing.easeOutQuart = function(x,t,b,c,d){
      return -c * ((t=t/d-1)*t*t*t - 1) + b;
  }

  $(function(){

    $('a[href^="#"]').click(function() {
      var speed = 1000;
      var href= $(this).attr("href");
      var target = $(href == "#" || href == "" ? 'html' : href);
      var position = target.offset().top;
      $('body,html').animate({scrollTop:position}, speed, "easeOutQuart");
      return false;
    });

    /* MailForm */
    function MailForm(){

        this.pm = new Object();

        this.is_sending_mail = false;

        this.pm.agent_id = $.cookie('agent_id');
        this.pm.ad_id = $.cookie('ad_id');
        this.pm.route_id = $.cookie('route_id');
        this.pm.referer = $.cookie('referer');

        // AF･･･1 自社･･･2
        this.pm.agent_kbn = $.cookie('agent_kbn');

        var status_id = Number($.cookie('status_id'));

        if (status_id < 3) {
            status_id = 3;
        }

        this.status_id = status_id;

        var self = this;

        self.update_status(status_id);

        self.init();
    }

    MailForm.prototype.init = function() {

        var self = this;

        self.initArrayMap();

        /* setEvent */

        $('#form__email_select_carrier').off('change');
        $('#form__email_select_carrier').on('change', function(){
            if ($(this).val() == 1001) {
                //selected order
                $('.form__item').eq(3).animate({ height: 'show' }, 500);
                $(this).parent().siblings('.form__input--email-account').prop('disabled', true);

            } else {
                $('.form__item').eq(3).animate({ height: 'hide' }, 500);
                $(this).parent().siblings('.form__input--email-account').prop('disabled', false);
            }
        });

        $('button.#form__submit').off('click');
        $('button.#form__submit').on('click', function() {

            if (! self.validated()) {
                return false;
            }

            if (self.is_sending_mail) {
                alert('処理中です。\nしばらくお待ち下さい。');
                return false;
            }

//            if (! confirm("この内容で相談します。\n送信してもよろしいですか？")) {
//                return false;
//            }

            self.sendMail();
        });

        $('button.#form__submit_2').off('click');
        $('button.#form__submit_2').on('click', function() {

            if (! self.validated2()) {
                return false;
            }

            if (self.is_sending_mail) {
                alert('処理中です。\nしばらくお待ち下さい。');
                return false;
            }

//            if (! confirm("この内容で相談します。\n送信してもよろしいですか？")) {
//                return false;
//            }

            self.sendMail();
        });
    };

    MailForm.prototype.initArrayMap = function(){
        var self = this;

        self.carrier_domains = [];
        self.carrier_domains[1] = 'gmail.com';
        self.carrier_domains[2] = 'yahoo.co.jp';
        self.carrier_domains[3] = 'icloud.com';
        self.carrier_domains[4] = 'docomo.ne.jp';
        self.carrier_domains[5] = 'ezweb.ne.jp';
        self.carrier_domains[6] = 'au.com';
        self.carrier_domains[7] = 'softbank.ne.jp';
        self.carrier_domains[8] = 'i.softbank.jp';

        self.housetypes = [];
        self.housetypes[1] = '戸建';
        self.housetypes[2] = 'マンション';
    }

    MailForm.prototype.formAction = function() {

    }

    MailForm.prototype.validated = function() {

        var self = this;
        let err = [];

        /** Required Item **/
        $('#form__item_tel').val(full2Half($('#form__item_tel').val()));
        if(empty($('#form__item_tel').val())){
            err.push('電話番号を入力して下さい。');
        } else if(! $('#form__item_tel').val().match(/^[0-9０-９]+$/) ){
            err.push('電話番号は数字で入力して下さい。');
        } else {

            if( $('#form__item_tel').val().match(/^(090|080|070)/) ){
                if ($('#form__item_tel').val().length != 11) {
                    err.push("電話番号は11ケタで入力して下さい。");
                }
            } else {
                if ( $('#form__item_tel').val().length < 10 || 11 < $('#form__item_tel').val().length ) {
                    err.push("電話番号は10ケタ、または11ケタで入力して下さい。");
                }
            }

            let ng_phones = [];
            ng_phones.push('12345678');
            ng_phones.push('11111111');
            ng_phones.push('22222222');
            ng_phones.push('33333333');
            ng_phones.push('44444444');
            ng_phones.push('55555555');
            ng_phones.push('66666666');
            ng_phones.push('77777777');
            ng_phones.push('88888888');
            ng_phones.push('99999999');

            let reg = new RegExp('('+ng_phones.join('|')+')$');
            if ($('#form__item_tel').val().match(reg)) {
                err.push("無効な電話番号です。");
            }
        }
        self.pm.tel = $('#form__item_tel').val();

        /* mail */
        if(!empty($('#form__item_email').val()) ){
            let check_mail = '';

            check_mail = $('#form__item_email').val();

            check_mail = full2Half(check_mail);
            if(!chMail(check_mail)) {
                err.push('正しいメールアドレスを入力して下さい。');
            } else {
                self.pm.email = check_mail;
            }
        }

        if(empty($('#form__prefectures-select').val())){
            err.push('都道府県を選択して下さい。');
        } else {
            self.pm.pref_id = $('#form__prefectures-select').val();
        }

        if(empty($('#sell-select').val())){
        	err.push('いつ頃にお取引したいかを選択して下さい。');
        } else {
        	self.pm.sell_time_id = $('#sell-select').val();
        }

        if(!empty($('#form__item_name').val())){
            self.pm.name = $('#form__item_name').val();
        }

        if(!empty($('input[name="housetype"]:checked').val())){
            self.pm.housetype = $('input[name="housetype"]:checked').val();
        }

        if(!empty($('#form__comment').val())){
            self.pm.comment = $('#form__comment').val();
        }

        if(err.length > 0) {
            alert(err.join('\n'));
            return false;
        }

        return true;
    };

    MailForm.prototype.validated2 = function() {

        var self = this;
        let err = [];

        /** Required Item **/
        $('#form__item_tel_2').val(full2Half($('#form__item_tel_2').val()));
        if(empty($('#form__item_tel_2').val())){
            err.push('電話番号を入力して下さい。');
        } else if(! $('#form__item_tel_2').val().match(/^[0-9０-９]+$/) ){
            err.push('電話番号は数字で入力して下さい。');
        } else {

            if( $('#form__item_tel_2').val().match(/^(090|080|070)/) ){
                if ($('#form__item_tel_2').val().length != 11) {
                    err.push("電話番号は11ケタで入力して下さい。");
                }
            } else {
                if ( $('#form__item_tel_2').val().length < 10 || 11 < $('#form__item_tel_2').val().length ) {
                    err.push("電話番号は10ケタ、または11ケタで入力して下さい。");
                }
            }

            let ng_phones = [];
            ng_phones.push('12345678');
            ng_phones.push('11111111');
            ng_phones.push('22222222');
            ng_phones.push('33333333');
            ng_phones.push('44444444');
            ng_phones.push('55555555');
            ng_phones.push('66666666');
            ng_phones.push('77777777');
            ng_phones.push('88888888');
            ng_phones.push('99999999');

            let reg = new RegExp('('+ng_phones.join('|')+')$');
            if ($('#form__item_tel_2').val().match(reg)) {
                err.push("無効な電話番号です。");
            }
        }
        self.pm.tel = $('#form__item_tel_2').val();

        /* mail */
        if(!empty($('#form__item_email_2').val())){
            let check_mail = '';

            check_mail = $('#form__item_email_2').val();

            check_mail = full2Half(check_mail);
            if(!chMail(check_mail)) {
                err.push('正しいメールアドレスを入力して下さい。');
            } else {
                self.pm.email = check_mail;
            }
        }

        if(empty($('#form__prefectures-select_2').val())){
            err.push('都道府県を選択して下さい。');
        } else {
            self.pm.pref_id = $('#form__prefectures-select_2').val();
        }

        if(empty($('#sell-select').val())){
        	err.push('いつ頃にお取引したいかを選択して下さい。');
        } else {
        	self.pm.sell_time_id = $('#sell-select').val();
        }

        if(!empty($('#form__item_name_2').val())){
            self.pm.name = $('#form__item_name_2').val();
        }

        if(!empty($('input[name="housetype2"]:checked').val())){
            self.pm.housetype = $('input[name="housetype2"]:checked').val();
        }

        if(!empty($('#form__comment_2').val())) {
            self.pm.comment = $('#form__comment_2').val();
        }

        if(err.length > 0) {
            alert(err.join('\n'));
            return false;
        }

        return true;
    };

    MailForm.prototype.sendMail = function() {

        var self = this;
        var php_name = "sim_cartoon.php";

        self.is_sending_mail = true;
        self.pm.type = 3;
        self.pm.route_id = $.cookie('route_id');

        $.ajax({
             url : 'js/' + php_name
            ,type:'post'
            ,data:self.pm
            ,dataType:'json'
        })
        .done(function(response) {

            if (response.err.length > 0) {
                alert(response.err.join("\n"));
                return false;
            }

            //thanks
            let url = 'contact_thanks.php?visitor_id=' + response.visitor_id;
            location.href = url;

        })
        .fail(function(jqXHR, textStatus, errorThrown) {
//            console.log("XMLHttpRequest:" + jqXHR.status);
//            console.log("textStatus:" + textStatus);
//            console.log("errorThrown:" + errorThrown);
        })
        .always(function(jqXHR, textStatus){
            self.is_sending_mail = false;
        });
    };

    MailForm.prototype.update_status = function(status_id) {

        var php_name = "sim_cartoon.php";

        var status_max = 3;

        var pm = new Object();

        pm.type = 5;
        pm.route_id = $.cookie('route_id');
        pm.status_id = status_id;

        if ($.cookie('status_id') <= status_max) {
            if ($.cookie('status_id') < status_id) {
                $.ajax({
                     type : 'POST'
                    ,url : 'js/' + php_name
                    ,data : pm
                    ,dateType : 'JSON'
                }).done(function(data) {
                    $.cookie("status_id", status_id, {
                        expires : 3,
                        path : '/',
                        domain : location.hostname
                    });
                }).fail(function(XMLHttpRequest, textStatus, errorThrown) {
//                            console.log("XMLHttpRequest : " + XMLHttpRequest.status);
//                            console.log("textStatus : " + textStatus);
//                            console.log("errorThrown : " + errorThrown.message);
                });
            }
        }
    };

    let mailFrom = new MailForm();

  });

})(jQuery);


function full2Half(str) {

    if (empty(str)) {
        return;
    }

    str = str.replace(/[ａ-ｚＡ-Ｚ０-９！-～]/g, function(s){
        return String.fromCharCode(s.charCodeAt(0) - 65248);
    });

    str = str.replace('￥', '\\');
    str = str.replace('’', '\'');
    str = str.replace('〜', '~');
    str = str.replace('　', ' ');

    return str;
}

function chMail(mf) {
    ml = /.+@.+\..+/;
    if (!mf.match(ml)) {
        return false;
    }
    return true;
}

function empty(val) {
    if(val == null || val == undefined || val == 0 || val == ''){
        return true;
    }

    if (val instanceof Array) {
        if (val.length == 0) {
            return true;
        }
    }

    return false;
}

//form text change color
function changeItem(obj){
  if( obj.value == 0 ){
    obj.style.color = '#d2d2d2';
  }
};
