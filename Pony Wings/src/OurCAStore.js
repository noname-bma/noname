  



var CONSUMER_KEY = "https://www.creditagricolestore.fr/castore-oauth/resources/1/oauth/consumer/4e3837f1549e4704b9dca604d396e872";
var CONSUMER_SECRET = "9075a183a60c415f9f677a74b0bb35a8";

var caStore = null;


ourCAStore = {};

/**
 * Si la var "caStore" n'est pas initialisée, on l'init.
 * Si l'application n'a pas ses tokens, on demande des tokens.
 * 
 */
ourCAStore.buyMoney = function (euros) {
	if (caStore == null){
		caStore = new CAStore(CONSUMER_KEY, CONSUMER_SECRET, 
            'http://localhost:8081/callback_url.html'   /* Callback url */, 
            'http://localhost:8080/'                    /* Proxy server address */ ); 
	} 
	document.getElementById("CAStoreScreenContainer").display = "block";
	caStore.init(
		document.getElementById("CAStoreScreen"), /* Container for authentication iframe */
		ourCAStore.onCAStoreInitialized);
	ourCAStore.getBAM();
}
    
    
ourCAStore.onCAStoreInitialized = function(err, caStore){
    document.getElementById("CAStoreScreenContainer").hide();
    document.getElementById("CAStoreScreenContainer").display = "none";
    if(err){
        return console.log('Error initializing CAStore', err);
    } sessionStore.save(caStore.export());
    ourCAStore.getBAM();
}
    
ourCAStore.getBAM = function(){
    caStore.session.GET('comptesBAM', onBAMObtained);
    function onBAMObtained(err, response){
        var account = response.data.compteBAMDTOs[0];
        alert('BAM!\nId:' + account.id + '\nAlias: ' + account.alias);
    }
}
