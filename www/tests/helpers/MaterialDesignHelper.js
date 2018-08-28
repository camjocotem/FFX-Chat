var MaterialDesignHelper = function () {
    this.selectDropdownByValue = function (el, optionValue) {
        if (optionNum) {
            var options = el.findElements(by.tagName('option'))
                .then(function (options) {
                    options[optionNum].click();
                });
        }
    }
    
    this.selectDropdownByText = function(el, optionText){
        if(optionText){
            el.click();
            element(By.cssContainingText('md-option', optionText)).click();
        }
    }
}

module.exports = MaterialDesignHelper;