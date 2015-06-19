'@Request'
'@BeforeLoadContainer'
function User(){

    "@Put('/save')"
    '@InjectAnnotated'
    this.update = function(user) {
        return userService.update(user);
    };

    // @Get('/find')
    this.get = function() {
        return userService.getAll();
    };

}