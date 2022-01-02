newFunc = () => {
    console.log('5');
};

joinMe = (path, filename) => {
    var name = [path, filename, '.json'].join('');
    console.log(name);
};

joinMe('I/am/', 'here');


newFunc();

