export const environment = {
  production: true,
  //apiUrlLogin:'https://binding.rmutsv.ac.th/api/',
  //apiUrlLogin:'https://reg.rmutsv.ac.th/reg/api',
  //apiUrlPHP:'http://localhost/api_v2',
 // apiUrlLogin:'http://localhost/api_v2',
  //apiUrlPHP:'https://ruts.rmutsv.ac.th/api',
  //apiUrlLogin:'https://ruts.rmutsv.ac.th/api',

 // apiUrlPHP:'https://eis.rmutsv.ac.th/test/api',
  //apiUrlLogin:'https://eis.rmutsv.ac.th/test/api',

  //apiUrlPHP:'https://budget.rmutsv.ac.th/test/api',
  //apiUrlLogin:'https://budget.rmutsv.ac.th/test/api',https://pis.web2.rmutsv.ac.th/
    apiUrlPHP:'https://budget.rmutsv.ac.th/api',
    apiUrlLogin:'https://budget.rmutsv.ac.th/api',

    oidc: {
      issuer: 'https://sso.apps.rmutsv.ac.th/realms/apps',
      clientId: 'ruts-budget',
      dummyClientSecret: 'oOM8pJSvPCUDQd9dSuHO7vBUzAiDdoxTF5xj9vNB4NPUUYFDpxrrjvB7jeoq80rG6r754DVM6CYJ9ExjO820Mq',
      redirectUri: window.location.origin + '/login',
      postLogoutRedirectUri: window.location.origin + '/login',
      scope: 'openid profile email',
      usePkce: true,
      healthCheckTimeoutMs: 2000,
    }
};
