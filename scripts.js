Number.prototype.roundToFixed = function (radix) {
    var val = this;
    radix = radix || 0;

    val *= Math.pow(10, radix);
    val = Math.round(val);
    val /= Math.pow(10, radix);
    return val;
};

function Program(name) {
    var StatGroup = function (name) {
        return {
            name: name,
            totalClosed: 0,
            successfulClosed: 0,
            successRate: '-'
        };
    };
    return {
        name: name,
        data: [
            StatGroup('week'),
            StatGroup('month')
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
    
    var totals = Program();
    
    $scope.Period = {
        WEEK: 0,
        MONTH: 1
    };
    
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
        totals.data[period].totalClosed = sum;
        return sum;
    };
    
    $scope.sumSuccessfulClosed = function (period) {
        var sum = 0;
        _($scope.programs).each(function (program) {
            sum += program.data[period].successfulClosed;
        });
        totals.data[period].successfulClosed = sum;
        return sum;
    };
    
    $scope.sumTotals = function (period) {
        period = totals.data[period];
        return $scope.calculateRow(period);
    };
}
