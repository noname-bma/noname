// TODO: pas complet et correct du tout encore ...

/**
 * CASTORE est un tableau associatif qui contient toutes les variables globales pertinentes.
 **/
var CASTORE = {};

/**
 * oauthConsumerKey est la clé, correspondante à notre application, qui nous a été donnée par le CASTore.
 **/
CASTORE.oauthConsumerKey    = null; // TODO: demander cette valeur, spécifique à chaque application, à CA-Store.
/**
 * oauthConsumerSecret est le secret, correspondant à notre application, qui nous a été donnée par le CASTore.
 **/
CASTORE.oauthConsumerSecret = null; // TODO: demander cette valeur, spécifique à chaque application, à CA-Store.
/**
 * oauthToken est le token d'identification retourné par getRequestToken.
 **/
CASTORE.oauthToken          = null;
CASTORE.oauthTokenSecret    = null;
CASTORE.oauthVerifier       = null;



CASTORE.buy = function (prix) {
    if (CASTORE.oauthToken == null) {
        CASTORE.getTokens ("CAStore");
    } 
    
};


CASTORE.userAuth = function  (){
    document.getElementById ("authWindow").display = "block";
    var url = "clients://www.creditagricolestore.fr/castore-data-provider/authentification";
    var params = {"oauth_token": CASTORE.oauthToken};
    var paramStr = paramsToStr (params);
    var client = new XMLHttpRequest();
    client.open ("POST", url, true);
    client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    client.setRequestHeader("Content-length", paramStr.length);
    client.setRequestHeader("Connection", "close");
    client.onreadystatechange = function() {//Call a function when the state changes.
        if(client.readyState == 4 && client.status == 200) {
            alert (client.responseText);
            var tmp = client.responseText.split ("&");
            CASTORE.oauthToken       = tmp[0].split ("=")[1];
            CASTORE.oauthTokenSecret = tmp[1].split ("=")[1];
        }
    }; client.send (paramStr);
}


/*
 * 
 * 
 * 
 * 
 * 
 */


consumer.CAStore =
{ consumerKey: CASTORE.oauthConsumerKey
, consumerSecret: CASTORE.oauthConsumerSecret
, serviceProvider:
  { signatureMethod     : "HMAC-SHA1"
  , requestTokenURL     : "https://www.creditagricolestore.fr/castore-oauth/resources/1/oauth/get_request_token"
  , userAuthorizationURL: null
  , accessTokenURL      : "https://www.creditagricolestore.fr/castore-oauth/resources/1/oauth/get_access_token"
  , echoURL             : null
  , userDataURL         : "https://www.creditagricolestore.fr/castore-data-provider/rest/V1/session"
  , virementURL         : "https://www.creditagricolestore.fr/castore-data-provider/rest/V1//utilisateurs/"+"1234365567676445"+"/comptesBAM/"+"213445657667544543"+"/comptesEmetteurs"
  }
};


/**
 * Cette fonction permet de demander les tokens au service web oAuth du CASTore.
 * from ../../lib/oauth_js/examples/Ajax.html
 **/
