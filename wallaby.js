module.exports = function () {
    return {
        files: [
            'app/*.js',
            'app/*/*.js',
        ],

        tests: [
            'test/*.js',
            'test/*/*.js',
        ],
        testFramework: 'mocha',
        env: {
            type: 'node'
        },
        bootstrap: function (wallaby) {
            var mocha = wallaby.testFramework;
            mocha.ui('bdd');
            //require('should');
            //require('sinon');
        }
    };
};