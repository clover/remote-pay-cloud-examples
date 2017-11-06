/**
 * Created by rachel.antion on 11/2/17.
 */
export default class ConnectionHelper {

    constructor(){
        this.DOMAIN_KEY = 'server_url';
        this.DOMAIN_PATH = '{server_url}';
        this.OAUTH_CLIENT_ID_KEY = 'client_id';
        this.OAUTH_CLIENT_ID_SUFFIX = `&client_id={${this.OAUTH_CLIENT_ID_KEY}}`;
        this.OAUTH_CLIENT_SECRET_KEY = 'client_secret';
        this.OAUTH_CLIENT_SECRET_SUFFIX = `&client_secret={${this.OAUTH_CLIENT_SECRET_KEY}}`;
        this.OAUTH_CODE = 'code';
        this.OAUTH_CODE_SUFFIX = `&code={${this.OAUTH_CODE}}`;
        this.OAUTH_MERCHANT_ID_KEY = 'merchant_id';
        this.OAUTH_MERCHANT_ID_SUFFIX = `&merchant_id={${this.OAUTH_MERCHANT_ID_KEY}}`;
        this.OAUTH_PATH = 'oauth/authorize?response_type=token';
        this.OAUTH_PATH_TOKEN = 'oauth/token?response_type=token';
        this.OAUTH_REDIRECT_URI_KEY = 'redirect_uri';
        this.OAUTH_REDIRECT_URI_SUFFIX = `&redirect_uri={${this.OAUTH_REDIRECT_URI_KEY}}`;
    }

    getOAuthUrl(domain, clientId, merchantId, redirectUri){
        let variables = {};
        variables[this.DOMAIN_KEY] = domain;
        variables[this.OAUTH_CLIENT_ID_KEY] = clientId;
        let oauthEndpointPath = this.DOMAIN_PATH + this.OAUTH_PATH + this.OAUTH_CLIENT_ID_SUFFIX;
        if (merchantId) {
            variables[this.OAUTH_MERCHANT_ID_KEY] = merchantId;
            oauthEndpointPath += this.OAUTH_MERCHANT_ID_SUFFIX;
        }
        if (redirectUri) {
            variables[this.OAUTH_REDIRECT_URI_KEY] = encodeURIComponent(redirectUri);
            oauthEndpointPath += this.OAUTH_REDIRECT_URI_SUFFIX;
        }
        return this.setVariables(oauthEndpointPath, variables);
    }

    getOAuthTokenUrl(domain, clientId, clientSecret, code){
        console.log('this was called');
        let variables = {};
        variables[this.DOMAIN_KEY] = domain;
        variables[this.OAUTH_CLIENT_ID_KEY] = clientId;
        let oauthEndpointPath = this.DOMAIN_PATH + this.OAUTH_PATH_TOKEN + this.OAUTH_CLIENT_ID_SUFFIX;
        if (clientSecret) {
            variables[this.OAUTH_CLIENT_SECRET_KEY] = clientSecret;
            oauthEndpointPath += this.OAUTH_CLIENT_SECRET_SUFFIX;
        }
        if (code) {
            variables[this.OAUTH_CODE] = code;
            oauthEndpointPath += this.OAUTH_CODE_SUFFIX;
        }
        return this.setVariables(oauthEndpointPath, variables);
    }

    setVariables(template, variableMap){
        for (var key in variableMap) {
            if (variableMap.hasOwnProperty(key)) {
                var bracedKey = new RegExp(this.escapeRegExp("{" + key + "}"), "g");
                // If the value of DOMAIN_KEY does not have a trailing slash, add one.
                if (key === this.DOMAIN_KEY) {
                    variableMap[key] = this.appendTrailingSlashToDomain(variableMap[key]);
                }
                template = template.replace(bracedKey, variableMap[key]);
            }
        }
        return template;
    };

    appendTrailingSlashToDomain(domain){
        if (domain && domain.charAt(domain.length - 1) !== '/') {
            return `${domain}/`;
        }
        return domain;
    }

    escapeRegExp(stringToGoIntoTheRegex){
        return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
}