CASTORE.getTokens = function  (consumerName) {
    var accessor = consumer[consumerName];
    var message  = {method:"POST", action:"https://www.creditagricolestore.fr/castore-oauth/resources/1/oauth/get_request_token"};
    var requestBody = OAuth.formEncode(message.parameters);
    OAuth.completeRequest(message, accessor);
    var authorizationHeader = OAuth.getAuthorizationHeader("", message.parameters);
    var requestToken = newXMLHttpRequest();
    requestToken.onreadystatechange = function receiveRequestToken() {
        if (requestToken.readyState == 4) {
            var dump = requestToken.status+" "+requestToken.statusText
                  +"\n"+requestToken.getAllResponseHeaders()
                  +"\n"+requestToken.responseText;
            if (confirm(dump)) {
                var results = OAuth.decodeForm(requestToken.responseText);
                message = {method: "post", action: accessor.serviceProvider.accessTokenURL};
                CASTORE.oauthToken          = OAuth.getParameter(results, "oauth_token");
                CASTORE.oauthTokenSecret    = OAuth.getParameter(results, "oauth_token_secret");
                // TODO
                // ci dessous, entre BEGIN et END, on trouve le code de la librairie oauth_js pour obtenir les tokens d'accès pour un utilisateur.
                // ce code ne correspond pas au workflow utilisé par le crédit agricole ...
                // il faut donc modifier tout ce qui est entre BEGIN et END pour faire fonctioner l'API
                // ce qu'il faut faire: faire saisir à l'user de l'app son login/mdp et envoyer cela au webservice
                // Il faut envoyer l'user à cette adresse: "https://www.creditagricolestore.fr/castore-data-provider/authentification?oauth_token=" + CASTORE.oauthToken
                // Ensuite dans oauth l'user est redirigé vers l'url de callback
                // et avec une app comment on fait ??!!
                // subtilités de oauth avec des apps ... chercher des soluces sur le net elles existent !!
                // BEGIN
                OAuth.completeRequest(message,
                    { consumerKey   : accessor.consumerKey
                    , consumerSecret: accessor.consumerSecret
                    , token         : OAuth.getParameter(results, "oauth_token")
                    , tokenSecret   : OAuth.getParameter(results, "oauth_token_secret")
                    });
                var requestAccess = newXMLHttpRequest();
                requestAccess.onreadystatechange = function receiveAccessToken() {
                    if (requestAccess.readyState == 4) {
                        // TODO: Manager la réponse obtenue par la requête au webService à accessTokenURL. 
                        // Normalement on reçoit CASTORE.oauthToken, qu'on a déjà mais c'est pour auth la réponse, et CASTORE.oauthVerifier pour continuer à bosser sur cet user du CA.  
                        // Pour le moment qd on a pas fait cela, on se contente d'afficher le résult:
                        alert(requestAccess.status+" "+requestAccess.statusText
                              +"\n"+requestAccess.getAllResponseHeaders()
                              +"\n"+requestAccess.responseText);
                    }
                };requestAccess.open(message.method, message.action, true); 
                requestAccess.setRequestHeader("Authorization", OAuth.getAuthorizationHeader("", message.parameters));
                requestAccess.send();
                // END
            }
        }
    }; requestToken.open(message.method, message.action, true); 
    requestToken.setRequestHeader("Authorization", authorizationHeader);
    requestToken.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    requestToken.send(requestBody);
}




/**
 * Cette fonction est utilisé pour envoyer une requête HTTP REST oAuth.
 * La fonction est basée sur la fonction "getTokens" du fichier "../../lib/oauth_js/examples/Ajax.html".
 * consumerName: deprecated?
 * message: le message oAuth tel que décrit dans "../../lib/oauth_js/oauth.js".
 * foo: la fonction qui manage le résultat de la requête, si la requête a réussie. Sinon les cas d'erreur sont gérées par la fonction actuelle. 
 **/
CASTORE.sendHttpRestOAuthReq = function (consumerName, message, foo) {
    var accessor = consumer[consumerName];
    var requestBody = OAuth.formEncode(message.parameters);
    OAuth.completeRequest(message, accessor);
    var authorizationHeader = OAuth.getAuthorizationHeader("", message.parameters);
    var requestToken = newXMLHttpRequest();
    requestToken.onreadystatechange = function receiveRequestToken() {
        if (requestToken.readyState == 4) {
            var dump = requestToken.status+" "+requestToken.statusText
                  +"\n"+requestToken.getAllResponseHeaders()
                  +"\n"+requestToken.responseText;
            if (confirm(dump)) {
                var results = OAuth.decodeForm(requestToken.responseText);
                foo (results);
            }
        }
    }; requestToken.open(message.method, message.action, true); 
    requestToken.setRequestHeader("Authorization", authorizationHeader);
    requestToken.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    requestToken.send(requestBody);
}



/**
 * from ../../lib/oauth_js/examples/Ajax.html
 **/
function newXMLHttpRequest() {
    try{
        return new XMLHttpRequest();
    } catch(e) {
        try{
            return new ActiveXObject("Msxml2.XMLHTTP");
        } catch(e) {
            try{
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch(e) {
                alert("Sorry, your browser doesn't support AJAX.");
                throw e;
            }
        }
    }
}
