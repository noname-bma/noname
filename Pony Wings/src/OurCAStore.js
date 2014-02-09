  





ourCAStore = {recipient:null, caStore:null,
    CONSUMER_KEY: "https://www.creditagricolestore.fr/castore-oauth/resources/1/oauth/consumer/4e3837f1549e4704b9dca604d396e872",
    CONSUMER_SECRET: "9075a183a60c415f9f677a74b0bb35a8"
};

/**
 * Si la var "caStore" n'est pas initialisée, on l'init.
 * Si l'application n'a pas ses tokens, on demande des tokens.
 * 
 */
ourCAStore.buyMoney = function (euros) {
    console.log ("ici");
    // step 1: création d'une structure de donnée pour la comm entre l'app et le CAStore: 
	if (ourCAStore.caStore == null){
		ourCAStore.caStore = new CAStore(ourCAStore.CONSUMER_KEY, ourCAStore.CONSUMER_SECRET, 
            'http://localhost:8081/callback_url.html',  /* Callback url */
            'http://localhost:8080/'                    /* Proxy server address */ ); 
	} 
	document.getElementById("CAStoreScreenContainer").display = "block";
	// step 2: authentification de l'user de l'app:
    ourCAStore.caStore.init (document.getElementById("CAStoreScreen")/* Container for authentication iframe */, ourCAStore.onCAStoreInitialized);
	// step X: 
    ourCAStore.getBAM();
    // step X: Récupération des comptes des émetteurs et bénéficiaires de virement
    // step X: Saisie des paramètres de virements dans l'application (l'user choisit à qui l'argent doit être viré)
    if (ourCAStore.recipient == null){
        
    }
    // step X: Demande de virement
}
    
    
ourCAStore.onCAStoreInitialized = function (err, caStore){
    alert("ici bordel de shit");
    console.log("ici bordel de shit on essaie de cacher cette fenêtre de merde");
    ourCAStore.caStore.hide();
    //document.getElementById("CAStoreScreenContainer").hide();
    //document.getElementById("CAStoreScreenContainer").display = "none";
    
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
