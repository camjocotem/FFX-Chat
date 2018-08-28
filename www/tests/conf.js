/**
 * Created by Jonny on 11/03/2016.
 */
exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['./specs/**.spec.js'],
    onPrepare: function(){
        browser.driver.manage().window().setPosition(0,0);
        browser.driver.manage().window().maximize();
        browser.get('http://localhost:3000/#/home');
    },
    rootElement: 'body'
}