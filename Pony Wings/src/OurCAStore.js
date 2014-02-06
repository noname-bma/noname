  
function getBAM(){
    caStore.session.GET('comptesBAM', onBAMObtained);
    function onBAMObtained(err, response){
        var account = response.data.compteBAMDTOs[0];
        alert('BAM!\nId:' + account.id + '\nAlias: ' + account.alias);
    }
}


var CONSUMER_KEY = "https://www.creditagricolestore.fr/castore-oauth/resources/1/oauth/consumer/4e3837f1549e4704b9dca604d396e872";
var CONSUMER_SECRET = "9075a183a60c415f9f677a74b0bb35a8";

var caStore = new CAStore(
    CONSUMER_KEY,
    CONSUMER_SECRET,
    'http://localhost:8081/callback_url.html'/* Callback url */,
    'http://localhost:8080/' /* Proxy server address */);


    

    
    
