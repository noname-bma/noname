/**
 * 
 * Contient des variables globales pour ce fichier. 
 * 
 **/
ourCAStore = {
    caStore:null,
    CONSUMER_KEY: "https://www.creditagricolestore.fr/castore-oauth/resources/1/oauth/consumer/4e3837f1549e4704b9dca604d396e872",
    CONSUMER_SECRET: "9075a183a60c415f9f677a74b0bb35a8",
    BAMs: null,
    emitter: null,
    recipient: null,
    
};

/**
 * 
 * Méthode pour acheter des ressources ingame en effectuant un virement d'un de ses comptes à un autre (compte courant vers placement)
 * 
 */
ourCAStore.buyMoney = function (n) {
    console.log ("Début de la méthode d'achat de ressource ingame.");
    //step 1: création d'une structure de donnée pour la comm entre l'app et le CAStore: 
	if (ourCAStore.caStore == null){
		ourCAStore.caStore = new CAStore(
            ourCAStore.CONSUMER_KEY, 
            ourCAStore.CONSUMER_SECRET, 
            'http://localhost:8081/callback_url.html',  /* Callback url */
            'http://localhost:8080/'                    /* Proxy server address */ ); 
	} //document.getElementById("CAStoreScreenContainer").display = "block"; // NdV: à priori pas besoin, jQuery.show/hide do all the work.
	
    //step 2: authentification de l'user de l'app:
    ourCAStore.caStore.init (
        document.getElementById("CAStoreScreen")        /* Container for authentication iframe */, 
        function (err, caStore){
            if (err){
                return console.log('Error initializing CAStore comm object.', err);
            } $("#CAStoreScreenContainer").hide();
            ourCAStore.buyMoney3 (n);
        }
    );
}

ourCAStore.buyMoney3 = function (n) {
    //step 3: Récupération des comptes BAMs
    if (ourCAStore.BAMs == null){
        ourCAStore.caStore.session.GET('comptesBAM', function (err, response){
            if (err){
                return console.log('Error getting BAM from CAStore', err);
            } ourCAStore.BAMs = response.data.compteBAMDTOs;
            ourCAStore.buyMoney4 (n);
        });
    } else {
        ourCAStore.buyMoney4 (n);
    }
}
    
    
ourCAStore.buyMoney4 = function (n) {
    ourCAStore.BAM = ourCAStore.BAMs[0];
	//step 4: Récupération des comptes bénéficiaires de virement:
    var onBeneficiairesObtained = function (err, response){
        if (err){
            return console.log('Error getting Beneficiaires from CAStore', err);
        } ourCAStore.Beneficiaires = response.data.compteBeneficiaireDTOList;    
        ourCAStore.buyMoney5 (n);
    }; ourCAStore.caStore.session.GET('comptesBAM/'+ourCAStore.BAM.id+'/comptesBeneficiaires', onBeneficiairesObtained);
}
    

ourCAStore.buyMoney5 = function (n) {    
    var x = n*5;
    //step 5: Récupération des comptes  émetteurs de virement
    var onEmetteursObtained = function (err, response){
        if (err){
            return console.log('Error getting Emetteurs from CAStore', err);
        } ourCAStore.Emetteurs = response.data.compteBAMDTOs; 
        ourCAStore.buyMoney6 (n);       
    }; ourCAStore.caStore.session.GET('comptesBAM/'+ourCAStore.BAM.id+'/comptesEmetteurs', onEmetteursObtained);
}


ourCAStore.buyMoney6 = function (n) {
    //step 6: Saisie des paramètres de virements dans l'application (l'user choisit à qui l'argent doit être viré)
    if (ourCAStore.emitter == null){
        ourCAStore.emitter = ourCAStore.Emetteurs[0];
    } if (ourCAStore.recipient == null){
        ourCAStore.recipient = ourCAStore.Beneficiaires[0];
    }
    ourCAStore.buyMoney7 (n);
}

ourCAStore.buyMoney7 = function (n) {
    //step 7: Demande de virement:
    var route = 'castore-data-provider/authentification/virement?identifiantCompteBAM='+ourCAStore.BAM.id+"&identifiantCompteEmetteur="+ourCAStore.emitter.id+"&identifiantCompteBeneficiaire="+ourCAStore.recipient.id+"&montant="+666666+"&libelleVirement=test"+"&oauth_token="+ourCAStore.caStore.oauth.oauth_token;
    var onVirement = function (err, response){
        if (err){
            return console.log('Error getting Virement Data from CAStore', err);
        } alert (response);
    }; ourCAStore.caStore.session.GET(route, onVirement);
}
    
/*
ourCAStore.onCAStoreInitialized = function (err, caStore){
    $("#CAStoreScreenContainer").hide();
    if(err){
        return console.log('Error initializing CAStore', err);
    } sessionStore.save(caStore.export());
    ourCAStore.getBAM();
}
*/

/*
ourCAStore.getBAM = function(){
    ourCAStore.caStore.session.GET('comptesBAM', onBAMObtained);
    function onBAMObtained(err, response){
        if (err)
            return console.log('Error getting BAM from CAStore', err);
        var account = response.data.compteBAMDTOs[0];
        alert('BAM!\nId:' + account.id + '\nAlias: ' + account.alias);
    }
}

function onBAMObtained(err, response){
    if (err){
        return console.log('Error getting BAM from CAStore', err);
    } ourCAStore.BAMs = response.data.compteBAMDTOs;
}
*/
