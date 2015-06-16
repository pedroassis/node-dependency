
// @BeforeLoadContainer
function User (httpConfig) {
    
    // @InjectAnnotated(target=@BeforeLoadContainer)
    this.get = function get (items) {
        console.log(items);
    }

}
