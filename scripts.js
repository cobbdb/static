Number.prototype.roundToFixed = function (radix) {
    var val = this;
    radix = radix || 0;

    val *= Math.pow(10, radix);
    val = Math.round(val);
    val /= Math.pow(10, radix);
    return val;
};

var Period = {
    week: 0,
    month: 1
};

function Program(name) {
    var StatGroup = function (name, period) {
        return {
            name: name,
            id: period,
            totalClosed: 0,
            successfulClosed: 0,
            successRate: '-'
        };
    };
    return {
        name: name,
        data: [
            StatGroup('week', Period.week),
            StatGroup('month', Period.month)
        ]
    };
}

function StaticController($scope) {
    var programNames = [
        'Janus',
        'Mobile',
        'Revenue',
        'Video',
        'On Demand',
        'Platform'
    ];
    
    $scope.programs = [];
    _(programNames).each(function (name) {
        $scope.programs.push(Program(name));
    });
    
    $scope.totals = Program();
    
    $scope.calculateRow = function (period) {
        try {
            var total = period.successfulClosed / period.totalClosed * 100;
            if (_(total).isFinite()) {
                period.successRate = total.roundToFixed();
            } else {
                throw new Error();
            }
        } catch (err) {
            period.successRate = '-';
        }
        return period.successRate;
    };
    
    $scope.sumTotalClosed = function (period) {
        var sum = 0;
        _($scope.programs).each(function (program) {
            sum += program.data[period].totalClosed;
        });
        $scope.totals.data[period].totalClosed = sum;
        return sum;
    };
    
    $scope.sumSuccessfulClosed = function (period) {
        var sum = 0;
        _($scope.programs).each(function (program) {
            sum += program.data[period].successfulClosed;
        });
        $scope.totals.data[period].successfulClosed = sum;
        return sum;
    };
}
