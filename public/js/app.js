var app = {};
app.status			= {
	 pageid				:	"" //現在のページID
	,pages				:	{} //ページの読み込み状況を保持。pageid=>PAGE_STATUS
}
// 読み込んだページスクリプトを保持
var pages = {};

// ページ状態定数
var PAGE_STATUS		= {
	 LOADING		:	"loading"
	,LOADED			:	"loaded"
	,ERROR			:	"error"
};

// クライアント側の画面制御を行います
app.base		= {
	
	// ページの高さを画面に合わせます
	// ページ追加時や画面サイズ変更時に呼び出されるようになっています
	// ページスクリプトから明示的にコールする必要はありません
	adjustPageHeight		:	function(){
		var wh = $(window).height(); 
		$(".page").each(
			function(){
				if(wh != $(this).height()){
					$(this).css('height',wh+'px'); 
				}
			}
		);
	}
	
	// ページidを指定してそのページに移動します
	// ページスクリプト内から画面遷移したい時に任意にコールする事ができます
	// 親ページのhtml内にid=pageidのdiv要素が存在する必要があります
	,showPage				:	function(pageid,isUseCachedPage){
		if(app.status.pageid == pageid){return;}
		if(!$("#"+pageid).length){
			console.log("page not found : " + pageid);
			return;
		}
		var oldid = app.status.pageid;
		//現在のページのonLeaveイベントを呼出し
		//次のページを呼び出す際のパラメータも取得する
		var formData		= {};
		if(pages[oldid] && pages[oldid]["onLeave"]){
			pages[oldid]["onLeave"].apply(this,[formData]);
		}
		if(!pages[pageid] || !isUseCachedPage){
			//存在しないページ or キャッシュを使わない指定 の場合、ロード
			var confessid 				= app.base.fetchId();
			if(confessid){formData['_confessid'] = confessid;}
			app.status.pages[pageid]	= PAGE_STATUS.LOADING;
			console.log("request : page=[" + pageid + "]",formData);
			$("#"+pageid).empty();
			$.ajax({
				 type		:	"get"
				,data		:	formData
				,url		:	"/pages/" + pageid
				,error		:	function(XMLHttpRequest, textStatus, errorThrown){
					console.log("failed to load page:id=[" + pageid + "] status=[" + textStatus + "]");
					app.status.pages[pageid]		= PAGE_STATUS.ERROR;
				}
				,success	:	function(data){
					console.log("loaded : " + pageid);
					$("#"+pageid).append(data);
					if(!pages[pageid]){pages[pageid]	= {}};
					app.status.pages[pageid]		= PAGE_STATUS.LOADED;
					app.base.onShowPage(app.status.pageid,pageid,true);
				}
			});
		}else{
			app.base.onShowPage(app.status.pageid,pageid);
		}
		$('body').scrollTo('#'+pageid,{duration:'slow', offsetTop : '50'});
	}
	
	// 親ページのhtml内で、現在のページの直後にあるページに遷移します
	// 次のページは常にサーバからロードされます（「戻る→進む」のような操作をしても）
	// <div class="page-next">のナビゲーション要素を設置すると、クリック時にこのメソッドが自動でコールされます
	// ページスクリプト内から明示的にコールしても構いません
	,pageNext				:	function(pager){
		app.base.showPage($(pager).closest(".page").next(".page").attr("id"));
	}
	// 親ページのhtml内で、現在のページの直前にあるページに遷移します
	// 前のページが既に存在する場合、再読み込みせず、先に存在するページを表示します
	// <div class="page-prev">のナビゲーション要素を設置すると、クリック時にこのメソッドが自動でコールされます
	// ページスクリプト内から明示的にコールしても構いません
	,pagePrev				:	function(pager){
		app.base.showPage($(pager).closest(".page").prev(".page").attr("id"),true);
	}
	
	// ページ表示時のイベントハンドラ
	// ページスクリプトから明示的にコールする必要はありません
	,onShowPage				:	function(oldid,newid,isOnLoaded){
		app.status.pageid		= newid;
		console.log("page " + oldid + " to " + newid);
		//共通のロード処理
		if(isOnLoaded){
			app.base.onLoadPage(newid);
		}
		//新しいページ内のイベントハンドラを呼出し
		if(isOnLoaded && pages[newid] && pages[newid]["onLoad"]){
			pages[newid]["onLoad"].apply(this);
		}
		if(pages[newid] && pages[newid]["onShow"]){
			pages[newid]["onShow"].apply(this);
		}
	}
	
	// ページロードのイベントハンドラ
	// ページスクリプトから明示的にコールする必要はありません
	,onLoadPage				:	function(pageid){
		// ページ送りを初期化
		$("#" + pageid)
			.find(".navi-prev").click(function(){
				app.base.pagePrev(this);
			}).end()
			.find(".navi-next").click(function(){
				app.base.pageNext(this);
			}).end()
		;
		
	}
	
	// サイドバーの初期化
	// ページスクリプトから明示的にコールする必要はありません
	,initSidebar		:	function(){
		$( "#sidebar" ).load( '/pages/_sidebar.html' ).simpleSidebar({
			settings: {
				opener: "#sidebar-opener",
				wrapper: ".wrapper",
				animation: {
					easing: "easeOutQuint"
				}
			}
			,sidebar: {
				align: "left",
				width: 200,
				closingLinks: 'a',
			}
		});
	}
	
	// 親画面コール時のイベントハンドラ
	// ページスクリプトから明示的にコールする必要はありません
	,onLoad			:	function(){
		app.base.adjustPageHeight();
		
		var hash		= (window.location.hash||'').replace("#","");
		var startPage	= $(".page").eq(0).attr("id");
		if(hash && $("#"+hash).length){
			startPage = hash;
		}
		app.base.showPage(startPage);
        app.base.initSidebar();
	}
	
	// ウインドウリサイズ時のイベントハンドラ
	// ページスクリプトから明示的にコールする必要はありません
	,onresize		:	function(){
		app.base.adjustPageHeight();
	}

  // URL parameter の取得
  , fetchId : function() {
    var path = location.pathname;
    var splited = path.split('/')
    if (splited.length >= 3) {
      return splited[2];
    }
    return "";
  }
};


$(document).ready(function(){app.base.onLoad();});
$(window).resize(function(){app.base.onresize();});
